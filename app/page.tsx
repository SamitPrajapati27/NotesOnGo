"use client";
import { TooltipPreference } from "@/src/Components/MTComps/TooltipPreference";
import TextBox from "@/src/Components/MTComps/TextBox";
import Spinner from "@/src/Components/MTComps/Spinner";
import TextEditor from "@/src/Components/OTComps/TextEditor";
import Popup from "@/src/Components/MTComps/Popup";
import SideBar from "@/src/Components/OTComps/NExplore/Sidebar";
import Utility from "@/src/Components/OTComps/Utility";
import Setting from "@/src/Components/Popups/Setting";
import Button from "@/src/Components/MTComps/Button";
import Info from "@/src/Components/Popups/Info";
import Import from "@/src/Components/Popups/Import";
import Export from "@/src/Components/Popups/Export";
import ErrorBoundary from "@/src/Components/Errors/ErrorBoundary";
import NoteNotFound from "@/src/Components/Errors/NoteNotFound";
import { downloadNote } from "@/src/scripts/exporting";
import { useState } from "react";
import { usePopup, useSettings } from "@/src/scripts/setup";
import { useNotes } from "@/src/scripts/saving";
/**
 * Compose the notes workspace, active document, sidebar, and application dialogs.
 */
export default function Home() {
  const infoPopup = usePopup("Info"),
    settingsPopup = usePopup("Setting"),
    exportPopup = usePopup("Export"),
    importPopup = usePopup("Import");
  const [isSideBar, setSideBar] = useState(false);
  const notes = useNotes();
  const activeNote = notes.collection?.notes.find(
    (note) => note.id === notes.collection?.activeNoteId,
  );
  const settings = useSettings();
  if (!notes.collection || !activeNote) {
    return (
      <main
        className="flex justify-center items-center size-full"
        role="status">
        <Spinner label="Loading your notes…" />
      </main>
    );
  }

  if (notes.missingNote) {
    return <NoteNotFound onHome={() => notes.select(activeNote.id)} />;
  }

  return (
    <TooltipPreference value={settings.settings.toolTip}>
      <main className="flex-1 relative overflow-x-hidden">
        <div
          inert={!isSideBar}
          aria-hidden={!isSideBar}
          className={`fixed inset-y-0 left-0 z-50 transition-transform duration-500 ease-in-out motion-reduce:transition-none ${isSideBar ? "translate-x-0" : "-translate-x-full"}`}>
          <SideBar
            setSideBar={setSideBar}
            settingsPopup={settingsPopup}
            notes={notes.collection.notes}
            activeNoteId={activeNote.id}
            onCreate={notes.create}
            onSelect={notes.select}
            onRename={notes.rename}
            onDelete={(id) => {
              const note = notes.collection?.notes.find(
                (item) => item.id === id,
              );
              if (
                note &&
                window.confirm(
                  `Delete “${note.title || "Untitled Note"}”? This cannot be undone.`,
                )
              )
                notes.remove(id);
            }}
          />
        </div>
        <section
          onClick={() => {
            if (isSideBar && window.matchMedia("(max-width: 639px)").matches)
              setSideBar(false);
          }}
          className={`relative z-0 flex flex-col items-center gap-2 px-3 sm:px-4 pt-2 ${isSideBar ? "sm:ml-80 lg:ml-72" : ""}`}>
          <div className="grid grid-cols-[auto_1fr] min-[1360px]:grid-cols-[1fr_minmax(0,50rem)_1fr] items-center gap-2 w-full">
            <div
              inert={isSideBar}
              aria-hidden={isSideBar}
              className={`col-start-1 row-start-1 justify-self-start transition-all duration-200 ease-in ${!isSideBar ? "opacity-100" : "opacity-0"}`}>
              <Button
                icon="material-symbols:view-sidebar"
                action={() => {
                  setSideBar(true);
                }}
                type="normal"
                tooltip="sidebar"
                position="right"
                extra="ml-2 !text-2xl btn-full"
              />
            </div>
            <div className="rounded-lg col-span-2 row-start-2 w-full max-w-200 justify-self-center min-[1360px]:col-span-1 min-[1360px]:col-start-2 min-[1360px]:row-start-1 h-10">
              <TextBox
                type="text"
                className="w-full h-full appearance-none px-2 text-center"
                aria-label="Note title"
                value={activeNote.title}
                onChange={(e) => {
                  notes.rename(activeNote.id, e.target.value);
                }}
                placeholder="Untitled Note"
              />
            </div>
            <div className="col-start-2 row-start-1 justify-self-end min-[1360px]:col-start-3">
              <Utility
                key={activeNote.id}
                setInfoPopup={infoPopup}
                setExportPopup={exportPopup}
                setImportPopup={importPopup}
                onSave={notes.save}
                autosave={notes.autosave}
                dirty={notes.dirty}
                onToggleAutosave={notes.toggleAutosave}
              />
            </div>
          </div>
          {notes.error && (
            <p className="px-3 mt-2 text-sm" role="alert">
              {notes.error}
            </p>
          )}
          <ErrorBoundary
            key={activeNote.id}
            label="Editor"
            recovery={
              <Button
                text="Export note backup"
                action={() =>
                  downloadNote(activeNote, activeNote.title, "json")
                }
              />
            }>
            <TextEditor
              markdownShortcuts={settings.settings.markdownShortcuts}
              key={activeNote.id}
              initialValue={activeNote.data}
              font={activeNote.font || "Default"}
              onFontChange={(font) => notes.setFont(activeNote.id, font)}
              onChange={(data) => notes.edit(activeNote.id, data)}
            />
          </ErrorBoundary>
        </section>
        <Popup
          wide
          isOpen={infoPopup.isOpen}
          onClose={infoPopup.close}
          title={infoPopup.title}>
          <Info markdownShortcuts={settings.settings.markdownShortcuts} />
        </Popup>
        <Popup
          isOpen={settingsPopup.isOpen}
          onClose={settingsPopup.close}
          title={settingsPopup.title}>
          <Setting
            settings={settings.settings}
            setSettings={settings.setSettings}
          />
        </Popup>
        <Popup
          isOpen={exportPopup.isOpen}
          onClose={exportPopup.close}
          title={exportPopup.title}>
          <Export key={activeNote.id} note={activeNote} />
        </Popup>
        <Popup
          isOpen={importPopup.isOpen}
          onClose={importPopup.close}
          title={importPopup.title}>
          <Import
            onImport={(imported) => {
              notes.importNotes(imported);
            }}
          />
        </Popup>
      </main>
    </TooltipPreference>
  );
}
