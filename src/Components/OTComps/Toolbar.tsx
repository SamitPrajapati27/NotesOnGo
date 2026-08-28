"use client";
import { useState, useRef } from "react";
import { useSlate,ReactEditor, Slate } from "slate-react";
import Button from "@/src/Components/MTComps/Button";
import DropButton from "@/src/Components/MTComps/DropButton";
import { Editor, Transforms } from "slate";
import { isMarkActive,isBlockActive,clearFormat, changeIndent} from "@/src/scripts/engine";
import {createListDropdown,TBFontsDDD,createHeadingDropdown} from "@/src/scripts/setup";
export default function Toolbar() {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const editor = useSlate();
  const toggleMark = (format: string) => {
    const isActive = isMarkActive(editor, format);
    const selection = editor.selection;
    if (!selection) return;
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
    Transforms.select(editor, selection);
    ReactEditor.focus(editor)
  };
  const heads = createHeadingDropdown(editor),
        lists = createListDropdown(editor);
  return (
    <div
      className="p-1 rounded-md md:my-3 border-primary-border border divide-x divide-primary-border size-fit mx-auto flex items-center justify-between ">
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
        data={heads}
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
        data={lists}
        isOpen={openDropdown === "lists"}
        onToggle={setOpenDropdown}
      />
      <div className="">
        <Button
          icon="material-symbols:format-indent-decrease-rounded"
          action={() => changeIndent(editor,"decrease")}
          type="normal"
          tooltip="Decrease-indent"
        />
        <Button
          icon="material-symbols:format-indent-increase-rounded"
          action={() => changeIndent(editor,"increase")}
          type="normal"
          tooltip="Increase-indent"
        />
        <Button
          icon="material-symbols:format-clear-rounded"
          action={() => clearFormat(editor)}
          type="normal"
          tooltip="format-clear"
        />
      </div>
    </div>
  );
}
