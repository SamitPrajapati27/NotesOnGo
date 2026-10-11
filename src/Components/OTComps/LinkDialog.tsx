"use client";
import { useState } from "react";
import { createPortal } from "react-dom";
import Button from "../MTComps/Button";
import Popup from "../MTComps/Popup";
import { normalizeLinkUrl } from "@/src/scripts/urls";

type Props = {
  initialText: string;
  initialUrl: string;
  onApply: (text: string, url: string) => void;
  onClose: () => void;
  onRemove?: () => void;
};
/**
 * Validate a link address and collect display text before applying or removing a link.
 */
export default function LinkDialog({ initialText, initialUrl, onApply, onClose, onRemove }: Props) {
  const [text, setText] = useState(initialText);
  const [url, setUrl] = useState(initialUrl);
  const [error, setError] = useState("");
  return createPortal(
    <Popup isOpen onClose={onClose} title={onRemove ? "Edit link" : "Insert link"}>
      <form className="flex flex-col gap-2" onSubmit={(event) => {
        event.preventDefault();
        const normalized = normalizeLinkUrl(url);
        if (!normalized) { setError("Enter a valid web, email, or phone link."); return; }
        onApply(text, normalized);
      }}>
        <label className="popup popup-row">
          <span>Text</span>
          <input aria-label="Text to display" value={text} placeholder="Text to display" onChange={(event) => setText(event.target.value)}
            className="min-w-0 w-44 bg-transparent text-foreground outline-none focus:ring-1 focus:ring-accent rounded" />
        </label>
        <label className="popup popup-row">
          <span>Address</span>
          <input autoFocus aria-label="Link address" value={url} placeholder="https://example.com" onChange={(event) => { setUrl(event.target.value); setError(""); }}
            className="min-w-0 w-44 bg-transparent text-foreground outline-none focus:ring-1 focus:ring-accent rounded" />
        </label>
        {error && <p role="alert" className="text-sm px-1">{error}</p>}
        <div className="flex items-center justify-end gap-2 pt-1">
          {onRemove && <div className="mr-auto"><Button icon="material-symbols:link-off-rounded" tooltip="Remove link" action={onRemove} /></div>}
          <Button text="Cancel" action={onClose} extra="!text-base h-10 px-3" />
          <Button text="Apply" htmlType="submit" extra="btn-full !text-base w-24 h-10" />
        </div>
      </form>
    </Popup>, document.body,
  );
}
