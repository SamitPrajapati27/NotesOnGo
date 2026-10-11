import Button from "../../MTComps/Button";
import TextBox from "../../MTComps/TextBox";
import { useState } from "react";
import type { NoteData } from "@/src/types/BasicTypes";

type NoteFileProps = {
  data: NoteData;
  active: boolean;
  onSelect: () => void;
  onRename: (title: string) => void;
  onDelete: () => void;
};

/**
 * Render a note row with selection, inline renaming, and deletion controls.
 */
export default function NoteFile({
  data,
  active,
  onSelect,
  onRename,
  onDelete,
}: NoteFileProps) {
  const [draftTitle, setDraftTitle] = useState(data.title);
  const [editMode, setEditMode] = useState(false);
  const [moreMode, setMoreMode] = useState(false);
  const title = data.title || "Untitled Note";

  /**
   * Enter rename mode with the current title or commit the draft when leaving it.
   */
  function toggleEdit() {
    if (editMode) onRename(draftTitle);
    else setDraftTitle(data.title);
    setEditMode((previous) => !previous);
  }

  return (
    <div
      data-note-file={data.id}
      className={`w-full min-w-0 bg-secondary-bg border rounded-lg p-2 min-h-12 relative flex items-center justify-between gap-2 ${active ? "border-accent" : "border-primary-border"}`}>
      {editMode ? (
        <TextBox
          autoFocus
          aria-label="Rename note"
          className="min-w-0 flex-1 outline-none text-center"
          value={draftTitle}
          placeholder="Untitled Note"
          onChange={(event) => setDraftTitle(event.target.value)}
          onBlur={() => onRename(draftTitle)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              onRename(draftTitle);
              setEditMode(false);
            }
            if (event.key === "Escape") setEditMode(false);
          }}
        />
      ) : (
        <button
          type="button"
          onClick={onSelect}
          aria-current={active ? "page" : undefined}
          className={`min-w-0 flex-1 truncate text-center ${moreMode ? "" : "px-7"}`}
          title={title}>
          {title}
        </button>
      )}
      <div
        className={`${moreMode ? "relative" : "absolute right-2 top-1/2 -translate-y-1/2"} flex items-center overflow-y-visible shrink-0`}>
        <div
          inert={!moreMode}
          aria-hidden={!moreMode}
          className={`flex transition-all duration-300 ease-in-out space-x-1 ${moreMode ? "translate-x-0 opacity-100" : "hidden"}`}
          style={{ width: "fit-content" }}>
          <Button
            icon="mdi:trash"
            action={onDelete}
            type="normal"
            tooltip="trash"
            position="down"
            extra="!text-xl btn-full"
          />
          <Button
            icon={editMode ? "mdi:edit" : "mdi:edit-off"}
            action={toggleEdit}
            type="normal"
            tooltip={editMode ? "edit-off" : "edit"}
            position="down"
            extra="!text-xl btn-full"
          />
          <Button
            icon="mdi:close"
            action={() => {
              if (editMode) onRename(draftTitle);
              setEditMode(false);
              setMoreMode(false);
            }}
            type="normal"
            tooltip="close"
            position="down"
            extra="!text-xl btn-full"
          />
        </div>
        <div
          inert={moreMode}
          aria-hidden={moreMode}
          className={`absolute right-0 transition-all duration-300 ease-in-out ${moreMode ? "translate-x-full opacity-0 pointer-events-none" : "translate-x-0 opacity-100"}`}>
          <Button
            icon="tabler:dots"
            action={() => setMoreMode(true)}
            type="normal"
            tooltip="Note actions"
            position="right"
            extra="md:!text-md btn-full"
          />
        </div>
      </div>
    </div>
  );
}
