import { Editor, Element, Range, Text, Transforms } from "slate";
import { HistoryEditor } from "slate-history";
import { normalizeLinkUrl } from "./urls.ts";

/** Typed shortcuts only: pasted content, expanded selections, and existing links stay literal. */
export function withMarkdownShortcuts<T extends Editor>(editor: T, enabled: () => boolean = () => true): T {
  const { insertText } = editor;
  editor.insertText = (text, options) => {
    const eligible = enabled() && text.length === 1 && editor.selection && Range.isCollapsed(editor.selection);
    insertText(text, options);
    if (!eligible || !editor.selection || !Range.isCollapsed(editor.selection)) return;
    if (Editor.above(editor, { match: n => Element.isElement(n) && n.type === "link" })) return;
    const point = editor.selection.anchor;
    const [leaf] = Editor.node(editor, point.path);
    if (!Text.isText(leaf)) return;
    const before = leaf.text.slice(0, point.offset);
    const block = Editor.above(editor, { match: n => Element.isElement(n) && !editor.isInline(n), mode: "lowest" });
    const run = (action: () => void) => {
      const apply = () => Editor.withoutNormalizing(editor, action);
      if (HistoryEditor.isHistoryEditor(editor)) HistoryEditor.withNewBatch(editor, apply);
      else apply();
    };
    // A space commits block markers at the beginning of an ordinary paragraph.
    if (text === " " && block && Element.isElement(block[0]) && block[0].type === "paragraph") {
      const range = { anchor: Editor.start(editor, block[1]), focus: point };
      const prefix = Editor.string(editor, range);
      const heading = /^(#{1,3}) $/.exec(prefix);
      const task = /^(?:- )?\[([ xX])\] $/.exec(prefix);
      const list = /^[-*+] $/.test(prefix) ? "bulleted-list" : /^1[.)] $/.test(prefix) ? "numbered-list" : task ? "task-list" : null;
      if (heading || list) {
        run(() => {
          Transforms.delete(editor, { at: range });
          if (heading) {
            const type = (["heading-one", "heading-two", "heading-three"] as const)[heading[1].length - 1];
            Transforms.setNodes(editor, { type }, { at: block[1] });
          } else if (list) {
            Transforms.setNodes(editor, { type: task ? "task-item" : "list-item", ...(task ? { checked: task[1].toLowerCase() === "x" } : {}) }, { at: block[1] });
            Transforms.wrapNodes(editor, { type: list, children: [] }, { at: block[1] });
          }
        });
        return;
      }
    }
    // Completing - [ ] after the bullet shortcut turns that item into a task.
    if (text === " " && block && Element.isElement(block[0]) && block[0].type === "list-item") {
      const range = { anchor: Editor.start(editor, block[1]), focus: point };
      const task = /^\[([ xX])\] $/.exec(Editor.string(editor, range));
      if (task) {
        run(() => {
          Transforms.delete(editor, { at: range });
          Transforms.unwrapNodes(editor, { match: n => Element.isElement(n) && ["bulleted-list", "numbered-list"].includes(n.type), split: true });
          Transforms.setNodes(editor, { type: "task-item", checked: task[1].toLowerCase() === "x" }, { match: n => Element.isElement(n) && n.type === "list-item" });
          Transforms.wrapNodes(editor, { type: "task-list", children: [] }, { match: n => Element.isElement(n) && n.type === "task-item" });
        });
        return;
      }
    }
    const link = /(^|[\s(])\[([^\[\]\n]+)\]\(([^\s()]+)\)$/.exec(before);
    if (text === ")" && link) {
      const url = normalizeLinkUrl(link[3]);
      if (!url) return;
      const start = point.offset - (link[0].length - link[1].length);
      run(() => {
        Transforms.select(editor, { anchor: { path: point.path, offset: start }, focus: point });
        Transforms.insertNodes(editor, { type: "link", url, children: [{ ...leaf, text: link[2] }] });
        Transforms.move(editor, { unit: "offset" });
      });
      return;
    }
    if (text !== "*" && text !== "_") return;
    const patterns = [
      { expression: /(^|[\s([{])\*\*\*([^*\n]+)\*\*\*$/, marks: { bold: true, italic: true } },
      { expression: /(^|[\s([{])\*\*([^*\n]+)\*\*$/, marks: { bold: true } },
      { expression: /(^|[\s([{])__([^_\n]+)__$/, marks: { bold: true } },
      { expression: /(^|[\s([{])\*([^*\n]+)\*$/, marks: { italic: true } },
      { expression: /(^|[\s([{])_([^_\n]+)_$/, marks: { italic: true } },
    ];
    for (const { expression, marks } of patterns) {
      const match = expression.exec(before);
      if (!match || !match[2].trim() || /^\s|\s$/.test(match[2])) continue;
      const start = point.offset - (match[0].length - match[1].length);
      const previousMarks = Editor.marks(editor);
      run(() => {
        Transforms.select(editor, { anchor: { path: point.path, offset: start }, focus: point });
        Transforms.insertNodes(editor, { ...leaf, ...marks, text: match[2] });
        Transforms.collapse(editor, { edge: "end" });
      });
      // Delimiters finish the style; subsequent typing retains the earlier marks.
      editor.marks = previousMarks;
      return;
    }
  };
  return editor;
}
