import Button from "../../MTComps/Button";
import { NoteData } from "@/src/types/BasicTypes";
import { useState } from "react";

type NoteFileProps = {
  data: NoteData;
  eMode?: boolean;
};

export default function NoteFile({ data }: NoteFileProps) {
  const [editMode, setEditMode] = useState(false);
  const [moreMode, setMoreMode] = useState(false);
  const [noteFileTitle, setNoteFileTitle] = useState(data.title);

  return (
    <div className="w-full md:w-64 bg-secondary-bg border-primary-border rounded-lg p-2 flex justify-between">
      {editMode ? (
        <div>
          <input
            type="text"
            value={noteFileTitle}
            onChange={(e) => setNoteFileTitle(e.target.value)}
          />
        </div>
      ) : (
        <div className="w-full">
          <span>{noteFileTitle}</span>
        </div>
      )}

      <div className="relative flex items-center overflow-y-visible">
        <div
          className={`flex transition-all duration-300 ease-in-out space-x-1 ${
            moreMode
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0 pointer-events-none"
          }`}
          style={{ width: "fit-content" }}
        >
          <Button
            icon="mdi:trash"
            action={() => console.log("Delete NoteFile")}
            type="normal"
            tooltip="trash"
            position="down"
            extra="!text-xl btn-full"
          />
          <Button
            icon={editMode ? "mdi:edit" : "mdi:edit-off"}
            action={() => setEditMode((prev) => !prev)}
            type="normal"
            tooltip={editMode ? "edit-off" : "edit"}
            position="down"
            extra="!text-xl btn-full"
          />
          <Button
            icon="mdi:close"
            action={() => setMoreMode(false)}
            type="normal"
            tooltip="close"
            position="down"
            extra="!text-xl btn-full"
          />
        </div>
        <div
          className={`absolute right-0 transition-all duration-300 ease-in-out ${
            moreMode
              ? "translate-x-full opacity-0 pointer-events-none"
              : "translate-x-0 opacity-100"
          }`}
        >
          <Button
            icon="tabler:dots"
            action={() => setMoreMode(true)}
            type="normal"
            tooltip="more"
            position="right"
            extra="md:!text-md btn-full"
          />
        </div>
      </div>
    </div>
  );
}