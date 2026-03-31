"use client";

import { useState } from "react";

type SearchBarProps = {
  onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuery(e.target.value);
    onSearch(e.target.value);
  }

  function handleClear() {
    setQuery("");
    onSearch("");
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
      {/* Search icon */}
      <svg
        className="w-4 h-4 text-neutral-400 shrink-0"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>

      {/* Text input */}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search notes..."
        className="flex-1 bg-transparent text-sm outline-none text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
      />

      {/* Clear button — only shows when there is text */}
      {query.length > 0 && (
        <button
          onClick={handleClear}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}
