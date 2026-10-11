"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { Editable } from "slate-react";
import { renderLeaf, RenderElement } from "@/src/scripts/engine";
import {
  Node,
  Descendant,
  createEditor,
  Editor,
  Range,
  Transforms,
} from "slate";
import { getWordCount } from "@/src/scripts/setup";
import { Slate, withReact, ReactEditor } from "slate-react";
import { withHistory } from "slate-history";
import {
  insertLink,
  linkAtSelection,
  removeLink,
  withLinks,
} from "@/src/scripts/links";
import { withMarkdownShortcuts } from "@/src/scripts/markdownShortcuts";
import LinkDialog from "./LinkDialog";
import { reportError } from "@/src/scripts/errors";
import { handleKeyDown } from "@/src/scripts/hotkeys";
import type { SettingData } from "@/src/types/BasicTypes";
import Toolbar from "./Toolbar";
type TextEditorProps = {
  initialValue: Descendant[];
  markdownShortcuts?: boolean;
  font: SettingData["font"];
  onFontChange: (font: SettingData["font"]) => void;
  onChange: (value: Descendant[]) => void;
};

/**
 * Create a Slate editor with history and links, and report document edits and word counts.
 */
export default function TextEditor({
  initialValue,
  markdownShortcuts = true,
  onChange,
  font,
  onFontChange,
}: TextEditorProps) {
  /**
   * Flatten document blocks into text and count their Unicode word groups.
   */
  const countWords = (value: Descendant[]) =>
    getWordCount(value.map((node) => Node.string(node)).join("\n"));
  const [wordCount, setWordCount] = useState(() => countWords(initialValue));
  const shortcutsEnabled = useRef(markdownShortcuts);
  useEffect(() => { shortcutsEnabled.current = markdownShortcuts; }, [markdownShortcuts]);
  const editor = useMemo(
    () => {
      const instance = withLinks(withHistory(withReact(createEditor())));
      // The plugin reads this callback only during text insertion, never during render.
      // eslint-disable-next-line react-hooks/refs
      return withMarkdownShortcuts(instance, () => shortcutsEnabled.current && !ReactEditor.isComposing(instance));
    },
    [],
  );
  const [linkDraft, setLinkDraft] = useState<{
    selection: Range;
    text: string;
    url: string;
  } | null>(null);
  /**
   * Capture the editor selection and prepare the selected link or text for the link dialog.
   */
  function openLink() {
    const selection = editor.selection || {
      anchor: Editor.end(editor, []),
      focus: Editor.end(editor, []),
    };
    Transforms.select(editor, selection);
    const existing = linkAtSelection(editor);
    setLinkDraft({
      selection: structuredClone(selection),
      text: existing
        ? Node.string(existing[0])
        : Editor.string(editor, selection),
      url: existing && "url" in existing[0] ? existing[0].url || "" : "",
    });
  }
  /**
   * Dismiss the link dialog and restore the saved selection and editor focus.
   */
  function closeLink() {
    if (linkDraft) Transforms.select(editor, linkDraft.selection);
    setLinkDraft(null);
    ReactEditor.focus(editor);
  }
  /**
   * Update the word count and notify the parent only for document-changing operations.
   */
  const handleEditorChange = (newValue: Descendant[]) => {
    if (
      !editor.operations.some((operation) => operation.type !== "set_selection")
    )
      return;
    setWordCount(countWords(newValue));
    onChange(newValue);
  };

  return (
    <div className="mt-1 relative w-full max-w-200 min-w-0">
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleEditorChange}>
        <Toolbar font={font} onFontChange={onFontChange} onLink={openLink} />
        {linkDraft && (
          <LinkDialog
            initialText={linkDraft.text}
            initialUrl={linkDraft.url}
            onClose={closeLink}
            onApply={(text, url) => {
              insertLink(editor, linkDraft.selection, text, url);
              setLinkDraft(null);
              ReactEditor.focus(editor);
            }}
            onRemove={
              linkDraft.url
                ? () => {
                    removeLink(editor, linkDraft.selection);
                    setLinkDraft(null);
                    ReactEditor.focus(editor);
                  }
                : undefined
            }
          />
        )}
        <div className="relative w-full h-[calc(100dvh-14rem)] min-[1360px]:h-[calc(100dvh-9rem)] min-h-64 sm:min-h-80 ">
          <Editable
            style={{
              fontFamily:
                font === "Elegant"
                  ? "var(--font-ibm-serif), Georgia, serif"
                  : font === "Fun"
                    ? "var(--font-gamja), cursive"
                    : "Arial, Helvetica, sans-serif",
            }}
            renderLeaf={renderLeaf}
            renderElement={(props) => (
              <RenderElement {...props} onEditLink={openLink} />
            )}
            onKeyDown={(event) => {
              if (event.nativeEvent.isComposing) return;
              try {
                if (
                  (event.metaKey || event.ctrlKey) &&
                  event.key.toLowerCase() === "k"
                ) {
                  event.preventDefault();
                  openLink();
                  return;
                }
                handleKeyDown(event, editor);
              } catch (error) {
                event.preventDefault();
                reportError(error, "Editor error");
              }
            }}
            aria-label="Note content"
            placeholder="Start Typing"
            renderPlaceholder={({ attributes, children }) => (
              <span {...attributes} style={{ ...attributes.style, top: "1.5rem", left: "1rem", width: "calc(100% - 2rem)" }}>
                {children}
              </span>
            )}
            className="text-editor size-full appearance-none border border-primary-border rounded-lg resize-none overflow-y-auto [overflow-wrap:anywhere] px-4 pt-6 pb-16"
          />
          <div className="absolute left-3 bottom-3 text-center whitespace-nowrap flex space-x-2 p-2 bg-primary-bg border border-primary-border rounded-xl ">
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
