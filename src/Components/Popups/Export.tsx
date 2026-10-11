import Spinner from "../MTComps/Spinner";
import TextBox from "../MTComps/TextBox";
import Button from "../MTComps/Button";
import { useState } from "react";
import type { NoteData, fileData } from "@/src/types/BasicTypes";
import { reportError } from "@/src/scripts/errors";
import { downloadNote } from "@/src/scripts/exporting";
import { importNoteFile } from "@/src/scripts/importing";

type FileType = fileData["fileType"];

/**
 * Offer active-note downloads and a preview of validated files to import as new notes.
 */
export default function Export({ note, onImport }: { note: NoteData; onImport: (notes: NoteData[]) => void }) {
  const [filename, setFilename] = useState(note.title || "Untitled Note");
  const [fileType, setFileType] = useState<FileType>("md");
  const [message, setMessage] = useState("");
  const [mode, setMode] = useState<"export" | "import">("export");
  const [imported, setImported] = useState<NoteData[]>([]);
  const [reading, setReading] = useState(false);
  /**
   * Validate file and batch sizes, then prepare imported notes only if every file succeeds.
   */
  async function readFiles(files: FileList | null) {
    setImported([]); setMessage("");
    if (!files?.length) return;
    setReading(true);
    try {
      const selected = Array.from(files);
      if (selected.reduce((total, file) => total + file.size, 0) > 5_000_000) throw new Error("Select up to 5 MB of files at a time.");
      const batches = await Promise.all(selected.map(async (file) => {
        if (file.size > 1_000_000) throw new Error(`${file.name}: maximum file size is 1 MB.`);
        return importNoteFile(file.name, await file.text());
      }));
      setImported(batches.flat());
    } catch (error) { setMessage(error instanceof Error ? error.message : "Files could not be read."); reportError(error, "Import failed"); }
    finally { setReading(false); }
  }
  const formats = [
    { type: "md", title: "Markdown", detail: "Text with formatting" },
    { type: "txt", title: "Plain text", detail: "Simple, readable text" },
    { type: "json", title: "Note backup", detail: "Restore all formatting" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-1 rounded-xl bg-secondary-bg border border-primary-border p-1" role="group" aria-label="File actions">
        {(["export", "import"] as const).map(item => <button key={item} type="button" aria-pressed={mode === item}
          className={`rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent ${mode === item ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          onClick={() => { setMode(item); setMessage(""); }}>{item === "export" ? "Export a note" : "Import notes"}</button>)}
      </div>
      {mode === "export" ? <div className="space-y-5">
        <div>
          <h3 className="text-xl font-semibold">Take your words with you</h3>
          <p className="mt-1 text-sm text-muted-foreground">Download the current note, or save a backup to import later.</p>
        </div>
        <div className="space-y-2">
          <label htmlFor="export-name" className="text-sm font-medium">File name</label>
          <div className="flex items-center gap-3">
            <TextBox id="export-name" className="w-full h-11" value={filename} onChange={event => setFilename(event.target.value)} />
            <span className="text-sm text-muted-foreground">.{fileType}</span>
          </div>
        </div>
        <fieldset>
          <legend className="text-sm font-medium mb-2">Download format</legend>
          <div className="grid gap-2 sm:grid-cols-3">
            {formats.map(format => <label key={format.type} className={`relative flex cursor-pointer gap-3 rounded-xl border p-3 hover:border-accent focus-within:outline-2 focus-within:outline-accent ${fileType === format.type ? "border-accent bg-accent/10" : "border-primary-border bg-secondary-bg"}`}>
              <input type="radio" name="export-format" value={format.type} checked={fileType === format.type} onChange={() => { setFileType(format.type); setMessage(""); }} className="mt-1 accent-accent" />
              <span><span className="block text-sm font-medium">{format.title}</span><span className="mt-1 block text-xs leading-relaxed text-muted-foreground">{format.detail}</span></span>
            </label>)}
          </div>
        </fieldset>
        <div className="border-t border-primary-border pt-5 flex justify-end">
          <Button text="Download note" extra="!bg-accent !text-accent-foreground !text-sm !px-5 h-11" action={() => {
            try { downloadNote(note, filename, fileType); setMessage(`Download requested (${fileType}).`); }
            catch (error) { setMessage("Download could not start. Please try again."); reportError(error, "Export failed"); }
          }} />
        </div>
      </div> : <div className="space-y-5">
        <div>
          <h3 className="text-xl font-semibold">Bring your notes together</h3>
          <p className="mt-1 text-sm text-muted-foreground">Choose files to preview. Each one is added as a new note.</p>
        </div>
        <div className="rounded-xl border border-dashed border-primary-border bg-secondary-bg p-5 sm:p-6 space-y-3">
          <label htmlFor="import-files" className="block text-sm font-medium">Choose your files</label>
          <p id="import-help" className="text-sm text-muted-foreground">Markdown (.md), plain text (.txt), or a Notes on Go backup (.json).</p>
          <input id="import-files" aria-label="Choose notes to import" aria-describedby="import-help" type="file" disabled={reading} accept=".md,.txt,.json" multiple
            className="block w-full min-w-0 text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-accent file:text-accent-foreground file:px-4 file:py-2 focus-visible:outline-2 focus-visible:outline-accent"
            onChange={event => { void readFiles(event.target.files); }} />
          <p className="text-xs text-muted-foreground">Up to 1 MB per file · 5 MB per batch</p>
        </div>
        {reading && <Spinner compact label="Reading files…" />}
        {imported.length > 0 && <div className="space-y-2" aria-live="polite">
          <h4 className="text-sm font-medium">Ready to import · {imported.length}</h4>
          <ul className="max-h-36 overflow-auto rounded-lg border border-primary-border divide-y divide-primary-border text-sm">{imported.map(item => <li className="px-3 py-2 break-words" key={item.id}>{item.title || "Untitled Note"}</li>)}</ul>
        </div>}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary-border pt-5">
          <p className="text-xs text-muted-foreground">Your existing notes stay unchanged.</p>
          <button type="button" disabled={reading || !imported.length} className="btn !bg-accent !text-accent-foreground !px-5 h-11 text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            onClick={() => onImport(imported)}>Import{imported.length ? ` ${imported.length} ${imported.length === 1 ? "note" : "notes"}` : " notes"}</button>
        </div>
      </div>}
      {message && <p role="status" className="rounded-lg bg-secondary-bg px-3 py-2 text-sm">{message}</p>}
    </div>
  );
}
