import type { CSSProperties } from "react";
import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";

export type CustomElement = {
  type: "paragraph" | "heading-one" | "heading-two" | "heading-three"
    | "numbered-list" | "bulleted-list" | "letter-list" | "task-list"
    | "task-item" | "list-item" | "link";
  url?: string;
  children: (CustomElement | CustomText)[];
  checked?: boolean;
  indent?: number;
  align?: CSSProperties["textAlign"];
};

export type CustomText = {
  text: string;
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
