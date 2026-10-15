import Button from "../MTComps/Button";
import Spinner from "../MTComps/Spinner";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import type { NoteData } from "@/src/types/BasicTypes";
import { readNoteFiles } from "@/src/scripts/importing";
import { noteFileConfig, noteFileAccept } from "@/src/scripts/setup";

/** Preview validated files before adding them as new notes. */
export default function Import({
  onImport,
}: {
  onImport: (notes: NoteData[]) => void;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const queuedBytes = useRef(0);
  const [imported, setImported] = useState<NoteData[]>([]);
  const [reading, setReading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);
  const readingFiles = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  /**
   * Validate file and batch sizes, then prepare imported notes only if every file succeeds.
   */
  async function readFiles(files: File[]) {
    if (readingFiles.current || !files?.length) return;
    readingFiles.current = true;
    setError("");
    setMessage("");
    setReading(true);
    try {
      const result = await readNoteFiles(files, noteFileConfig, queuedBytes.current);
      queuedBytes.current += result.bytes;
      setImported(previous => [...previous, ...result.notes]);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Files could not be read.");
    } finally {
      readingFiles.current = false;
      setReading(false);
    }
  }
  return (
    <div className="space-y-5">
      <div className="space-y-5">
        <div
          aria-busy={reading}
          className={`flex flex-col items-center justify-center rounded-lg border border-dashed px-4 py-7 text-center transition-colors ${dragging ? "border-accent bg-accent/10" : "border-primary-border bg-secondary-bg"}`}
          onDragEnter={(event) => {
            event.preventDefault();
            if (readingFiles.current || !event.dataTransfer.types.includes("Files")) return;
            dragDepth.current += 1;
            setDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = readingFiles.current ? "none" : "copy";
          }}
          onDragLeave={(event) => {
            event.preventDefault();
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (!dragDepth.current) setDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            dragDepth.current = 0;
            setDragging(false);
            void readFiles(Array.from(event.dataTransfer.files));
          }}>
          <input
            ref={fileInput}
            id="import-files"
            aria-label="Choose notes to import"
            aria-describedby="import-help import-limits"
            type="file"
            disabled={reading}
            accept={noteFileAccept}
            multiple
            className="hidden"
            onChange={(event) => {
              void readFiles(Array.from(event.target.files || []));
              event.target.value = "";
            }}
          />
          <div className="flex w-full items-center justify-center gap-2">
            <Icon
              icon="material-symbols:drive-folder-upload-outline-rounded"
              className="shrink-0 text-3xl text-muted-foreground"
              aria-hidden="true"
            />
            <span className="text-sm font-medium">
              {dragging ? "Drop files here" : imported.length ? "Drop or choose more files" : "Drop files or choose files"}
            </span>
          </div>
          <span id="import-help" className="mt-2 text-xs text-muted-foreground">
            Markdown, Text, or JSON 
          </span>
          <div className="mt-4 flex w-full justify-center">
            <Button
              text="Browse files"
              disabled={reading}
              extra="btn-full !text-sm !px-3 !py-2"
              action={() => fileInput.current?.click()}
            />
          </div>
        </div>
        <p id="import-limits" className="!mt-2 text-xs text-muted-foreground">
          {noteFileConfig.maxFileBytes / 1_000_000} MB per file ·{" "}
          {noteFileConfig.maxBatchBytes / 1_000_000} MB total
        </p>
        {error && <p role="alert" className="rounded-lg border border-primary-border bg-secondary-bg px-3 py-2 text-sm">{error}</p>}
        {reading && <Spinner compact label="Reading files…" />}
        {imported.length > 0 && (
          <div className="space-y-2" aria-live="polite">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <h3 className="font-medium text-foreground">Ready to import</h3>
              <span>
                {imported.length} {imported.length === 1 ? "note" : "notes"}
              </span>
            </div>
            <ul className="max-h-36 divide-y divide-primary-border overflow-auto rounded-lg border border-primary-border bg-secondary-bg">
              {imported.map((item) => (
                <li
                  className="flex items-center gap-2 px-3 py-2.5 text-sm"
                  key={item.id}>
                  <Icon
                    icon="material-symbols:description-outline-rounded"
                    className="shrink-0 text-lg text-muted-foreground"
                    aria-hidden="true"
                  />
                  <span className="min-w-0 break-words">
                    {item.title || noteFileConfig.defaultTitle}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          text={
            imported.length
              ? `Import ${imported.length} ${imported.length === 1 ? "note" : "notes"}`
              : "Import notes"
          }
          disabled={reading || !imported.length}
          fullWidth
          extra="btn-full w-full !text-sm !py-3"
          action={() => {
            if (readingFiles.current || !imported.length) return;
            try {
              onImport(imported);
              setMessage(`Imported ${imported.length} ${imported.length === 1 ? "note" : "notes"}.`);
              setImported([]);
              queuedBytes.current = 0;
              setError("");
            } catch (error) {
              setError(error instanceof Error ? error.message : "Notes could not be imported. Please try again.");
            }
          }}
        />
      </div>
      {message && (
        <p role="status" className="text-sm text-muted-foreground">
          {message}
        </p>
      )}
    </div>
  );
}
