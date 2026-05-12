"use client";

import { Icon } from "@iconify/react";
import {PopupProps} from "@/src/types/MainTypes";
import Button from "@/src/Components/MTComps/Button";
export default function Popup({ isOpen, onClose, title, children }: PopupProps) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-96 rounded-lg bg-primary-bg border-primary-border p-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-base font-semibold mx-auto">
            {title}
          </h2>
          <Button 
            icon="material-symbols:close-rounded"
            action={() => {onClose()}}
            type="normal"
            tooltip="close"
          />
        </div>
        <div className="">
          {children}
        </div>
      </div>
    </div>
  );
}
