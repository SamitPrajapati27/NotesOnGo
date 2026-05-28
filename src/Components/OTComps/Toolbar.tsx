"use client";
import { useState, useRef } from "react";
import { useSlate,ReactEditor } from "slate-react";
import Button from "@/src/Components/MTComps/Button";
import DropButton from "@/src/Components/MTComps/DropButton";
import { Editor, Transforms } from "slate";
import { isMarkActive,isBlockActive } from "@/src/scripts/engine";
import {TBListDDD,TBHeadDDD,TBFontsDDD} from "@/src/scripts/setup";
export default function Toolbar() {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const toolbarRef = useRef<HTMLDivElement>(null);
  const editor = useSlate();

  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format);
    const selection = editor.selection;
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
    Transforms.select(editor, selection);
    ReactEditor.focus(editor)
  };
  const toggleBlock = (format: string) => {
    const isActive = isBlockActive(editor, format);

    Transforms.setNodes(
      editor,
      {
        type: isActive ? "paragraph" : format,
      },
      {
        match: (n) => Editor.isBlock(editor, n),
      },
    );
  };
  return (
    <div
      className="p-1 rounded-md bg-primary-bg border-primary-border border divide-x divide-primary-border size-fit mx-auto mt-2 flex items-center justify-between ">
      <div className="">
        <Button
          icon="material-symbols:format-bold-rounded"
          action={() => {
            toggleMark("bold");
          }}
          type="normal"
          tooltip="bold"
        />
        <Button
          icon="material-symbols:format-italic-rounded"
          action={() => {
            toggleMark("italic");
          }}
          type="normal"
          tooltip="italic"
        />
        <Button
          icon="material-symbols:format-underlined-rounded"
          action={() => toggleMark("underline")}
          type="normal"
          tooltip="underline"
        />
      </div>
      <DropButton
        id="headings"
        text={"Heading 1"}
        tooltip="headings"
        data={TBHeadDDD}
        isOpen={openDropdown === "headings"}
        onToggle={setOpenDropdown}
      />
      <DropButton
        id="fonts"
        text={"Default"}
        tooltip="fonts"
        data={TBFontsDDD}
        isOpen={openDropdown === "fonts"}
        onToggle={setOpenDropdown}
      />
      <DropButton
        id="lists"
        icon={"material-symbols:format-list-bulleted-rounded"}
        tooltip="lists"
        data={TBListDDD}
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
    </div>
  );
}
