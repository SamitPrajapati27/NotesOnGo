import { DropdownData, shortcutData, SettingData } from "../types/BasicTypes";
import { formatBlocks, toggleHeading, toggleList } from "./engine";
import { useEffect, useState } from "react";
import { Editor, Element } from "slate";
/**
 * Build a dropdown item, using its tooltip as the fallback display text.
 * @param tooltip Accessible description of the action.
 * @param action Callback invoked when the item is selected.
 * @param icon Optional Iconify icon identifier.
 * @param text Optional display text overriding the tooltip.
 * @returns A menu item ready for the shared dropdown component.
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
/**
 * Initialize session-only display preferences and expose their state setter.
 */
export function useSettings() {
  const [settings, setSettings] = useState<SettingData>({
    accent: "purple",
    font: "Default",
    spacing: 10,
    toolTip: true,
    markdownShortcuts: true,
  });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem("notes-on-go-preferences") || "{}",
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSettings((previous) => ({
        ...previous,
        ...(typeof saved.markdownShortcuts === "boolean"
          ? { markdownShortcuts: saved.markdownShortcuts }
          : {}),
        ...(typeof saved.toolTip === "boolean"
          ? { toolTip: saved.toolTip }
          : {}),
      }));
    } catch {
      /* Optional preferences must never prevent opening notes. */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(
        "notes-on-go-preferences",
        JSON.stringify({
          markdownShortcuts: settings.markdownShortcuts,
          toolTip: settings.toolTip,
        }),
      );
    } catch {
      /* Keep preferences usable for this session when storage is unavailable. */
    }
  }, [loaded, settings.markdownShortcuts, settings.toolTip]);
  return { settings, setSettings };
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
/**
 * Build bullet, numbered, and task-list actions for the supplied Slate editor.
 */
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
        toggleList(editor, item[2] as Element["type"]);
      },
      item[0],
      undefined,
    ),
  );
}

/**
 * Build heading-level and normal-text actions for the supplied Slate editor.
 */
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
        toggleHeading(editor, item[1] as Element["type"]);
      },
      undefined,
      item[0],
    ),
  );
}
/**
 * Build font choices that call the parent’s font-change callback.
 */
export function createFontDropdown(
  onChange: (font: SettingData["font"]) => void,
): DropdownData[] {
  return (["Default", "Elegant", "Fun"] as const).map((font) =>
    ezCreateDDD(font, () => onChange(font), undefined, font),
  );
}

// Popups //
/**
 * Manage a dialog’s visibility and expose its title, open/close actions, and shared props.
 */
export function usePopup(title: string) {
  const [isOpen, setIsOpen] = useState(false);
  /**
   * Open the dialog controlled by this hook.
   */
  const open = () => setIsOpen(true);
  /**
   * Close the dialog controlled by this hook.
   */
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
    shortcut: "⌘ / Ctrl + B",
    action: "Bold",
  },
  {
    shortcut: "⌘ / Ctrl + I",
    action: "Italic",
  },
  {
    shortcut: "⌘ / Ctrl + U",
    action: "Underline",
  },
  { shortcut: "⌘ / Ctrl + K", action: "Insert or edit link" },
  { shortcut: "⌘ / Ctrl + Z", action: "Undo" },
  { shortcut: "⌘ / Ctrl + Shift + Z", action: "Redo" },
];

/**
 * Count contiguous Unicode letter, number, and combining-mark groups in trimmed text.
 */
export function getWordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  const words = trimmed.match(/[\p{L}\p{N}\p{M}]+/gu);

  return words ? words.length : 0;
}

// Shared file transfer configuration.
export const noteFileFormats = [
  {
    type: "md",
    title: "Markdown",
    detail: "Text with formatting",
    icon: "material-symbols:markdown-outline-rounded",
  },
  {
    type: "txt",
    title: "Txt File",
    detail: "Just the words",
    icon: "material-symbols:description-outline-rounded",
  },
  {
    type: "json",
    title: "JSON",
    detail: "Keep all note formatting",
    icon: "material-symbols:inventory-2-outline-rounded",
  },
] as const;

export const noteFileConfig = {
  defaultFormat: "md",
  defaultTitle: "Untitled Note",
  maxFileBytes: 1_000_000,
  maxBatchBytes: 5_000_000,
} as const;
export const noteFileAccept = noteFileFormats
  .map((format) => `.${format.type}`)
  .join(",");
export const saveConfirmationDuration = 1800;

export const markdownGuide = [
  ["**bold** or __bold__", "Bold"],
  ["*italic* or _italic_", "Italic"],
  ["***bold italic***", "Bold + italic"],
  ["# / ## / ### + Space", "Headings 1–3"],
  ["- / * / + + Space", "Bullet list"],
  ["1. + Space", "Numbered list"],
  ["[ ] / [x] + Space", "Task list"],
  ["[text](https://…)", "Link"],
];

export const toggleSizes = {
  sm: { width: 36, height: 20 },
  md: { width: 44, height: 24 },
  lg: { width: 60, height: 32 },
};
