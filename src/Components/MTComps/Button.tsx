import { Icon } from "@iconify/react";
type props = {
  icon: string;
  action?: () => void;
  tooltip: string;
  type?: string;
};

export default function Button({ icon, action, tooltip, type }: props) {
  return (
    <div className="relative inline-block font-sans">
      <button
        className="peer p-1 rounded-md hover:bg-gray-100"
        onClick={action ?? (() => {})}>
        <Icon icon={icon} />
      </button>

      <div
        className="
        absolute left-1/2 -translate-x-1/2 mt-2
        whitespace-nowrap
        rounded bg-black text-white text-sm px-1 py-0.5
        opacity-0 scale-95
        transition-all duration-150
        peer-hover:opacity-100 peer-hover:scale-100
      ">
        {tooltip}
      </div>
    </div>
  );
}
