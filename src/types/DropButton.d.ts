export type DropdownData = {
  text: string;
  icon: string;
};

export type DropdownObject = {
  icon?: string;
  text?: string;
  tooltip: string;
  data: Array<DropdownData>;
};