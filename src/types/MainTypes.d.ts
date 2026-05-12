export type PopupProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.node;
};

export type Note = {
  title: string;
  data: JSON;
}
