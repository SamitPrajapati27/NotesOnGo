"use client";
import { PopupProps } from "@/src/types/BasicTypes";
import Button from "@/src/Components/MTComps/Button";
export default function Popup({
  isOpen,
  onClose,
  title,
  children,
}: PopupProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}>
      <div
        className="relative w-96 rounded-lg bg-primary-bg border-primary-border p-3"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <Button
            icon="material-symbols:close-rounded"
            action={() => {
              onClose();
            }}
            type="normal"
            tooltip="close"
            position="right"
            extra="!text-xl"
          />
          <h2 className="text-base font-semibold mx-auto">{title}</h2>
        </div>
        <div className="">{children}</div>
      </div>
    </div>
  );
}
