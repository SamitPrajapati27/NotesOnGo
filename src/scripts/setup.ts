import { DropdownData, shortcutData } from "../types/BasicTypes";
import { formatBlocks } from "./engine";
import { useState } from "react";
/**
 * Used for Creating DDD date on the fly
 * @param tooltip
 * @param icon
 * @param text
 * @returns
 */
function ezCreateDDD(
  tooltip: string,
  action: () => void,
  icon?: string,
  text?: string,
): DropdownData {
  const newData: DropdownData = {
    text: text || tooltip,
    icon,
    tooltip,
    action,
  };
  return newData;
}

// Used for ToolBar //
export const dropdownListIcons = [
  ["material-symbols:format-list-bulleted-rounded", "bullet"],
  ["material-symbols:format-list-numbered-rounded", "number"],
  ["material-symbols:checklist-rounded", "checklist"],
];
export const TBListDDD: DropdownData[] = dropdownListIcons.map((icon) =>
  ezCreateDDD(icon[1], () => formatBlocks(icon[1]), icon[0], undefined),
);
export const TBHeadDDD: DropdownData[] = [
  "Heading 1",
  "Heading 2",
  "Heading 3",
].map((text) => ezCreateDDD(text, () => formatBlocks(text), undefined, text));
export const TBFontsDDD: DropdownData[] = ["Default", "Elegant", "Fun"].map(
  (font) => ezCreateDDD(font, () => formatBlocks(font), undefined, font),
);

// Popups //

export function usePopup(title: string) {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return {
    isOpen,
    open,
    close,
    title,
    popupProps: {
      isOpen,
      onClose: close,
      title,
    },
  };
}
export type PopupController = ReturnType<typeof usePopup>;

export const shortcuts: Array<shortcutData> = [
  {
    shortcut: "⌘ + B",
    action: "Bold",
  },
  {
    shortcut: "⌘ + I",
    action: "Italic",
  },
  {
    shortcut: "⌘ + U",
    action: "Underline",
  },
];

export const PUExportDDD: DropdownData[] = ["md","txt","json"].map((text) => ezCreateDDD(text, () => formatBlocks(text), undefined, text));