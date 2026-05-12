"use client";
import Toolbar from "@/src/Components/OTComps/Toolbar";
import TextEditor from "@/src/Components/OTComps/TextEditor";
import Popup from "@/src/Components/MTComps/Popup";
import { PopupProps } from "@/src/types/MainTypes";
import { useState } from "react";
import Button from "@/src/Components/MTComps/Button";
import Info from "@/src/Components/Popups/Info";
export default function Home() {
  // This is how popup will be displayed, make a useState variables; then a PopupProps variable 
  const [isTestPopup, setIsTestPopup] = useState(false);
  const testPopup: PopupProps = {
    isOpen: isTestPopup,
    onClose: () => setIsTestPopup(false),
    title: "Test",
  };
  return (
    <main className="min-h-screen relative">
      <section className="flex flex-col items-center justify-between">
        <div className="flex items-center justify-between w-full">
          <Button
            icon="material-symbols:view-sidebar"
            action={() => {
              document.documentElement.classList.toggle("dark");
            }}
            type="normal"
            tooltip="sidebar"
            position="right"
            extra="ml-2 !text-xl"
          />
          <Toolbar />
        </div>
        <TextEditor />
      </section>
      <section className="absolute right-10">
        <Button
          icon="material-symbols:info-rounded"
          action={() => {
            setIsTestPopup(true);
          }}
          type="normal"
          tooltip="close"
        />
      </section>
      <Popup
        isOpen={testPopup.isOpen}
        onClose={testPopup.onClose}
        title={testPopup.title}
        children={Info}
      />
    </main>
  );
}
