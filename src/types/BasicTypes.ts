import { ReactNode, Dispatch, SetStateAction } from "react";

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
  tooltip?: string;
  type?: 'normal' | 'last' | 'dropdown' | 'dropdown-open';
  position?: 'up' | 'down' | 'left' | 'right';
  extra?: string;
};

export type ToggleObject = {
  checked: boolean;
  action: () => void;
}

//Settings//
export const accents = {
  blue: {
    hex: "#3b82f6",
    text: "text-blue-400",
  },
  green: {
    hex: "#22c55e",
    text: "text-green-400",
  },
  purple: {
    hex: "#c4b5fd",
    text: "text-purple-400",
  },
  red: {
    hex: "#ef4444",
    text: "text-red-400",
  },
  orange: {
    hex: "#f97316",
    text: "text-orange-400",
  },
} as const;
export type Accent = keyof typeof accents;

export type SettingData = {
  accent: Accent;
  font: "Default" | "Elegant" | "Fun";
  spacing: Number;
  toolTip: boolean;
}
export const settingsOptions = {
  accent: ["blue", "green", "purple", "red", "orange"],
  font: ["Default", "Elegant", "Fun"],
  spacing: [10, 12, 14, 16],
  toolTip: [true,false],
} satisfies { [K in keyof SettingData]: SettingData[K][] }

export type SettingState = {
  settings: SettingData;
  setSettings: Dispatch<SetStateAction<SettingData>>;
};

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