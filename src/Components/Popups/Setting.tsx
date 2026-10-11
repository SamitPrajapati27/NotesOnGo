import {
  settingsOptions,
  SettingState,
  accents,
} from "@/src/types/BasicTypes";
import Toggle from "../MTComps/Toggle";
/**
 * Render accent and tooltip preferences; accent changes update the root CSS variable.
 */
export default function Setting({ settings, setSettings }: SettingState) {
  return (
    <div className="flex flex-col space-y-2 items-center ">
      <div className="popup popup-row">
        <span>Accent</span>
        <div className="flex gap-2">
          {settingsOptions.accent.map((color) => (
            <button
              key={color}
              aria-label={`${color} accent`}
              style={{ backgroundColor: accents[color].hex }}
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
                ${settings.accent === color ? "ring-2 ring-offset-2 ring-offset-secondary-bg ring-foreground" : "opacity-70"}
              `}
            />
          ))}
        </div>
      </div>
      <div className="popup popup-row">
        <span>Tool Tip</span>
        <Toggle
          label="Tooltips"
          checked={settings.toolTip}
          action={() => {
            setSettings((s) => ({ ...s, toolTip: !s.toolTip }));
          }}
        />
      </div>
      <div className="popup popup-row">
        <div className="space-y-1">
          <span>Markdown shortcuts</span>
        </div>
        <Toggle label="Markdown shortcuts" checked={settings.markdownShortcuts}
          action={() => setSettings(s => ({ ...s, markdownShortcuts: !s.markdownShortcuts }))} />
      </div>
    </div>
  );
}
