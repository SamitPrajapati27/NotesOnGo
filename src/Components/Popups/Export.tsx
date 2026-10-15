import Button from "../MTComps/Button";
import DropButton from "../MTComps/DropButton";
import TextBox from "../MTComps/TextBox";
import { useState } from "react";
import type { NoteData, fileData } from "@/src/types/BasicTypes";
import { reportError } from "@/src/scripts/errors";
import { downloadNote } from "@/src/scripts/exporting";
import { noteFileFormats, noteFileConfig } from "@/src/scripts/setup";

/** Download the active note in the selected format. */
export default function Export({ note }: { note: NoteData }) {
  const [filename, setFilename] = useState(note.title || noteFileConfig.defaultTitle);
  const [fileType, setFileType] = useState<fileData["fileType"]>(noteFileConfig.defaultFormat);
  const [message, setMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState("");
  return <div className="space-y-5">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="export-name" className="text-sm font-medium">
              File name
            </label>
            <div className="flex items-center overflow-hidden rounded-lg border border-primary-border bg-secondary-bg focus-within:border-accent focus-within:ring-1 focus-within:ring-accent">
              <TextBox
                id="export-name"
                className="h-11 w-full !border-0 !px-3 focus:outline-none! "
                value={filename}
                onChange={(event) => {
                  setFilename(event.target.value);
                  setMessage("");
                }}
              />
              <span className="shrink-0 border-l border-primary-border px-3 font-mono text-xs text-muted-foreground">
                .{fileType}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="popup popup-row !overflow-visible">
              <span className="text-sm font-medium">Format</span>
              <DropButton
                text={noteFileFormats.find((format) => format.type === fileType)?.title}
                id="export-format"
                tooltip="Download format"
                isOpen={openDropdown === "export-format"}
                onToggle={setOpenDropdown}
                data={noteFileFormats.map((format) => ({
                  text: format.title,
                  tooltip: format.detail,
                  action: () => {
                    setFileType(format.type);
                    setMessage("");
                  },
                }))}
              />
            </div>

          </div>
          <Button
            text="Download note"
            fullWidth
            extra="btn-full w-full !text-sm !py-3"
            action={() => {
              try {
                downloadNote(note, filename, fileType);
                setMessage("Download started.");
              } catch (error) {
                setMessage("Download could not start. Please try again.");
                reportError(error, "Export failed");
              }
            }}
          />
        </div>
      {message && (
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
  </div>;
}
