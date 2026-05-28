import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";

// No real Idea what this is, but could be useful in the future
export type CustomElement = {
  type: string;
  children: CustomText[];
};

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}