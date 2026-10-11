import {
  RenderLeafProps,
  RenderElementProps,
  ReactEditor,
  useSlateStatic,
} from "slate-react";
import { Editor, Transforms } from "slate";
import Button from "@/src/Components/MTComps/Button";
import { normalizeLinkUrl } from "./urls";
/**
 * Render a Slate text leaf with its bold, italic, and underline marks.
 */
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

export { isMarkActive, isBlockActive, toggleBlock, toggleList, toggleHeading, clearFormat, changeIndent } from "./formatting";

/**
 * Log a requested format for the legacy dropdown placeholder; no editor changes are applied.
 */
export function formatBlocks(args: string) {
  console.log(args);
  return null;
}

/* This is for the other format, may cause error(by Chat)*/
interface BlockWrapperProps extends RenderElementProps {
  children: React.ReactNode;
}

/**
 * Wrap children with element indentation and alignment; the active renderer does not use this wrapper.
 */
export const BlockWrapper = ({ element, children }: BlockWrapperProps) => {
  const indent = element.indent || 0;
  const align = element.align || "left";
  const style: React.CSSProperties = {
    paddingLeft: indent > 0 ? `${indent * 24}px` : undefined,
    textAlign: align !== "left" ? align : undefined,
  };
  return <div style={style}>{children}</div>;
};

/**
 * Render supported Slate block and link elements, including interactive task checkboxes.
 */
export const RenderElement = (props: RenderElementProps & { onEditLink?: () => void }) => {
  const { children, element } = props;
  const attributes = {
    ...props.attributes,
    style: element.type === "link" ? undefined : {
      marginLeft: element.indent ? `${element.indent * 24}px` : undefined,
      textAlign: element.align,
    },
  };
  const editor = useSlateStatic();
  /**
   * Choose the HTML element and interaction handlers for the current Slate element type.
   */
  const innerEle = () => {
    switch (element.type) {
      case "link":
        return <a {...attributes} href={normalizeLinkUrl(element.url || "") || undefined} target="_blank" rel="noopener noreferrer"
          title="Click to edit; ⌘/Ctrl-click to open" className="underline decoration-accent underline-offset-2 cursor-pointer hover:bg-accent/20 rounded-sm"
          onClick={(event) => {
            if (event.metaKey || event.ctrlKey) return;
            event.preventDefault();
            const path = ReactEditor.findPath(editor, element);
            Transforms.select(editor, Editor.range(editor, path));
            props.onEditLink?.();
          }}>{children}</a>;
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
            <span contentEditable={false} onMouseDown={(event) => event.preventDefault()} className="inline-flex align-middle">
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
              tooltip={element.checked ? "Mark incomplete" : "Mark complete"}
            />
            </span>
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
