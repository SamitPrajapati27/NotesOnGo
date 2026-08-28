import { toggleBlock } from "./engine";
import { Element, Editor, Transforms } from "slate";

export function handleKeyDown(event: React.KeyboardEvent, editor: Editor) {
  // 1. Filter out keys we don't care about immediately
  if (event.key !== "Backspace" && event.key !== "Enter") return;
  // 2. Find the generic active block node where the cursor is sitting
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && !editor.isInline(n),
    mode: "lowest",
  });

  if (!match) return;
  const [node, path] = match;
  // =========================================================
  // BACKSPACE KEY BEHAVIOR
  // =========================================================
  if (event.key === "Backspace") {
    // Only intercept backspace if we are inside an EMPTY list item
    const isListItem = Element.isElement(node) && node.type === "list-item";
    const isEmpty = Editor.string(editor, path) === "";

    if (isListItem && isEmpty) {
      event.preventDefault();
      toggleBlock(editor, "bulleted-list"); // Assuming this unwraps the list
    }
    return;
  }

  // =========================================================
  // ENTER KEY BEHAVIOR
  // =========================================================
  if (event.key === "Enter") {
    // SCENARIO A: User presses Enter on a heading block
    const isHeading =
      Element.isElement(node) &&
      ["heading-one", "heading-two", "heading-three"].includes(node.type);

    if (isHeading) {
      event.preventDefault(); // Stop Slate from copying the heading format

      // Force insert a clean paragraph underneath
      Transforms.insertNodes(editor, {
        type: "paragraph",
        children: [{ text: "" }],
      });
      return;
    }

    // SCENARIO B: User presses Enter on an EMPTY list item
    const isListItem = Element.isElement(node) && node.type === "list-item";
    const isEmpty = Editor.string(editor, path) === "";

    if (isListItem && isEmpty) {
      event.preventDefault(); // Stop Slate from creating another bullet

      // Convert the line to a normal paragraph block
      Transforms.setNodes(editor, {
        type: "paragraph",
      });

      // Break it out of the container layout structure
      Transforms.unwrapNodes(editor, {
        match: (n) =>
          Element.isElement(n) &&
          [
            "bulleted-list",
            "numbered-list",
            "letter-list",
            "task-list",
          ].includes(n.type),
        split: true,
      });
      return;
    }
  }
}
