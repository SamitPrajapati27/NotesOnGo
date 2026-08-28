"use client";
import Button from "../../MTComps/Button";
import NoteFile from "./NoteFile";
import { database } from "@/src/scripts/dataBase";
import { useState, useEffect } from "react";
import { usePopup, PopupController } from "@/src/scripts/setup";
type SideBarProps = {
  setSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  settingsPopup: PopupController;
};
export default function SideBar({ setSideBar, settingsPopup }: SideBarProps) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;

    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <>
      <section className="w-screen lg:w-72 h-full space-y-4 flex flex-col bg-primary-bg border border-primary-border rounded-r-2xl *:p-2">
        <div className="flex items-center justify-between mt-1">
          <Button
            icon="material-symbols:view-sidebar"
            action={() => {
              setSideBar(false);
            }}
            type="normal"
            tooltip="sidebar"
            position="down"
            extra="!text-2xl"
          />
          <h1 className="text-xl md:text-2xl text-center w-full">Notes on Go</h1>
        </div>

        <div className="search-area"></div>

        <div className="h-full flex flex-col item-scenter">
          <h2 className="items-start">Your Notes:</h2>
          <div className="flex flex-col">
            {database.map((item, index) => <NoteFile key={index}  data={item} />)}
          </div>
          <div className="mt-auto mx-auto">
            <Button
              text="New Note"
              action={() => {
                console.log("New Note");
              }}
              type="normal"
              tooltip="New Note"
              position="down"
              extra="!text-xl !border-2 !border-primary-border w-72 h-10 md:!w-48"
            />
          </div>
        </div>

        <div className="Theme-Setting flex w-full justify-around">
          <Button
            icon={
              dark
                ? "material-symbols:light-mode"
                : "material-symbols:dark-mode"
            }
            action={() => {
              setDark((d) => !d);
            }}
            type="normal"
            tooltip="theme"
            position="left"
            extra="!text-2xl "
          />
          <Button
            icon="material-symbols:settings-outline"
            action={() => {
              settingsPopup.open();
            }}
            type="normal"
            tooltip="settings"
            position="right"
            extra="!text-2xl"
          />
        </div>
      </section>
    </>
  );
}
