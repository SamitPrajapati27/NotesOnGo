import { Icon } from "@iconify/react";
import { ButtonObject } from "../../types/BasicTypes";
import "../../../app/ButtonStyle.css";

export default function Button({
  icon,
  text,
  action,
  tooltip,
  type,
  position = "down",
  extra,
}: ButtonObject) {
  const endIcon =
    type === "dropdown"
      ? "material-symbols:arrow-drop-down-rounded"
      : type === "dropdown-open"
        ? "material-symbols:arrow-drop-up-rounded"
        : undefined;
  return (
    <div className="relative inline-block font-sans">
      <button
        className={`btn peer text-sm ` + extra}
        onClick={action ?? (() => {})}>
        <div className="flex items-center gap-1">
          {icon ? (
            <Icon icon={icon ?? "material-symbols:error"} />
          ) : (
            text && <span className="mx-auto">{text}</span>
          )}
          {endIcon && <Icon icon={endIcon} />}
        </div>
      </button>
      <div
        data-position={position}
        className={`tooltip tooltip-${position} z-50 hidden scale-95 transition-all ease-in-out duration-500 peer-hover:block peer-hover:scale-100`}>
        {tooltip}
      </div>
    </div>
  );
}
