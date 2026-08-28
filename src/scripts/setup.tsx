import { DropdownData, shortcutData, SettingData } from "../types/BasicTypes";
import { formatBlocks, toggleBlock, toggleHeading, toggleList } from "./engine";
import { useState } from "react";
import { Editor } from "slate";
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

// Used for Settings //
export function useSettings(){
    const [settings, setSettings] = useState<SettingData>({
      accent: "purple",
      font: "Default",
      spacing: 10,
    });
    return {settings, setSettings};
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
export function createListDropdown(editor: Editor): DropdownData[] {
  return [
    [
      "material-symbols:format-list-bulleted-rounded",
      "bullet",
      "bulleted-list",
    ],
    [
      "material-symbols:format-list-numbered-rounded",
      "number",
      "numbered-list",
    ],
    ["material-symbols:checklist-rounded", "checklist", "task-list"],
  ].map((item) =>
    ezCreateDDD(
      item[1],
      () => {
        toggleList(editor, item[2]);
      },
      item[0],
      undefined,
    ),
  );
}

export function createHeadingDropdown(editor: Editor): DropdownData[] {
  return [
    ["Heading 1", "heading-one"],
    ["Heading 2", "heading-two"],
    ["Heading 3", "heading-three"],
    ["Normal Text", "paragraph"],
  ].map((item) =>
    ezCreateDDD(
      item[0],
      () => {
        toggleHeading(editor, item[1]);
        console.log("Clicked Format");
      },
      undefined,
      item[0],
    ),
  );
}
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

export const PUExportDDD: DropdownData[] = ["md", "txt", "json"].map((text) =>
  ezCreateDDD(text, () => formatBlocks(text), undefined, text),
);

export function getWordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const words = trimmed.match(/[\p{L}\p{N}\p{M}]+/gu);

  return words ? words.length : 0;
}
