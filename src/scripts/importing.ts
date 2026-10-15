import { marked, type Token, type Tokens } from "marked";
import type { Descendant } from "slate";
import type { CustomElement, CustomText } from "../types/NewSlateTypes";
import type { NoteData } from "../types/BasicTypes";
import { createNote, isNote } from "./dataBase.ts";
import { normalizeLinkUrl } from "./urls.ts";

type Inline = CustomElement | CustomText;
/**
 * Read a Markdown token’s text when available, falling back to its raw source.
 */
function tokenText(token: Token): string {
  return "text" in token && typeof token.text === "string" ? token.text : token.raw;
}
/**
 * Return nested Markdown tokens when the token exposes a token array.
 */
function tokenChildren(token: Token): Token[] | undefined {
  return "tokens" in token && Array.isArray(token.tokens) ? token.tokens : undefined;
}
/**
 * Decode supported named and numeric HTML entities without interpreting markup.
 */
function decodeText(text: string): string {
  const named: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };
  return text.replace(/&(#x[\da-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (whole, entity: string) => {
    if (!entity.startsWith("#")) return named[entity.toLowerCase()] || whole;
    const code = entity[1].toLowerCase() === "x" ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
    return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : whole;
  });
}
/**
 * Convert Markdown inline tokens into Slate text and links, carrying inherited emphasis marks.
 */
function inline(tokens: Token[], marks: Omit<CustomText, "text"> = {}): Inline[] {
  const result: Inline[] = [];
  let underline = marks.underline;
  for (const token of tokens) {
    if (token.type === "checkbox") continue;
    const current = { ...marks, ...(underline ? { underline: true } : {}) };
    if (token.type === "strong" || token.type === "em") {
      result.push(...inline((token as Tokens.Strong).tokens, { ...current, [token.type === "strong" ? "bold" : "italic"]: true }));
    } else if (token.type === "link") {
      const link = token as Tokens.Link;
      const url = normalizeLinkUrl(link.href);
      const children = inline(link.tokens, current);
      if (url) result.push({ type: "link", url, children: children.length ? children : [{ text: link.text }] });
      else result.push(...children);
    } else if (token.type === "html" && /^<\/?u>$/i.test(token.raw)) {
      underline = !token.raw.startsWith("</");
    } else if (token.type === "br") result.push({ ...current, text: "\n" });
    else if (token.type === "text" && token.tokens) result.push(...inline(token.tokens, current));
    else result.push({ ...current, text: decodeText(tokenText(token)) });
  }
  return result.length ? result : [{ text: "" }];
}
/**
 * Convert Markdown blocks into supported Slate elements, flattening unsupported structures to text.
 */
function blocks(tokens: Token[]): CustomElement[] {
  const result: CustomElement[] = [];
  for (const token of tokens) {
    if (token.type === "space" || token.type === "def") continue;
    if (token.type === "heading") {
      const heading = token as Tokens.Heading;
      result.push({ type: heading.depth === 1 ? "heading-one" : heading.depth === 2 ? "heading-two" : "heading-three", children: inline(heading.tokens) });
    } else if (token.type === "list") {
      const list = token as Tokens.List;
      result.push({ type: list.items.some((item) => item.task) ? "task-list" : list.ordered ? "numbered-list" : "bulleted-list",
        children: list.items.map((item) => {
          const children: Inline[] = [];
          for (const part of item.tokens) {
            if (part.type === "checkbox") continue;
            if (part.type === "list") children.push(...blocks([part]));
            else if (part.type !== "space") {
              if (children.length && "text" in children[children.length - 1]) children.push({ text: "\n" });
              children.push(...inline(tokenChildren(part) || marked.Lexer.lexInline(tokenText(part))));
            }
          }
          return { type: item.task ? "task-item" : "list-item", ...(item.task ? { checked: Boolean(item.checked) } : {}), children: children.length ? children : [{ text: "" }] };
        }),
      });
    } else if (token.type === "blockquote") result.push(...blocks((token as Tokens.Blockquote).tokens));
    else if (token.type === "table") {
      const table = token as Tokens.Table;
      for (const row of [table.header, ...table.rows]) result.push({ type: "paragraph", children: [{ text: row.map((cell) => cell.text).join(" | ") }] });
    } else result.push({ type: "paragraph", children: tokenChildren(token) ? inline(tokenChildren(token)!) : [{ text: decodeText(tokenText(token)) }] });
  }
  return result.length ? result : [{ type: "paragraph", children: [{ text: "" }] }];
}

/** Import as a copy: existing notes and IDs are never replaced. HTML stays inert text. */
export function importNoteFile(filename: string, contents: string): NoteData[] {
  if (new TextEncoder().encode(contents).length > 1_000_000) throw new Error(`${filename}: maximum file size is 1 MB.`);
  const extension = filename.split(".").pop()?.toLowerCase();
  if (!["md", "txt", "json"].includes(extension || "")) throw new Error(`${filename}: use .md, .txt, or .json.`);
  const text = contents.replace(/^\uFEFF/, "");
  if (extension === "json") {
    let value: unknown;
    try { value = JSON.parse(text); } catch { throw new Error(`${filename}: invalid JSON.`); }
    const candidates = typeof value === "object" && value !== null && "notes" in value ? (value as { notes: unknown }).notes : [value];
    if (!Array.isArray(candidates) || !candidates.length || !candidates.every(isNote)) throw new Error(`${filename}: not a valid Notes on Go export.`);
    return candidates.map((note) => ({ ...note, id: crypto.randomUUID() }));
  }
  const note = createNote();
  note.title = filename.replace(/\.(md|txt)$/i, "") || "Imported Note";
  note.data = extension === "md" ? blocks(marked.lexer(text)) as Descendant[]
    : text.replace(/\r\n?/g, "\n").split("\n").map((line) => ({ type: "paragraph", children: [{ text: line }] }));
  if (!isNote(note)) throw new Error(`${filename}: the document structure is not supported.`);
  return [note];
}


/** Read a complete selection atomically, keeping the queued batch within its limits. */
export async function readNoteFiles(
  files: readonly Pick<File, "name" | "size" | "text">[],
  limits: { maxFileBytes: number; maxBatchBytes: number },
  queuedBytes = 0,
): Promise<{ notes: NoteData[]; bytes: number }> {
  const bytes = files.reduce((total, file) => total + file.size, 0);
  if (queuedBytes + bytes > limits.maxBatchBytes) {
    throw new Error(`Select up to ${limits.maxBatchBytes / 1_000_000} MB of files at a time.`);
  }
  const batches = await Promise.all(files.map(async (file) => {
    if (file.size > limits.maxFileBytes) {
      throw new Error(`${file.name}: maximum file size is ${limits.maxFileBytes / 1_000_000} MB.`);
    }
    let contents: string;
    try { contents = await file.text(); }
    catch { throw new Error(`${file.name}: could not read this file. Please select it again.`); }
    return importNoteFile(file.name, contents);
  }));
  return { notes: batches.flat(), bytes };
}
