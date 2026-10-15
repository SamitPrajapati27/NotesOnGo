"use client";

import { TooltipPreference } from "./TooltipPreference";
import { Icon } from "@iconify/react";
import { useContext, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ButtonObject } from "../../types/BasicTypes";
import { reportError } from "@/src/scripts/errors";
import { positionTooltip } from "@/src/scripts/tooltips";

/**
 * Render a shared action button with optional icons, save feedback, and a positioned tooltip.
 */
export default function Button({
  icon,
  text,
  action,
  tooltip,
  type,
  position = "down",
  extra,
  fullWidth,
  pressed,
  disabled = false,
  feedback,
  htmlType = "button",
}: ButtonObject) {
  const tooltipsEnabled = useContext(TooltipPreference);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);
  const showTooltip = (button: HTMLButtonElement) => {
    setPortalRoot(button.closest("dialog") || document.body);
    setAnchor(button.getBoundingClientRect());
  };
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const endIcon =
    type === "dropdown"
      ? "material-symbols:arrow-drop-down-rounded"
      : type === "dropdown-open"
        ? "material-symbols:arrow-drop-up-rounded"
        : undefined;

  useLayoutEffect(() => {
    const tip = tooltipRef.current;
    if (!anchor || !tip) return;
    const coordinates = positionTooltip(
      anchor,
      tip.getBoundingClientRect(),
      {
        width: document.documentElement.clientWidth,
        height: window.innerHeight,
      },
      position,
    );
    tip.style.left = `${coordinates.left}px`;
    tip.style.top = `${coordinates.top}px`;
    tip.style.visibility = "visible";
    /**
     * Dismiss the tooltip when scrolling or resizing invalidates its anchor position.
     */
    const hide = () => setAnchor(null);
    window.addEventListener("scroll", hide, true);
    window.addEventListener("resize", hide);
    return () => {
      window.removeEventListener("scroll", hide, true);
      window.removeEventListener("resize", hide);
    };
  }, [anchor, position, tooltip]);

  return (
    <div
      className={`relative ${fullWidth ? "block w-full" : "inline-block"} font-sans`}>
      <button
        type={htmlType}
        disabled={disabled}
        aria-label={tooltip || text}
        aria-pressed={pressed}
        aria-expanded={
          type === "dropdown" || type === "dropdown-open"
            ? type === "dropdown-open"
            : undefined
        }
        data-feedback={feedback}
        aria-describedby={
          tooltipsEnabled && anchor && tooltip ? tooltipId : undefined
        }
        className={`btn text-lg ${extra || ""}`}
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") showTooltip(event.currentTarget);
        }}
        onPointerLeave={() => setAnchor(null)}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible"))
            showTooltip(event.currentTarget);
        }}
        onBlur={() => setAnchor(null)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setAnchor(null);
        }}
        onClick={() => {
          setAnchor(null);
          try {
            action?.();
          } catch (error) {
            reportError(error);
          }
        }}>
        <div className="btn-content flex items-center justify-center gap-1">
          {icon ? (
            <Icon
              key={feedback === "saved" ? "saved" : icon}
              className={feedback === "saved" ? "save-check" : undefined}
              icon={
                feedback === "saved" ? "material-symbols:check-rounded" : icon
              }
            />
          ) : (
            text && <span className="mx-auto">{text}</span>
          )}
          {endIcon && <Icon icon={endIcon} />}
        </div>
        {feedback === "unsaved" && (
          <span aria-hidden="true" className="unsaved-dot" />
        )}
      </button>
      {tooltipsEnabled &&
        anchor &&
        tooltip &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className="tooltip popup-enter"
            style={{ left: 0, top: 0, visibility: "hidden" }}>
            {tooltip}
          </div>,
          portalRoot || document.body,
        )}
    </div>
  );
}
