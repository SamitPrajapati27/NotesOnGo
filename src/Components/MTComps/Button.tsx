import { Icon } from "@iconify/react";
import { ButtonObject } from "../../types/Button";
import "../../../app/ButtonStyle.css";

export default function Button({
  icon,
  text,
  action,
  tooltip,
  type,
  position = "down",
}: ButtonObject) {
  const endIcon =
    type === "dropdown"
      ? "material-symbols:arrow-drop-down-rounded"
      : type === "dropdown-open"
        ? "material-symbols:arrow-drop-up-rounded"
        : undefined;

  return (
    <div className="relative inline-block font-sans">
      <button className={`btn peer text-sm`} onClick={action ?? (() => {})}>
        <div className="flex items-center gap-1">
          {icon ? (
            <Icon icon={icon ?? "material-symbols:error"} />
          ) : (
            text && <span className="">{text}</span>
          )}
          {endIcon && <Icon icon={endIcon} />}
        </div>
      </button>
      <div
        data-position={position}
        className={`tooltip tooltip-${position} hidden scale-95 transition-all duration-150 peer-hover:block peer-hover:scale-100`}>
        {tooltip}
      </div>
    </div>
  );
}
