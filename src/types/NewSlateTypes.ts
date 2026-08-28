import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

export type CustomElement =
  | { type: "paragraph"; children: any[] }
  | { type: "heading-one"; children: any[] }
  | { type: "heading-two"; children: any[] }
  | { type: "heading-three"; children: any[] }
  | { type: "numbered-list"; children: any[] }
  | { type: "bulleted-list"; children: any[] }
  | { type: "letter-list"; children: any[] }
  | { type: "task-list"; children: any[] }
  | { type: "task-item"; checked: boolean; children: any[] }
  | { type: "list-item"; children: any[] };

export type CustomText = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  heading?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
