"use client";
import { useState } from "react";
import { useSlate, ReactEditor } from "slate-react";
import Button from "@/src/Components/MTComps/Button";
import DropButton from "@/src/Components/MTComps/DropButton";
import { toggleMark as applyMark, type Mark } from "@/src/scripts/formatting";
import { isMarkActive, clearFormat, changeIndent } from "@/src/scripts/engine";
import {
  createListDropdown,
  createFontDropdown,
  createHeadingDropdown,
} from "@/src/scripts/setup";
import type { SettingData } from "@/src/types/BasicTypes";
/**
 * Render formatting controls connected to the active Slate editor and note font.
 */
export default function Toolbar({
  font,
  onFontChange,
  onLink,
}: {
  font: SettingData["font"];
  onFontChange: (font: SettingData["font"]) => void;
  onLink: () => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<string>("");
  const editor = useSlate();
  /**
   * Toggle the selected text mark, then restore the selection and editor focus.
   */
  const toggleMark = (format: Mark) => {
    applyMark(editor, format);
    ReactEditor.focus(editor);
  };
  const heads = createHeadingDropdown(editor),
    lists = createListDropdown(editor);
  return (
    <div role="toolbar" aria-label="Text formatting"
      onMouseDown={(event) => { if ((event.target as HTMLElement).closest("button")) event.preventDefault(); }}
      className="p-1 rounded-xl mb-3 border-primary-border border max-w-full w-fit mx-auto flex flex-wrap gap-1 items-center justify-center ">
      <div className="flex shrink-0 gap-1">
        <Button
          icon="material-symbols:format-bold-rounded"
          action={() => {
            toggleMark("bold");
          }}
          type="normal"
          tooltip="bold"
          pressed={isMarkActive(editor, "bold")}
        />
        <Button
          icon="material-symbols:format-italic-rounded"
          action={() => {
            toggleMark("italic");
          }}
          type="normal"
          tooltip="italic"
          pressed={isMarkActive(editor, "italic")}
        />
        <Button
          icon="material-symbols:format-underlined-rounded"
          action={() => toggleMark("underline")}
          type="normal"
          tooltip="underline"
          pressed={isMarkActive(editor, "underline")}
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
        text={font}
        tooltip="fonts"
        data={createFontDropdown(onFontChange)}
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
      <div className="flex shrink-0 gap-1">
        <Button
          icon="material-symbols:format-indent-decrease-rounded"
          action={() => changeIndent(editor, "decrease")}
          type="normal"
          tooltip="Decrease-indent"
        />
        <Button
          icon="material-symbols:format-indent-increase-rounded"
          action={() => changeIndent(editor, "increase")}
          type="normal"
          tooltip="Increase-indent"
        />
        <Button
          icon="material-symbols:link-rounded"
          action={onLink}
          tooltip="Insert link (⌘K)"
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
