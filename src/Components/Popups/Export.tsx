import DropButton from "../MTComps/DropButton";
import Button from "../MTComps/Button";
import { useState } from "react";
import { PUExportDDD } from "@/src/scripts/setup";
export default function Export() {
  const [openDropdown, setOpenDropdown] = useState<string>("");

  return (
    <div className="flex flex-col items-center space-y-2 overflow-y-visible">
      <div className="popup popup-row">
        <span>File Name</span>
        <input type="text" />
      </div>
      <div className="popup popup-row overflow-y-visible">
        <span>File Type</span>
        <DropButton
          id="fileTypes"
          text={"md"}
          tooltip="file types"
          data={PUExportDDD}
          isOpen={openDropdown === "fileTypes"}
          onToggle={setOpenDropdown}
          pos="right"
        />
      </div>
      <Button
        text="Export"
        action={() => {
          console.log("Export");
        }}
        type="normal"
        tooltip="sidebar"
        position="down"
        extra="!text-xl !border-2 !border-primary-border !w-48"
      />
    </div>
  );
}
