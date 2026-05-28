import { DropdownObject } from "@/src/types/BasicTypes";
import Button from "./Button";
import { useState } from "react";
export default function DropButton({
  icon,
  text,
  tooltip,
  data,
  isOpen = false,
  onToggle,
  id = "",
  pos
}: DropdownObject) {
  const handleToggle = () => {
    if (onToggle) {
      onToggle(isOpen ? "" : id);
    }
  };
  const [displayIcon, setDisplayIcon] = useState<string | undefined>(icon);
  const [displayText, setDisplayText] = useState<string | undefined>(text);
  const handleItemClick = (item: (typeof data)[0]) => {
    if (item.icon) {
      setDisplayIcon(item.icon);
      setDisplayText(undefined);
    } else if (item.text) {
      setDisplayIcon(undefined);
      setDisplayText(item.text);
    }
    item.action();
    if (onToggle) {
      onToggle("");
    }
  };
  return (
    <div className="relative inline-block z-50">
      <Button
        icon={displayIcon}
        text={displayText ?? "btn"}
        action={handleToggle}
        tooltip={tooltip}
        position={pos? pos : "down"}
        type={isOpen ? "dropdown-open" : "dropdown"}
      />
      {isOpen && (
        <ul className="absolute bg-white border border-border rounded-lg mt-2 text-center">
          {data.map((item, index) => (
            <li key={index}>
              <Button
                icon={item.icon}
                text={item.text}
                action={() => handleItemClick(item)}
                tooltip={item.tooltip}
                position={pos? pos : "right"}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
