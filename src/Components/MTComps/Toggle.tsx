import type { CSSProperties } from "react";
import type { ToggleObject } from "@/src/types/BasicTypes";

const sizes = { sm: { width: 36, height: 20 }, md: { width: 44, height: 24 }, lg: { width: 60, height: 32 } };

/**
 * Render a controlled checkbox switch using the requested track size.
 */
export default function Toggle({ checked, action, label, size = "md" }: ToggleObject) {
  const dimensions = sizes[size];
  const style = {
    "--toggle-width": `${dimensions.width}px`,
    "--toggle-height": `${dimensions.height}px`,
  } as CSSProperties;

  return (
    <label className="inline-flex shrink-0 items-center cursor-pointer p-1" style={style}>
      <input aria-label={label} type="checkbox" className="sr-only peer" checked={checked} onChange={action} />
      <span className="toggle-track relative block rounded-full bg-primary-border peer-checked:bg-accent transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-accent peer-focus-visible:outline-offset-2">
        <span aria-hidden="true" className="toggle-thumb absolute rounded-full bg-white shadow-sm transition-transform" />
      </span>
    </label>
  );
}
