export type DropdownData = {
  text?: string;
  icon?: string;
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
};