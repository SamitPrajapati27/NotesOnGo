import DropButton from "../MTComps/DropButton";
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
  const [openDropdown, setOpenDropdown] = useState("");
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
  const options = (["md", "txt", "json"] as const).map((type) => ({
    text: type,
    tooltip: type,
    action: () => { setFileType(type); setMessage(""); },
  }));

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex gap-2 mb-2" role="group" aria-label="File actions">
        <Button text="Export" pressed={mode === "export"} action={() => { setMode("export"); setMessage(""); }} />
        <Button text="Import" pressed={mode === "import"} action={() => { setMode("import"); setMessage(""); }} />
      </div>
      {mode === "import" ? <div className="flex flex-col gap-3 w-full">
        <p className="text-sm text-muted-foreground">Add .md, .txt, or Notes on Go .json files as new notes. Existing notes stay unchanged.</p>
        <label className="popup popup-row flex-col !items-start gap-2">
          <span>Choose notes</span>
          <input aria-label="Choose notes to import" type="file" accept=".md,.txt,.json" multiple className="w-full min-w-0 text-sm file:mr-2 file:rounded file:border file:border-primary-border file:bg-primary-bg file:px-2 file:py-1 file:cursor-pointer" onChange={(event) => { void readFiles(event.target.files); }} />
        </label>
        {reading && <p role="status">Reading files…</p>}
        {imported.length > 0 && <>
          <ul className="max-h-40 overflow-auto text-sm list-disc pl-5">{imported.map((item) => <li key={item.id}>{item.title || "Untitled Note"}</li>)}</ul>
          <Button text={`Import ${imported.length} ${imported.length === 1 ? "note" : "notes"}`} action={() => onImport(imported)} extra="btn-full w-full h-10" fullWidth />
        </>}
        <p className="text-xs text-muted-foreground">Up to 1 MB per file, 5 MB total. Markdown supports headings, lists, emphasis, and links.</p>
      </div> : <>
      <div className="popup popup-row">
        <label htmlFor="export-name">File Name</label>
        <input id="export-name" className="min-w-0 w-40 bg-transparent text-foreground outline-none focus:ring-1 focus:ring-accent rounded" value={filename} onChange={(event) => setFilename(event.target.value)} />
      </div>
      <div className="popup popup-row relative z-10 !overflow-visible">
        <span>File Type</span>
        <DropButton id="fileTypes" text="md" tooltip="file types" data={options} isOpen={openDropdown === "fileTypes"} onToggle={setOpenDropdown} pos="right" menuDirection="up" />
      </div>
      <Button
        text="Export"
        action={() => {
          try {
            downloadNote(note, filename, fileType);
            setMessage(`Download requested (${fileType}).`);
          } catch (error) {
            setMessage("Download could not start. Please try again.");
            reportError(error, "Export failed");
          }
        }}
        type="normal"
        tooltip="Export note"
        position="down"
        extra="!text-base !w-48 h-10"
      />
      </>}
      {message && <p role="status" className="text-sm">{message}</p>}
    </div>
  );
}
