"use client";
import TextBox from "../../MTComps/TextBox";

import { Icon } from '@iconify/react';
type SearchBarProps = {
  query: string;
  onSearch: (query: string) => void;
};

/**
 * Render the controlled note-title search input and its clear action.
 */
export default function SearchBar({ query, onSearch }: SearchBarProps) {

  /**
   * Forward the current search input value to the sidebar.
   */
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onSearch(e.target.value);
  }

  /**
   * Clear the search query so all notes can be shown again.
   */
  function handleClear() {
    onSearch("");
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary-bg text-foreground border border-primary-border focus-within:border-accent">
      {/* Search icon */}
      <Icon icon="material-symbols:search-rounded"/>

      {/* Text input */}
      <TextBox
        type="text"
        value={query}
        onChange={handleChange}
        aria-label="Search notes"
        placeholder="Search notes..."
        className="min-w-0 flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
      />

      {/* Clear button — only shows when there is text */}
      {query.length > 0 && (
        <button
          aria-label="Clear search"
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground text-xs"
        >
          ✕
        </button>
      )}
    </div>
  );
}
