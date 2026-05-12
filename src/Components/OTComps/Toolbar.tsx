"use client";
import { useState, useRef, useEffect } from "react";
import Button from "@/src/Components/MTComps/Button";
import { ezCreateDDD } from "@/src/scripts/TypeFactories";
import { DropdownData } from "@/src/types/DropButton";
import DropButton from "@/src/Components/MTComps/DropButton";

export default function Toolbar() {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownListIcons = [
    ["material-symbols:format-list-bulleted-rounded", "bullet"],
    ["material-symbols:format-list-numbered-rounded", "number"],
    ["material-symbols:checklist-rounded", "checklist"],
  ];
  const dropdownList: DropdownData[] = dropdownListIcons.map((icon) =>
    ezCreateDDD(icon[1], icon[0], undefined),
  );
  const headingTexts = ["Heading 1", "Heading 2", "Heading 3"];
  const headingList: DropdownData[] = headingTexts.map((text) =>
    ezCreateDDD(text, undefined, text),
  );
  const fontsTexts = ["Default", "Elegant", "Fun"];
  const fontsList: DropdownData[] = fontsTexts.map((font) =>
    ezCreateDDD(font, undefined, font),
  );
  console.log(fontsList);
  return (
    <div
      ref={toolbarRef}
      className="p-1 rounded-md bg-primary-bg border-primary-border border divide-x divide-primary-border size-fit mx-auto mt-2 flex items-center justify-between ">
      <div className="">
        <Button
          icon="material-symbols:format-bold-rounded"
          action={() => {
            const text: string = "";
            return "<B>" + text + "</B>"
          }}
          type="normal"
          tooltip="bold"
        />
        <Button
          icon="material-symbols:format-italic-rounded"
          action={() => {
            const text: string = "";
            return "<i>" + text + "</i>"
          }}
          type="normal"
          tooltip="italic"
        />
        <Button
          icon="material-symbols:format-underlined-rounded"
          action={() => console.log("Underline")}
          type="normal"
          tooltip="underline"
        />
      </div>
      <DropButton
        id="headings"
        text={headingTexts[0]}
        tooltip="headings"
        data={headingList}
        isOpen={openDropdown === "headings"}
        onToggle={setOpenDropdown}
      />
      <DropButton
        id="fonts"
        text={fontsTexts[0]}
        tooltip="fonts"
        data={fontsList}
        isOpen={openDropdown === "fonts"}
        onToggle={setOpenDropdown}
      />
      <DropButton
        id="lists"
        icon={dropdownListIcons[0][0]}
        tooltip="lists"
        data={dropdownList}
        isOpen={openDropdown === "lists"}
        onToggle={setOpenDropdown}
      />
      <div className="">
        <Button
          icon="material-symbols:format-indent-decrease-rounded"
          action={() => console.log("Indent")}
          type="normal"
          tooltip="Decrease-indent"
        />
        <Button
          icon="material-symbols:format-indent-increase-rounded"
          action={() => console.log("Indent")}
          type="normal"
          tooltip="Increase-indent"
        />
        <Button
          icon="material-symbols:format-clear-rounded"
          action={() => console.log("Clear")}
          type="normal"
          tooltip="format-clear"
        />
      </div>
      <Button
        icon="material-symbols:chevron-left-rounded"
        action={() => console.log("Chevron")}
        type="normal"
        tooltip="collapse"
      />
    </div>
  );
}