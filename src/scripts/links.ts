import { Editor, Element, Range, Transforms } from "slate";
import { normalizeLinkUrl } from "./urls.ts";

/**
 * Extend Slate’s inline-element check so link elements can live inside text blocks.
 */
export function withLinks<T extends Editor>(editor: T): T {
  const { isInline } = editor;
  editor.isInline = (element) => element.type === "link" || isInline(element);
  return editor;
}

/**
 * Find the link above the current selection, or return undefined when none exists.
 */
export function linkAtSelection(editor: Editor) {
  if (!editor.selection) return undefined;
  return Editor.above(editor, { match: (node) => Element.isElement(node) && node.type === "link" });
}

/**
 * Restore a saved selection and unwrap its links while preserving their text.
 */
export function removeLink(editor: Editor, selection: Range) {
  Transforms.select(editor, selection);
  Transforms.unwrapNodes(editor, { match: (node) => Element.isElement(node) && node.type === "link", split: true });
}

/**
 * Insert or replace a validated link, preserving selected text and marks when possible.
 * @param editor The Slate editor to modify.
 * @param selection The selection captured before opening the dialog.
 * @param label The display text, falling back to the normalized URL.
 * @param input The address entered by the user.
 * @throws Error If the address uses an invalid or unsupported URL format.
 */
export function insertLink(editor: Editor, selection: Range, label: string, input: string) {
  const url = normalizeLinkUrl(input);
  if (!url) throw new Error("Enter a valid web, email, or phone link.");
  Editor.withoutNormalizing(editor, () => {
    Transforms.select(editor, selection);
    const existing = linkAtSelection(editor);
    if (existing) Transforms.select(editor, Editor.range(editor, existing[1]));
    const text = label || url;
    const keepText = editor.selection && !Range.isCollapsed(editor.selection) && Editor.string(editor, editor.selection) === text;
    Transforms.unwrapNodes(editor, { match: (node) => Element.isElement(node) && node.type === "link", split: true });
    if (keepText) {
      Transforms.wrapNodes(editor, { type: "link", url, children: [] }, { split: true });
      Transforms.collapse(editor, { edge: "end" });
    } else {
      const marks = Editor.marks(editor) || {};
      Transforms.insertNodes(editor, { type: "link", url, children: [{ ...marks, text }] });
    }
  });
  Transforms.move(editor, { unit: "offset" });
}
