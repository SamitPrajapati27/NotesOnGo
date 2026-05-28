import { RenderLeafProps,useSlate } from "slate-react";
import { Editor,Element } from "slate";
export const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}; 

export function isMarkActive(editor: Editor, format: string) {
  const marks = Editor.marks(editor);
  return marks? marks[format] === true : false;
}

export function isBlockActive(editor: Editor, format: string) {
  const [match] = Editor.nodes(editor, {
    match: (n) => Element.isElement(n) && n.type === format,
  });
  return !!match;
}

export function formatBlocks(args: string){
  console.log(args)
  return null
}