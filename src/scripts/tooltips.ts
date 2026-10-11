export type TooltipSide = "up" | "down" | "left" | "right";
type Rect = { left: number; right: number; top: number; bottom: number; width: number; height: number };

/**
 * Place a tooltip beside its anchor, flipping when needed and clamping it to the viewport.
 */
export function positionTooltip(
  anchor: Rect,
  tip: { width: number; height: number },
  viewport: { width: number; height: number },
  preferred: TooltipSide,
) {
  const gap = 8;
  const padding = 8;
  let side = preferred;
  if (side === "up" && anchor.top < tip.height + gap + padding) side = "down";
  else if (side === "down" && viewport.height - anchor.bottom < tip.height + gap + padding) side = "up";
  else if (side === "left" && anchor.left < tip.width + gap + padding) side = "right";
  else if (side === "right" && viewport.width - anchor.right < tip.width + gap + padding) side = "left";
  const x = side === "left" ? anchor.left - tip.width - gap
    : side === "right" ? anchor.right + gap : anchor.left + (anchor.width - tip.width) / 2;
  const y = side === "up" ? anchor.top - tip.height - gap
    : side === "down" ? anchor.bottom + gap : anchor.top + (anchor.height - tip.height) / 2;
  return {
    left: Math.max(padding, Math.min(x, viewport.width - tip.width - padding)),
    top: Math.max(padding, Math.min(y, viewport.height - tip.height - padding)),
  };
}
