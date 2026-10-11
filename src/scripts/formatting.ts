import { Editor, Element, Transforms, type Node } from "slate";
import { HistoryEditor } from "slate-history";

export const LIST_TYPES: Element["type"][] = ["numbered-list", "bulleted-list", "letter-list", "task-list"];
export type Mark = "bold" | "italic" | "underline";

/** Identify content blocks without matching inline links or list containers. */
export function isContentBlock(editor: Editor, node: Node): node is Element {
  return Element.isElement(node) && !editor.isInline(node) && !LIST_TYPES.includes(node.type);
}

/** Group a compound command into one undo step and normalize only its final document. */
function batch(editor: Editor, action: () => void) {
  if (HistoryEditor.isHistoryEditor(editor)) HistoryEditor.withNewBatch(editor, () => Editor.withoutNormalizing(editor, action));
  else Editor.withoutNormalizing(editor, action);
}

/** Return whether the selection has the requested text mark. */
export function isMarkActive(editor: Editor, format: string): boolean {
  return Editor.marks(editor)?.[format as Mark] === true;
}

/** Toggle a mark without changing the editor's selection. */
export function toggleMark(editor: Editor, format: Mark) {
  if (!editor.selection) return;
  if (isMarkActive(editor, format)) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
}

/** Check the selected blocks and their ancestors for a requested block type. */
export function isBlockActive(editor: Editor, format: string): boolean {
  if (!editor.selection) return false;
  const [match] = Editor.nodes(editor, { match: (node) => Element.isElement(node) && node.type === format });
  return Boolean(match);
}

/** Unwrap selected list containers while preserving unselected list items. */
function unwrapLists(editor: Editor) {
  Transforms.unwrapNodes(editor, {
    match: (node) => Element.isElement(node) && LIST_TYPES.includes(node.type),
    split: true,
    mode: "all",
  });
}

/** Toggle headings or paragraphs without converting inline links into block nodes. */
export function toggleBlock(editor: Editor, format: Element["type"]) {
  if (!editor.selection) return;
  if (LIST_TYPES.includes(format)) { toggleList(editor, format); return; }
  const type = isBlockActive(editor, format) ? "paragraph" : format;
  batch(editor, () => {
    unwrapLists(editor);
    const match = (node: Node) => isContentBlock(editor, node);
    Transforms.setNodes(editor, { type }, { match });
    Transforms.unsetNodes(editor, "checked", { match });
  });
}

/** Switch or toggle a list while preserving text, links, and unselected siblings. */
export function toggleList(editor: Editor, format: Element["type"]) {
  if (!editor.selection || !LIST_TYPES.includes(format)) return;
  const active = isBlockActive(editor, format);
  batch(editor, () => {
    unwrapLists(editor);
    const match = (node: Node) => isContentBlock(editor, node);
    Transforms.setNodes(editor, { type: active ? "paragraph" : format === "task-list" ? "task-item" : "list-item" }, { match });
    if (format === "task-list" && !active) Transforms.setNodes(editor, { checked: false }, { match });
    else Transforms.unsetNodes(editor, "checked", { match });
    if (!active) Transforms.wrapNodes(editor, { type: format, children: [] }, { match });
  });
}

/** Apply the requested heading level or return an active heading to a paragraph. */
export function toggleHeading(editor: Editor, format: Element["type"]) { toggleBlock(editor, format); }

/** Remove selected text styling, links, list structure, indentation, and alignment. */
export function clearFormat(editor: Editor) {
  if (!editor.selection) return;
  batch(editor, () => {
    unwrapLists(editor);
    Transforms.unwrapNodes(editor, { match: (node) => Element.isElement(node) && node.type === "link", split: true });
    const match = (node: Node) => isContentBlock(editor, node);
    Transforms.setNodes(editor, { type: "paragraph" }, { match });
    Transforms.unsetNodes(editor, ["indent", "align", "checked"], { match });
    for (const mark of ["bold", "italic", "underline"] as const) Editor.removeMark(editor, mark);
  });
}

/** Adjust each selected content block's indentation independently, bounded from zero to 31. */
export function changeIndent(editor: Editor, operation: "increase" | "decrease") {
  if (!editor.selection) return;
  batch(editor, () => {
    const blocks = [...Editor.nodes<Element>(editor, {
      at: Editor.unhangRange(editor, editor.selection!),
      match: (node) => isContentBlock(editor, node),
      mode: "lowest",
    })];
    for (const [node, path] of blocks) {
      const indent = Math.max(0, Math.min(31, (node.indent || 0) + (operation === "increase" ? 1 : -1)));
      if (indent) Transforms.setNodes(editor, { indent }, { at: path });
      else Transforms.unsetNodes(editor, "indent", { at: path });
    }
  });
}
