import { Editor, Element, Range, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { toggleBlock, toggleMark, type Mark } from "./formatting.ts";

type KeyEvent = Pick<React.KeyboardEvent, "key" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "preventDefault">;

/** Handle formatting, history, heading breaks, and exits from empty list or task items. */
export function handleKeyDown(event: KeyEvent, editor: Editor) {
  if (!editor.selection) return;
  if ((event.metaKey || event.ctrlKey) && !event.altKey) {
    const key = event.key.toLowerCase();
    const mark = ({ b: "bold", i: "italic", u: "underline" } as Record<string, Mark>)[key];
    if (mark) { event.preventDefault(); toggleMark(editor, mark); return; }
    if (HistoryEditor.isHistoryEditor(editor) && (key === "z" || key === "y")) {
      event.preventDefault();
      if (key === "y" || event.shiftKey) HistoryEditor.redo(editor);
      else HistoryEditor.undo(editor);
      return;
    }
  }
  if (event.key !== "Backspace" && event.key !== "Enter") return;
  if (event.shiftKey || event.altKey || event.metaKey || event.ctrlKey) return;
  const [match] = Editor.nodes(editor, {
    match: (node) => Element.isElement(node) && !editor.isInline(node), mode: "lowest",
  });
  if (!match || !Element.isElement(match[0])) return;
  const [node, path] = match;
  const item = node.type === "list-item" || node.type === "task-item";
  if (item && Range.isCollapsed(editor.selection) && Editor.string(editor, path) === "") {
    event.preventDefault();
    toggleBlock(editor, "paragraph");
    return;
  }
  if (event.key === "Enter" && (["heading-one", "heading-two", "heading-three"].includes(node.type) || node.type === "task-item")) {
    event.preventDefault();
    /** Split at the cursor so text after it moves into the new paragraph or unchecked task. */
    const split = () => Editor.withoutNormalizing(editor, () => {
      Editor.insertBreak(editor);
      Transforms.setNodes(editor, node.type === "task-item" ? { checked: false } : { type: "paragraph" }, {
        match: (candidate) => Element.isElement(candidate) && !editor.isInline(candidate), mode: "lowest",
      });
    });
    if (HistoryEditor.isHistoryEditor(editor)) HistoryEditor.withNewBatch(editor, split);
    else split();
  }
}
