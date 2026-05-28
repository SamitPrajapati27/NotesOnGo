"use client";
import { useState } from "react";
import {
  Editable,
  RenderLeafProps,
} from "slate-react";
import { renderLeaf } from "@/src/scripts/engine";
export default function TextEditor() {
  const [text, setText] = useState("");
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  return (
    <div className="size-200 mt-10 relative">
      <Editable
        renderLeaf={renderLeaf}
        placeholder="Start Typing"
        className="size-full appearance-none bg-primary-bg border border-primary-border rounded-lg resize-none p-2 focus:outline-none focus:ring-0"
      />
      <div className="absolute flex space-x-2 right-5 bottom-2">
        <p>
          Word:
          {wordCount}
        </p>
        <p>Date:</p>
      </div>
    </div>
  );
}

