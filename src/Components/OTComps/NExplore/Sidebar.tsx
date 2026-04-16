"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@iconify/react";
import SearchBar from "./SearchBar";

type Note = {
  id: string;
  title: string;
};

type SidebarProps = {
  isOpen: boolean;
  notes: Note[];
  activeNoteId: string;
  onNoteSelect: (id: string) => void;
  onNewNote: () => void;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onSearch: (query: string) => void;
  onThemeToggle: () => void;
  onSettings: () => void;
};

export default function Sidebar({
  isOpen,
  notes,
  activeNoteId,
  onNoteSelect,
  onNewNote,
  onRename,
  onDelete,
  onSearch,
  onThemeToggle,
  onSettings,
}: SidebarProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close the "..." menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`
        flex flex-col h-full w-64 p-4 gap-4
        bg-neutral-50 dark:bg-neutral-900
        border-r border-neutral-200 dark:border-neutral-700
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo + App name */}
      <div className="flex items-center gap-3">
        <div className="p-1.5 rounded-lg bg-violet-200 dark:bg-violet-800">
          <Icon
            icon="material-symbols:view-sidebar-rounded"
            className="text-violet-700 dark:text-violet-200 text-xl"
          />
        </div>
        <span className="text-base font-semibold text-neutral-800 dark:text-neutral-100">
          Notes to Go
        </span>
      </div>

      {/* Search */}
      <SearchBar onSearch={onSearch} />

      {/* Notes list */}
      <div className="flex flex-col gap-1 flex-1 overflow-y-auto">
        <span className="text-xs text-neutral-400 font-medium mb-1">
          Your Notes
        </span>

        {notes.map((note) => {
          const isActive = note.id === activeNoteId;
          const menuOpen = openMenuId === note.id;

          return (
            <div
              key={note.id}
              className={`
                relative flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer
                text-sm text-neutral-700 dark:text-neutral-200
                ${isActive
                  ? "bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }
              `}
              onClick={() => onNoteSelect(note.id)}
            >
              <span className="truncate">{note.title}</span>

              {/* "..." menu trigger */}
              <div ref={menuOpen ? menuRef : null} className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(menuOpen ? null : note.id);
                  }}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 px-1"
                >
                  <Icon icon="material-symbols:more-horiz-rounded" />
                </button>

                {/* Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 top-6 z-10 w-32 rounded-lg bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-lg overflow-hidden">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        onRename(note.id);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      <Icon icon="material-symbols:edit-rounded" />
                      Rename
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(null);
                        onDelete(note.id);
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      <Icon icon="material-symbols:delete-rounded" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Note button */}
      <button
        onClick={onNewNote}
        className="w-full py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        New Note
      </button>

      {/* Footer: Theme + Setting */}
      <div className="flex items-center justify-between">
        <button
          onClick={onThemeToggle}
          className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
        >
          <Icon icon="material-symbols:dark-mode-rounded" />
          Theme
        </button>
        <button
          onClick={onSettings}
          className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
        >
          <Icon icon="material-symbols:settings-rounded" />
          Setting
        </button>
      </div>
    </div>
  );
}
