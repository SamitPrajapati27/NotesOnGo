"use client";

import { Icon } from "@iconify/react";

type InfoProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Info({ isOpen, onClose }: InfoProps) {
  if (!isOpen) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      {/* Modal */}
      <div
        className="relative w-96 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
            Info
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
          >
            <Icon icon="material-symbols:close-rounded" />
          </button>
        </div>

        {/* ── Content goes here ── */}
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {/* TODO: add content */}
        </div> 
      </div>
    </div>
  );
}
