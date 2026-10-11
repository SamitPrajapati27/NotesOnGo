import type { ComponentPropsWithRef } from "react";

/** Shared native text field; preserves labels, refs, and normal input behavior. */
export default function TextBox({
  className = "",
  ...props
}: ComponentPropsWithRef<"input">) {
  return (
    <input
      {...props}
      className={`text-box min-w-0 rounded-lg border border-accent bg-transparent px-2 py-1 text-foreground placeholder:text-muted-foreground ${className}`}
    />
  );
}
