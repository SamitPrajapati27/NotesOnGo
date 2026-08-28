"use client";
import TextEditor from "@/src/Components/OTComps/TextEditor";
import Popup from "@/src/Components/MTComps/Popup";
import SideBar from "@/src/Components/OTComps/NExplore/Sidebar";
import Utility from "@/src/Components/OTComps/Utility";
import Setting from "@/src/Components/Popups/Setting";
import Button from "@/src/Components/MTComps/Button";
import Info from "@/src/Components/Popups/Info";
import Export from "@/src/Components/Popups/Export";
import { useState } from "react";
import { usePopup, useSettings } from "@/src/scripts/setup";
export default function Home() {
  const infoPopup = usePopup("Info"),
    settingsPopup = usePopup("Settings"),
    exportPopup = usePopup("Export");
  const [isSideBar, setSideBar] = useState(false);
  const [title, setTitle] = useState("Untitled Note");
  const settings = useSettings();
  return (
    <main className="flex-1 relative overflow-x-hidden">
      <div
        className={`absolute h-full left-0 z-50 transition-all  duration-500 ease-linear ${isSideBar ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        <SideBar setSideBar={setSideBar} settingsPopup={settingsPopup} />
      </div>
      <section
        className={`relative flex  flex-col items-center justify-between mt-2`}>
        <div className="flex items-center space-x-2 justify-between w-full">
          <div
            className={`transition-all duration-200 ease-in ${!isSideBar ? "opacity-100" : "opacity-0"}`}>
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
          <div className="hover:bg-accent hover:text-white border border-primary-border rounded-lg w-75 md:w-200 h-10">
            <input
              type="text"
              className="w-full h-full apperance-none outline-none border-none pl-2"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
              placeholder="Untitled Note"
            />
          </div>
          <Utility setInfoPopup={infoPopup} setExportPopup={exportPopup} />
        </div>
        <TextEditor />
        <div className=""></div>
      </section>
      <Popup
        isOpen={infoPopup.isOpen}
        onClose={infoPopup.close}
        title={infoPopup.title}>
        <Info />
      </Popup>
      <Popup
        isOpen={settingsPopup.isOpen}
        onClose={settingsPopup.close}
        title={settingsPopup.title}>
        <Setting settings={settings.settings} setSettings={settings.setSettings}/>
      </Popup>
      <Popup
        isOpen={exportPopup.isOpen}
        onClose={exportPopup.close}
        title={exportPopup.title}>
        <Export />
      </Popup>
    </main>
  );
}
