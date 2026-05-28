"use client";
import Toolbar from "@/src/Components/OTComps/Toolbar";
import TextEditor from "@/src/Components/OTComps/TextEditor";
import Popup from "@/src/Components/MTComps/Popup";
import SideBar from "@/src/Components/OTComps/NExplore/Sidebar";
import Utility from "@/src/Components/OTComps/Utility";
import Setting from "@/src/Components/Popups/Setting";
import Button from "@/src/Components/MTComps/Button";
import Info from "@/src/Components/Popups/Info";
import Export from "@/src/Components/Popups/Export";
import { useState, useMemo } from "react";
import { Slate, withReact } from "slate-react";
import { createEditor } from "slate";
import { usePopup } from "@/src/scripts/setup";
export default function Home() {
  const infoPopup = usePopup("Info"),
    settingsPopup = usePopup("Settings"),
    exportPopup = usePopup("Export");
  const [isSideBar, setSideBar] = useState(false);
  const editor = useMemo(() => withReact(createEditor()), []);

  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "" }],
    },
  ]);

  return (
    <main className="flex-1 relative">
      <div
        className={`absolute h-full left-0 z-50 transition-all  duration-500 ease-linear ${isSideBar ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
        <SideBar setSideBar={setSideBar} settingsPopup={settingsPopup} />
      </div>
      <section
        className={`relative flex  flex-col items-center justify-between `}>
        <Slate editor={editor} initialValue={value}>
          <div className="flex items-center justify-around w-full">
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
                extra="ml-2 !text-2xl"
              />
            </div>
            <Toolbar />
            <Utility setInfoPopup={infoPopup} setExportPopup={exportPopup}/>
          </div>
          <TextEditor />
        </Slate>
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
        <Setting />
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
