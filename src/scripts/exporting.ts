import type { Descendant } from "slate";
import type { NoteData, fileData } from "../types/BasicTypes";

type FileType = fileData["fileType"];

/**
 * Flatten a Slate node to plain text, separating nested blocks with newlines.
 */
function plainText(node: Descendant): string {
  if ("text" in node) return node.text;
  const separator = node.children.some((child) => "children" in child) ? "\n" : "";
  return node.children.map(plainText).join(separator);
}

/**
 * Serialize inline text, marks, and links while escaping literal Markdown punctuation.
 */
function inlineMarkdown(node: Descendant): string {
  if (!("text" in node)) {
    const content = node.children.map(inlineMarkdown).join("");
    if (node.type === "link" && node.url) return `[${content}](<${node.url.replace(/>/g, "%3E")}>)`;
    return content;
  }
  // Escape literal Markdown punctuation before applying Slate's formatting.
  let text = node.text.replace(/([\\`*_[\]{}<>#!|~+\-.])/g, "\\$1");
  if (!text.trim()) return text;
  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  text = text.trim();
  if (node.bold) text = `**${text}**`;
  if (node.italic) text = `*${text}*`;
  if (node.underline) text = `<u>${text}</u>`;
  return leading + text + trailing;
}

/**
 * Serialize a block as Markdown, including headings and nested or checked list items.
 */
function markdown(node: Descendant, depth = 0): string {
  if ("text" in node) return inlineMarkdown(node);
  if (["bulleted-list", "numbered-list", "letter-list", "task-list"].includes(node.type)) {
    return node.children.map((child, index) => {
      const task = !("text" in child) && child.type === "task-item";
      const prefix = task ? `- [${child.checked ? "x" : " "}] `
        : ["numbered-list", "letter-list"].includes(node.type) ? `${index + 1}. ` : "- ";
      const content = "text" in child ? inlineMarkdown(child) : child.children.map((part) =>
        "children" in part && part.type !== "link" ? `\n${markdown(part, depth + 1)}` : inlineMarkdown(part),
      ).join("");
      return `${"  ".repeat(depth)}${prefix}${content}`;
    }).join("\n");
  }
  const heading = { "heading-one": "# ", "heading-two": "## ", "heading-three": "### " };
  const prefix = node.type in heading ? heading[node.type as keyof typeof heading] : "";
  return prefix + inlineMarkdown(node);
}

/**
 * Convert a note into Markdown, plain text, or a complete JSON representation.
 * @param note The note to serialize.
 * @param type The requested file format.
 * @returns The contents to write to the exported file.
 */
export function serializeNote(note: NoteData, type: FileType): string {
  if (type === "json") return JSON.stringify(note, null, 2);
  if (type === "txt") return note.data.map(plainText).join("\n");
  return note.data.map((node) => markdown(node)).join("\n\n") + "\n";
}

/**
 * Sanitize the requested base name and append exactly one supported file extension.
 */
export function exportFilename(name: string, type: FileType): string {
  const base = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
    .trim().replace(/\.(md|txt|json)$/i, "").replace(/[. ]+$/g, "").slice(0, 150);
  return `${base || "Untitled Note"}.${type}`;
}

/**
 * Download a serialized note through a temporary Blob URL and release it afterward.
 */
export function downloadNote(note: NoteData, name: string, type: FileType): void {
  const mimeTypes = { md: "text/markdown", txt: "text/plain", json: "application/json" };
  const blob = new Blob([serializeNote(note, type)], { type: `${mimeTypes[type]};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = exportFilename(name, type);
  document.body.appendChild(link);
  try { link.click(); }
  finally {
    link.remove();
    // Give the browser time to start reading the Blob before releasing it.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
}
