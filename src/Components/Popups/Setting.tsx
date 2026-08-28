import {
  SettingData,
  settingsOptions,
  SettingState,
  accents,
} from "@/src/types/BasicTypes";
import Toggle from "../MTComps/Toggle";
const accentColors: Record<SettingData["accent"], string> = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  orange: "bg-orange-400",
};
export default function Setting({ settings, setSettings }: SettingState) {
  return (
    <div className="flex flex-col space-y-2 items-center ">
      <div className="popup popup-row">
        <span>Accent</span>
        <div className="flex gap-2">
          {settingsOptions.accent.map((color) => (
            <button
              key={color}
              onClick={() => {
                setSettings((s) => ({ ...s, accent: color }));
                // one of the most useful code in this project
                document.documentElement.style.setProperty(
                  "--accent",
                  accents[color].hex,
                );
              }}
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
        <span>Tool Tip</span>
        <Toggle
          checked={settings.toolTip}
          action={() => {
            setSettings((s) => ({ ...s, toolTip: !s.toolTip }));
          }}
        />
      </div>
      {
        //This is for future setting features
      }
      {/*
  <div className="popup popup-row">
    <span>Font</span>
  </div>

  <div className="popup popup-row">
    <span>Spacing</span>
  </div>
  */}
    </div>
  );
}
