import Toggle from "../MTComps/Toggle";
import Button from "../MTComps/Button";
import { PopupController, saveConfirmationDuration } from "@/src/scripts/setup";
import { useEffect, useState } from "react";
type UtilityProps = {
  setExportPopup: PopupController;
  setImportPopup: PopupController;
  setInfoPopup: PopupController;
  onSave: () => boolean;
  autosave: boolean;
  dirty: boolean;
  onToggleAutosave: () => void;
};

/**
 * Render autosave, manual save, export, import, and help controls with temporary save confirmation.
 */
export default function Utility({
  setExportPopup,
  setImportPopup,
  setInfoPopup,
  onSave,
  autosave,
  dirty,
  onToggleAutosave,
}: UtilityProps) {
  const [confirmation, setConfirmation] = useState(0);
  useEffect(() => {
    if (!confirmation) return;
    const timer = window.setTimeout(() => setConfirmation(0), saveConfirmationDuration);
    return () => window.clearTimeout(timer);
  }, [confirmation]);
  const saved = confirmation > 0 && !dirty;
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      <div className="flex items-center justify-center gap-1.5 mr-2 min-h-8">
          <span className="text-xs">Auto Save</span>
          <Toggle checked={autosave} action={onToggleAutosave} label="Autosave" size="sm" />
      </div>
      <span role="status" aria-live="polite" className="sr-only">{saved ? "Note saved" : dirty ? "Unsaved changes" : ""}</span>
      <Button
        icon="material-symbols:save"
        action={() => { const success = onSave(); setConfirmation((value) => success ? value + 1 : 0); }}
        feedback={saved ? "saved" : dirty ? "unsaved" : undefined}
        type="normal"
        tooltip="save"
        extra="!text-xl btn-full"
      />
      <Button
        icon="material-symbols:upload-2-rounded"
        action={() => {
          setExportPopup.open();
        }}
        type="normal"
        tooltip="export"
        extra="!text-xl btn-full"
      />
      <Button
        icon="material-symbols:download-2-rounded"
        action={setImportPopup.open}
        type="normal"
        tooltip="import"
        extra="!text-xl btn-full"
      />
      <Button
        icon="material-symbols:info-rounded"
        action={() => {
          setInfoPopup.open();
        }}
        type="normal"
        tooltip="info"
        extra="!text-xl btn-full"
      />
    </div>
  );
}
