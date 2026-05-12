export type ButtonObject = {
  icon?: string;
  text?: string;
  action?: () => void;
  tooltip: string;
  type?: 'normal' | 'last' | 'dropdown' | 'dropdown-open';
  position?: 'up' | 'down' | 'left' | 'right';
  extra?: string;
};