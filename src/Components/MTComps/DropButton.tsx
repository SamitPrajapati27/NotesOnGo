import { useState } from "react";
import { DropdownObject } from "@/src/types/DropButton";
import Button from "./Button"; // adjust path as needed

export default function DropButton({ icon, text, tooltip, data }: DropdownObject) {
  const [toggle, setToggle] = useState(false);

  // Local state to track the currently selected icon
  const [currentIcon, setCurrentIcon] = useState<string | undefined>(icon);

  const handleToggle = () => setToggle((prev) => !prev);

  // Handle clicking a dropdown item
  const handleSelect = (itemIcon: string) => {
    setCurrentIcon(itemIcon);
    setToggle(false); 
  };

  return (
    <div className="relative inline-block">
      {/* Main Button */}
      <Button
        icon={currentIcon}
        text={text ?? "btn"}
        action={handleToggle}
        tooltip={tooltip}
      />

      {/* Dropdown List */}
      {toggle && (
        <ul className="absolute bg-white">
          {data.map((item, index) => (
            <li key={index}>
              <Button
                icon={item.icon}
                action={() => handleSelect(item.icon)}
                tooltip={item.text}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}