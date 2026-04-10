"use client";
import { useState } from "react";
export default function TextEditor() {
  const [text, setText] = useState("");
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }).format(date);
  };
  const wordCount = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;

  const currentDate = formatDate(new Date());

  return (
    <div className="size-200 mt-10 relative">
      <textarea
        className="size-full appearance-none bg-primary-bg border-border border rounded-lg resize-none p-2 focus:outline-none focus:ring-0"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your Note"
      />
      <div className="absolute flex space-x-2 left-5 bottom-2">
        <p>
          Word:
          {wordCount}
        </p>
        <p>
          Date:
          {currentDate}
        </p>
      </div>
    </div>
  );
}
