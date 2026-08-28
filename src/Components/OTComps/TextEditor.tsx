"use client";
import { useState, useMemo } from "react";
import { Editable, RenderLeafProps, useSlate } from "slate-react";
import { renderLeaf, renderElement, toggleBlock } from "@/src/scripts/engine";
import { Editor, Transforms, Element, Descendant, createEditor } from "slate";
import { getWordCount } from "@/src/scripts/setup";
import { Slate, withReact } from "slate-react";
import { handleKeyDown } from "@/src/scripts/hotkeys";
import Toolbar from "./Toolbar";
export default function TextEditor() {
  const [text, setText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [value, setValue] = useState<Descendant[]>([
    { type: "paragraph", children: [{ text: "" }] },
  ]);
  const editor = useMemo(() => withReact(createEditor()), []);
  const handleEditorChange = (newValue: Descendant[]) => {
    setValue(newValue);
    const currentText = Editor.string(editor, []);
    setWordCount(getWordCount(currentText));
  };

  return (
    <div className="mt-1 relative">
      <Slate editor={editor} initialValue={value} onChange={handleEditorChange}>
        <Toolbar />
        <div className="relative w-full md:w-200 h-[80vh] md:max-h-175 min-h-100 ">
          <Editable
            renderLeaf={renderLeaf}
            renderElement={renderElement}
            onKeyDown={(event) => handleKeyDown(event, editor)}
            placeholder="Start Typing"
            className="size-full appearance-none border border-primary-border rounded-lg resize-none p-1 md:p-2 focus:outline-none focus:ring-0"
          />
          <div className="absolute text-center flex space-x-2 md:w-20 right-2 md:left-5 bottom-5 p-0.5 md:p-2 bg-primary-bg border border-primary-border rounded-xl ">
            <p className="">
              {wordCount}
              <span className="ml-1">Word</span>
            </p>
          </div>
        </div>
      </Slate>
    </div>
  );
}
