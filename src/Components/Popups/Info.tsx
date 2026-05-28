"use client";
import { shortcuts } from "@/src/scripts/setup";
export default function Info() {
  return (
    <div className="">
      <div className="flex items-center w-full justify-between gap-2">
        <span>Action</span>
        <span>Shortcuts</span>
      </div>
      <div className="flex flex-col space-y-2">
        {
        shortcuts.map((item, index) => (
          <div key={index} className="popup popup-row flex items-center w-full justify-between">
            <span>{item.action}</span>
            <span>{item.shortcut}</span>
          </div>
        ))
      }
      </div>
    </div>
  );
}
