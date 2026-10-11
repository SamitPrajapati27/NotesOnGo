"use client";
import { useEffect, useRef } from "react";
import { PopupProps } from "@/src/types/BasicTypes";
import Button from "@/src/Components/MTComps/Button";

/** Open a native modal above the sidebar and menus, with focus trapping and restoration. */
export default function Popup({ isOpen, onClose, title, children, wide = false }: PopupProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current;
    if (!isOpen || !element) return;
    element.showModal();
    return () => { element.close(); };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <dialog ref={dialog} aria-label={title}
      className="fixed inset-0 m-0 h-dvh w-screen max-h-none max-w-none border-0 bg-transparent p-0 text-foreground open:flex items-center justify-center backdrop:bg-black/40"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className={`popup-enter relative flex flex-col ${wide ? "w-[40rem]" : "w-96"} max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] overflow-hidden rounded-2xl bg-primary-bg border border-primary-border p-5 sm:p-6 shadow-xl`}>
        <div className="flex items-center justify-between gap-4 mb-5 shrink-0">
          <h2 className="text-lg font-semibold">{title}</h2>
          <Button icon="material-symbols:close-rounded" action={onClose} tooltip="close" position="right" extra="!text-xl" />
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain pr-1" tabIndex={0} role="region" aria-label={`${title} content`}>
          {children}
        </div>
      </div>
    </dialog>
  );
}
