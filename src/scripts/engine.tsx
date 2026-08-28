import {
  RenderLeafProps,
  useSlate,
  RenderElementProps,
  ReactEditor,
  useSlateStatic,
} from "slate-react";
import { Editor, Element, Transforms } from "slate";
import Button from "@/src/Components/MTComps/Button";
export const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let style = "";
  if (leaf.bold) {
    style += " font-bold"
  }
  if (leaf.italic) {
    style += " italic"
  }
  if (leaf.underline) {
    style += " underline"
  }

  return <span {...attributes} className={style}>{children}</span>;
};

export function isMarkActive(editor: Editor, format: string) {
  const marks = Editor.marks(editor);
  if (!marks) return;
  return marks ? marks[format] === true : false;
}

export function isBlockActive(editor: Editor, format: string) {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === format,
  });
  return !!match;
}

export function formatBlocks(args: string) {
  console.log(args);
  return null;
}

/* This is for the other format, may cause error(by Chat)*/
interface BlockWrapperProps extends RenderElementProps {
  children: React.ReactNode;
}

export const BlockWrapper = ({ element, children }: BlockWrapperProps) => {
  const indent = (element as any).indent || 0;
  const align = (element as any).align || "left";
  const style: React.CSSProperties = {
    paddingLeft: indent > 0 ? `${indent * 24}px` : undefined,
    textAlign: align !== "left" ? align : undefined,
  };
  return <div style={style}>{children}</div>;
};

export const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props;
  const editor = useSlateStatic();
  const innerEle = () => {
    switch (element.type) {
      case "paragraph":
        return <p {...attributes}>{children}</p>;
      case "heading-one":
        return (
          <h1 {...attributes} className="text-3xl font-bold">
            {children}
          </h1>
        );

      case "heading-two":
        return (
          <h2 {...attributes} className="text-2xl font-bold">
            {children}
          </h2>
        );

      case "heading-three":
        return (
          <h3 {...attributes} className="text-xl font-bold">
            {children}
          </h3>
        );

      case "numbered-list":
        return (
          <ol {...attributes} className="list-decimal pl-6">
            {children}
          </ol>
        );

      case "letter-list":
        return (
          <ol {...attributes} type="a" className="list-[lower-alpha] pl-6">
            {children}
          </ol>
        );

      case "bulleted-list":
        return (
          <ul {...attributes} className="list-disc pl-6">
            {children}
          </ul>
        );

      case "task-list":
        return (
          <ul {...attributes} className="task-list">
            {children}
          </ul>
        );

      case "list-item":
        return <li {...attributes}>{children}</li>;

      case "task-item":
        return (
          <li {...attributes} className="space-x-2">
            <Button
              icon={
                element.checked
                  ? "mdi:radio-button-checked"
                  : "mdi:radio-button-unchecked"
              }
              action={() => {
                const path = ReactEditor.findPath(editor, element);
                Transforms.setNodes(
                  editor,
                  { checked: !element.checked },
                  { at: path },
                );
              }}
              type="normal"
              tooltip=""
            />
            <span className={element.checked ? "line-through" : ""}>
              {children}
            </span>
          </li>
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  };
  return (
      innerEle()
  );
};

const LIST_TYPES = [
  "numbered-list",
  "bulleted-list",
  "letter-list",
  "task-list",
];

export function toggleBlock(editor: Editor, format: string) {
  const isActive = isBlockActive(editor, format);
  
  Transforms.setNodes(
    editor,
    { type: isActive ? 'paragraph' : format },
    { match: n => Element.isElement(n) && !Editor.isEditor(n) }
  );
}

export function toggleList(editor: Editor, format: string) {
  const isActive = isBlockActive(editor, format);
  const isList = ['numbered-list', 'bulleted-list','task-list'].includes(format);
  const isTask = ['task-list'].includes(format);

  // Unwrap any existing list structures first
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      Element.isElement(n) &&
      ['numbered-list', 'bulleted-list', 'task-list'].includes(n.type),
    split: true,
  });

  // Turn the current block into a list-item if activating, or paragraph if deactivating
  Transforms.setNodes(
    editor,
    { type: isActive ? 'paragraph' : isList ? isTask? 'task-item' : 'list-item' : format },
    { match: n => Element.isElement(n) && !Editor.isEditor(n) }
  );

  // If activating, wrap the list items in the parent list container
  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

export function toggleHeading(editor: Editor, format: string) {
  // Headings behave just like standard blocks (toggle between the heading level and paragraph)
  toggleBlock(editor, format);
}
export function clearFormat(editor: Editor) {
  Transforms.unwrapNodes(editor, {
    match: (n) => Element.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  });

  Transforms.setNodes(editor, {
    type: "paragraph",
    indent: 0,
    align: 0,
  } as any);

  if (editor.selection) {
    const marks = Editor.marks(editor);
    if (marks) {
      Object.keys(marks).forEach((mark) => {
        Editor.removeMark(editor, mark);
      });
    }
  }
}

export const changeIndent = (
  editor: Editor,
  operation: "increase" | "decrease",
) => {
  if (!editor.selection) return;

  const selection = Editor.unhangRange(editor, editor.selection);
  const [match] = Editor.nodes(editor, {
    at: selection,
    match: (n) => Element.isElement(n) && !editor.isInline(n),
    mode: "lowest",
  });

  if (!match) return;
  const [node, path] = match;

  const currentIndent = (node as any).indent || 0;

  let newIndent =
    operation === "increase" ? currentIndent + 1 : currentIndent - 1;
  if (newIndent < 0) newIndent = 0;
  else if (newIndent >= 32) newIndent = 31;
  Transforms.setNodes(
    editor,
    {
      indent: newIndent === 0 ? undefined : newIndent,
    } as any,
    {
      at: selection,
      match: (n) => Element.isElement(n) && !editor.isInline(n),
    },
  );
};
