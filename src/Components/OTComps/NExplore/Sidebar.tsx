"use client";
import Button from "../../MTComps/Button";
import NoteFile from "./noteFile";
import type { NoteData } from "@/src/types/BasicTypes";
import Spinner from "../../MTComps/Spinner";
import SearchBar from "./SearchBar";
import { useState, useEffect, useDeferredValue, useMemo } from "react";
import { PopupController } from "@/src/scripts/setup";
type SideBarProps = {
  setSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  settingsPopup: PopupController;
  notes: NoteData[];
  activeNoteId: string;
  onCreate: () => void;
  onSelect: (id: string) => void;
  onRename: (id: string, title: string) => void;
  onDelete: (id: string) => void;
};
/**
 * Filter notes by title and expose note actions, theme switching, and settings.
 */
export default function SideBar({
  setSideBar,
  settingsPopup,
  notes,
  activeNoteId,
  onCreate,
  onSelect,
  onRename,
  onDelete,
}: SideBarProps) {
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const searching = query !== deferredQuery;
  const visibleNotes = useMemo(
    () =>
      notes.filter((note) =>
        (note.title || "Untitled Note")
          .toLowerCase()
          .includes(deferredQuery.toLowerCase().trim()),
      ),
    [notes, deferredQuery],
  );
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <>
      <section
        aria-label="Notes library"
        className="w-[calc(100vw-3rem)] max-w-80 sm:w-80 lg:w-72 h-dvh gap-3 flex flex-col bg-primary-bg border border-primary-border rounded-r-2xl *:p-2">
        <div className="flex items-center justify-between mt-1">
          <Button
            icon="material-symbols:view-sidebar"
            action={() => {
              setSideBar(false);
            }}
            type="normal"
            tooltip="sidebar"
            position="down"
            extra="!text-2xl"
          />
          <h1 className="text-xl md:text-2xl text-center w-full">
            Notes on Go
          </h1>
        </div>

        <div className="search-area">
          <SearchBar query={query} onSearch={setQuery} />
        </div>

        <div className="flex-1 min-h-0 flex flex-col gap-2">
          <h2 className="items-start">Your Notes:</h2>
          <div
            aria-busy={searching}
            className="flex-1 min-h-0 flex flex-col w-full gap-2 overflow-y-auto">
            {searching && <Spinner compact label="Searching notes…" />}
            {visibleNotes.map((note) => (
              <NoteFile
                key={note.id}
                data={note}
                active={note.id === activeNoteId}
                onSelect={() => {
                  onSelect(note.id);
                  setSideBar(false);
                }}
                onRename={(title) => onRename(note.id, title)}
                onDelete={() => onDelete(note.id)}
              />
            ))}
            {!searching && visibleNotes.length === 0 && (
              <div className="size-fit text-center space-y-1">
                <img src="/corvus-confused.png" alt="Corvus confused"/>
                <p className="text-sm italic">Note not found</p>
              </div>
            )}
          </div>
          <div className="pt-2 w-full shrink-0">
            <Button
              text="New Note"
              fullWidth
              action={() => {
                setQuery("");
                onCreate();
                setSideBar(false);
              }}
              type="normal"
              tooltip="New Note"
              position="down"
              extra="!text-base w-full h-10 btn-full"
            />
          </div>
        </div>

        <div className=" flex w-full shrink-0 justify-around">
          <Button
            icon={
              dark
                ? "material-symbols:light-mode"
                : "material-symbols:dark-mode"
            }
            action={() => {
              setDark((d) => !d);
            }}
            type="normal"
            tooltip="theme"
            position="left"
            extra="!text-2xl btn-full"
          />
          <Button
            icon="material-symbols:settings-outline"
            action={() => {
              settingsPopup.open();
            }}
            type="normal"
            tooltip="settings"
            position="right"
            extra="!text-2xl btn-full"
          />
        </div>
      </section>
    </>
  );
}
