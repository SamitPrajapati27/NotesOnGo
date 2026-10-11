import { DropdownObject } from "@/src/types/BasicTypes";
import Button from "./Button";
import { useState } from "react";
/**
 * Render a controlled dropdown and display the selected item’s icon or label.
 */
export default function DropButton({
  icon,
  text,
  tooltip,
  data,
  isOpen = false,
  onToggle,
  id = "",
  pos,
  menuDirection = "down",
}: DropdownObject) {
  /**
   * Ask the parent to open this dropdown or close it when already open.
   */
  const handleToggle = () => {
    if (onToggle) {
      onToggle(isOpen ? "" : id);
    }
  };
  const [displayIcon, setDisplayIcon] = useState<string | undefined>(icon);
  const [displayText, setDisplayText] = useState<string | undefined>(text);
  /**
   * Apply the selected menu action, update its label, and close the dropdown.
   */
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
    <div className="relative z-50 inline-block">
      <Button
        icon={displayIcon}
        text={(id === "fonts" ? text : displayText) ?? "btn"}
        action={handleToggle}
        tooltip={tooltip}
        position={pos? pos : "down"}
        type={isOpen ? "dropdown-open" : "dropdown"}
      />
      {isOpen && (
        <ul className={`popup-enter absolute right-0 z-50 min-w-max bg-secondary-bg text-foreground border border-primary-border rounded-lg text-center p-1 space-y-1 shadow-lg ${menuDirection === "up" ? "bottom-full mb-2" : "top-full mt-2"}`}>
          {data.map((item, index) => (
            <li key={index}>
              <Button
                icon={item.icon}
                text={item.text}
                action={() => handleItemClick(item)}
                tooltip={item.tooltip}
                position={pos? pos : "right"}
                fullWidth
                extra="w-full whitespace-nowrap !text-sm"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
