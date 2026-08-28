import Button from "../MTComps/Button";
import { PopupController } from "@/src/scripts/setup";
type UtilityProps = {
  setExportPopup: PopupController;
  setInfoPopup: PopupController;
};

export default function Utility({
  setExportPopup,
  setInfoPopup,
}: UtilityProps) {
  return (
    <div className="space-x-1 md:mr-5 md:p-1">
      <Button
        icon="material-symbols:save"
        action={() => {
          console.log("Test");
        }}
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
