import Button from "../MTComps/Button";
import { PopupController } from "@/src/scripts/setup";
type UtilityProps = {
  setExportPopup: PopupController;
  setInfoPopup: PopupController
};

export default function Utility({setExportPopup,setInfoPopup} : UtilityProps) {
  return (
    <div className="divide-x-[.1rem] divide-primary-border rounded-lg bg-primary-bg border border-primary-border mr-5 p-1">
      <Button
        icon="material-symbols:save"
        action={() => {
          console.log("Test");
        }}
        type="normal"
        tooltip="save"
        extra="!text-xl"
      />
      <Button
        icon="material-symbols:upload-2-rounded"
        action={() => {
          setExportPopup.open();
        }}
        type="normal"
        tooltip="export"
        extra="!text-xl"
      />
      <Button
        icon="material-symbols:info-rounded"
        action={() => {
          setInfoPopup.open();
        }}
        type="normal"
        tooltip="info"
        extra="!text-xl"
      />
    </div>
  );
}
