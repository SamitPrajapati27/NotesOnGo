import { ReactNode } from "react";

//Buttons Types//
export type DropdownData = {
  text?: string;
  icon?: string;
  action: () => void;
  tooltip: string;
};

export type DropdownObject = {
  icon?: string;
  text?: string;
  tooltip: string;
  data: Array<DropdownData>;
  isOpen?: boolean;
  onToggle?: (id: string) => void;
  id?: string;
  pos?: 'up' | 'down' | 'left' | 'right';
};

export type ButtonObject = {
  icon?: string;
  text?: string;
  action?: () => void;
  tooltip: string;
  type?: 'normal' | 'last' | 'dropdown' | 'dropdown-open';
  position?: 'up' | 'down' | 'left' | 'right';
  extra?: string;
};

//Settings//
export type SettingData = {
  accent: "blue"| "green" | "purple" | "red" | "orange";
  font: "Default" | "Elegant" | "Funt";
  spacing: Number;
}
export const settingsOptions = {
  accent: ["blue", "green", "purple", "red", "orange"],
  font: ["Default", "Elegant", "Funt"],
  spacing: [10, 12, 14, 16],
} satisfies { [K in keyof SettingData]: SettingData[K][] }


//Other//
export type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: ReactNode;
};

export type NoteData = {
  title: string;
  data: Array<String>;
}

export type shortcutData = {
  shortcut: string;
  action: string;
};

export type fileData = {
  fileName: string;
  fileType: "md" | "txt" | "json";
}