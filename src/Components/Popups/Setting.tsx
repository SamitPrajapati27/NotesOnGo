import { SettingData, settingsOptions } from "@/src/types/BasicTypes";
import { useState } from "react";
const accentColors: Record<SettingData["accent"], string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  orange: "bg-orange-400",
};
export default function Setting() {
  const [settings, setSettings] = useState<SettingData>({
    accent: "blue",
    font: "Default",
    spacing: 10,
  });
  return (
    <div className="flex flex-col space-y-2 items-center ">
      <div className="popup popup-row">
        <span>Accent</span>
        <div className="flex gap-2">
          {settingsOptions.accent.map((color) => (
            <button
              key={color}
              onClick={() => setSettings((s) => ({ ...s, accent: color }))}
              className={`
                w-6 h-6 rounded-full transition-all
                ${accentColors[color]}
                ${settings.accent === color ? "ring-2 ring-offset-2 ring-zinc-400" : "opacity-70"}
              `}
            />
          ))}
        </div>
      </div>

      <div className="popup popup-row">
        <span>Font</span>
      </div>

      <div className="popup popup-row">
        <span>Spacing</span>
      </div>
    </div>
  );
}
