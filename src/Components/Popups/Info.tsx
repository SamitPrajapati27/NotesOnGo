"use client";

import { Icon } from "@iconify/react";


export default function Info() {

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      {/* Modal */}
      <div
        className="relative w-96 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 shadow-xl p-6"
      >
        {/* ── Content goes here ── */}
        <div className="text-sm text-neutral-600 dark:text-neutral-400">
          {/* TODO: add content */}
        </div> 
      </div>
    </div>
  );
}
