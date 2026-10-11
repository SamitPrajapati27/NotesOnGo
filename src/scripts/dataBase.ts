import type { NoteData } from "../types/BasicTypes";
import { normalizeLinkUrl } from "./urls.ts";

export const NOTES_STORAGE_KEY = "notes-on-go:notes:v1";

export type NoteCollection = {
  version: 1;
  notes: NoteData[];
  activeNoteId: string;
};

/**
 * Create a blank paragraph note with a fresh ID and matching creation and update timestamps.
 */
export function createNote(): NoteData {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID().replace(/-/g, "").slice(0, 12),
    title: "Untitled Note",
    data: [{ type: "paragraph", children: [{ text: "" }] }],
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Create a versioned collection containing one blank, selected note.
 */
export function createCollection(): NoteCollection {
  const note = createNote();
  return { version: 1, notes: [note], activeNoteId: note.id };
}

/**
 * Check whether an unknown value is a non-null object rather than an array.
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

const blockTypes = new Set([
  "paragraph", "heading-one", "heading-two", "heading-three",
  "numbered-list", "bulleted-list", "letter-list", "task-list",
  "task-item", "list-item", "link",
]);

/**
 * Recursively validate supported Slate nodes, marks, and links with a depth limit of 100.
 */
function isNode(value: unknown, depth = 0): boolean {
  if (!isObject(value) || depth > 100) return false;
  if (typeof value.text === "string" && !("children" in value)) {
    return ["bold", "italic", "underline"].every(
      (key) => value[key] === undefined || typeof value[key] === "boolean",
    );
  }
  return typeof value.type === "string" && blockTypes.has(value.type)
    && (value.type !== "link" || (typeof value.url === "string" && normalizeLinkUrl(value.url) !== null
      && Array.isArray(value.children) && value.children.every((child) => isObject(child) && typeof child.text === "string")))
    && Array.isArray(value.children) && value.children.length > 0
    && value.children.every((child: unknown) => isNode(child, depth + 1))
    && (value.checked === undefined || typeof value.checked === "boolean");
}

/**
 * Validate persisted note fields and require a nonempty document of supported block nodes.
 */
export function isNote(value: unknown): value is NoteData {
  return isObject(value) && typeof value.id === "string" && value.id.length > 0
    && typeof value.title === "string"
    && (value.font === undefined || ["Default", "Elegant", "Fun"].includes(value.font as string))
    && typeof value.createdAt === "string" && typeof value.updatedAt === "string"
    && Array.isArray(value.data) && value.data.length > 0
    && value.data.every((node: unknown) => isObject(node) && node.type !== "link" && "children" in node && isNode(node));
}

/**
 * Parse and validate stored JSON, rejecting duplicate IDs and repairing an absent active note.
 * @throws Error If JSON or the collection structure is invalid.
 */
export function parseCollection(raw: string): NoteCollection {
  const value: unknown = JSON.parse(raw);
  if (!isObject(value) || value.version !== 1 || !Array.isArray(value.notes)
    || !value.notes.every(isNote) || typeof value.activeNoteId !== "string"
    || new Set(value.notes.map((note) => note.id)).size !== value.notes.length) {
    throw new Error("Invalid note collection");
  }
  if (value.notes.length === 0) return createCollection();
  return {
    version: 1,
    notes: value.notes,
    activeNoteId: value.notes.some((note) => note.id === value.activeNoteId)
      ? value.activeNoteId : value.notes[0].id,
  };
}

/**
 * Remove a matching note and choose a remaining active note, creating a blank note if needed.
 */
export function removeNote(collection: NoteCollection, id: string): NoteCollection {
  if (!collection.notes.some((note) => note.id === id)) return collection;
  const notes = collection.notes.filter((note) => note.id !== id);
  if (notes.length === 0) return createCollection();
  return {
    ...collection,
    notes,
    activeNoteId: collection.activeNoteId === id ? notes[0].id : collection.activeNoteId,
  };
}

export class NoteConflictError extends Error {}

/** Write only if storage still matches the snapshot this tab loaded or saved. */
export function persistCollection(
  storage: Pick<Storage, "getItem" | "setItem">,
  expected: string | null,
  collection: NoteCollection,
): string {
  if (storage.getItem(NOTES_STORAGE_KEY) !== expected) {
    throw new NoteConflictError("Notes changed in another tab");
  }
  const serialized = JSON.stringify(collection);
  storage.setItem(NOTES_STORAGE_KEY, serialized);
  return serialized;
}
