"use client";

import { useEffect, useRef, useState } from "react";
import type { NoteData } from "../types/BasicTypes";
import type { Descendant } from "slate";
import { createCollection, createNote, NOTES_STORAGE_KEY, NoteConflictError, parseCollection, persistCollection, removeNote } from "./dataBase";
import type { NoteCollection } from "./dataBase";
import { reportError } from "./errors";
import { noteIdFromPath, notePath } from "./noteRoutes";

/**
 * Manage browser-local notes, autosave, unsaved state, storage errors, and history navigation.
 * @returns The current collection, status flags, and commands for editing and saving notes.
 */
export function useNotes() {
  const [collection, setCollection] = useState<NoteCollection | null>(null);
  const [autosave, setAutosave] = useState(true);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missingNote, setMissingNote] = useState(false);
  const current = useRef<NoteCollection | null>(null);
  const stored = useRef<string | null>(null);
  const readable = useRef(false);
  const reportedStorageError = useRef<string | null>(null);

  /** Report each new storage failure once so autosave does not interrupt every keystroke. */
  function storageError(message: string) {
    setError(message);
    if (reportedStorageError.current !== message) reportError(message, "Notes could not be saved");
    reportedStorageError.current = message;
  }

  useEffect(() => {
    let initial: NoteCollection;
    readable.current = false;
    try {
      stored.current = window.localStorage.getItem(NOTES_STORAGE_KEY);
      initial = stored.current === null ? createCollection() : parseCollection(stored.current);
      readable.current = true;
    } catch {
      initial = createCollection();
      // Preserve the original storage if it cannot be read or validated.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      storageError("Stored notes could not be loaded. Existing storage is untouched; new edits are only in memory.");
    }
    const requested = noteIdFromPath(window.location.pathname);
    if (requested && initial.notes.some((note) => note.id === requested)) initial = { ...initial, activeNoteId: requested };
    setMissingNote(Boolean(requested && !initial.notes.some((note) => note.id === requested)));
    if (!requested) window.history.replaceState(null, "", notePath(initial.activeNoteId));
    current.current = initial;
    setCollection(initial);
    /**
     * Resolve Back or Forward navigation against in-memory notes without discarding drafts.
     */
    const onHistory = () => {
      if (!current.current) return;
      const id = noteIdFromPath(window.location.pathname);
      if (!id) {
        window.history.replaceState(null, "", notePath(current.current.activeNoteId));
        setMissingNote(false);
        return;
      }
      if (!current.current.notes.some((note) => note.id === id)) { setMissingNote(true); return; }
      current.current = { ...current.current, activeNoteId: id };
      setMissingNote(false);
      setCollection(current.current);
    };
    window.addEventListener("popstate", onHistory);
    return () => window.removeEventListener("popstate", onHistory);
  }, []);

  useEffect(() => {
    if (!dirty) return;
    /**
     * Ask the browser to warn before leaving while there are unsaved changes.
     */
    const warnBeforeLeaving = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warnBeforeLeaving);
    return () => window.removeEventListener("beforeunload", warnBeforeLeaving);
  }, [dirty]);

  /**
   * Attempt a conflict-checked storage write and update save or error feedback.
   * @returns Whether the collection was successfully saved.
   */
  function persist(next: NoteCollection) {
    if (!readable.current) return false;
    try {
      stored.current = persistCollection(window.localStorage, stored.current, next);
      setError(null);
      reportedStorageError.current = null;
      setDirty(false);
      setSavedAt(Date.now());
      return true;
    } catch (cause) {
      setSavedAt(null);
      storageError(cause instanceof NoteConflictError
        ? "Notes changed in another tab. Copy any unsaved edits before reloading this page. This tab's edits are only in memory."
        : "Notes could not be saved in this browser. Edits are only in memory; try Save again before closing.");
      return false;
    }
  }

  /**
   * Apply a collection change in memory, mark it dirty, and persist it when autosave is enabled.
   */
  function update(change: (previous: NoteCollection) => NoteCollection) {
    if (!current.current) return;
    const next = change(current.current);
    current.current = next;
    setCollection(next);
    setSavedAt(null);
    setDirty(true);
    if (autosave) persist(next);
  }

  /**
   * Patch a note’s editable fields and refresh its modification timestamp.
   */
  function updateNote(id: string, patch: Partial<Pick<NoteData, "title" | "data" | "font">>) {
    update((previous) => ({
      ...previous,
      notes: previous.notes.map((note) => note.id === id
        ? { ...note, ...patch, updatedAt: new Date().toISOString() } : note),
    }));
  }

  /**
   * Update the note URL with pushState or replaceState without reloading the workspace.
   */
  function navigate(id: string, replace = false) {
    setMissingNote(false);
    const path = notePath(id);
    if (window.location.pathname !== path) {
      if (replace) window.history.replaceState(null, "", path);
      else window.history.pushState(null, "", path);
    }
  }

  return {
    collection,
    error,
    autosave,
    dirty,
    savedAt,
    missingNote,
    /**
     * Update and optionally autosave the selected note’s editor font.
     */
    setFont(id: string, font: NonNullable<NoteData["font"]>) { updateNote(id, { font }); },
    /**
     * Toggle autosave and immediately persist pending changes when enabling it.
     */
    toggleAutosave() {
      const enabled = !autosave;
      setAutosave(enabled);
      if (enabled && dirty && current.current) persist(current.current);
    },
    /**
     * Append a blank note, select it, and navigate to its URL.
     */
    create() {
      const note = createNote();
      update((previous) => ({ ...previous, notes: [...previous.notes, note], activeNoteId: note.id }));
      navigate(note.id);
    },
    /**
     * Select an existing note and update its URL while keeping in-memory drafts.
     */
    select(id: string) {
      if (!current.current?.notes.some((note) => note.id === id)) return;
      update((previous) => previous.notes.some((note) => note.id === id)
        ? { ...previous, activeNoteId: id } : previous);
      navigate(id);
    },
    /**
     * Update the title of the note with the supplied ID.
     */
    rename(id: string, title: string) { updateNote(id, { title }); },
    /**
     * Replace a note’s Slate document with the latest editor value.
     */
    edit(id: string, data: Descendant[]) { updateNote(id, { data }); },
    /**
     * Delete a note and replace the URL with the resulting active note.
     */
    remove(id: string) {
      update((previous) => removeNote(previous, id));
      if (current.current) navigate(current.current.activeNoteId, true);
    },
    /**
     * Append validated imported notes and navigate to the first imported note.
     */
    importNotes(imported: NoteData[]) {
      if (!imported.length) return;
      update((previous) => ({ ...previous, notes: [...previous.notes, ...imported], activeNoteId: imported[0].id }));
      navigate(imported[0].id);
    },
    /**
     * Manually persist the current collection, returning false if it is not loaded or saving fails.
     */
    save() { return current.current ? persist(current.current) : false; },
  };
}
