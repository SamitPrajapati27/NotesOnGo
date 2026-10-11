"use client";
import { shortcuts } from "@/src/scripts/setup";

const markdown = [
  ["**bold** or __bold__", "Bold"],
  ["*italic* or _italic_", "Italic"],
  ["***bold italic***", "Bold + italic"],
  ["# / ## / ### + Space", "Headings 1–3"],
  ["- / * / + + Space", "Bullet list"],
  ["1. + Space", "Numbered list"],
  ["[ ] / [x] + Space", "Task list"],
  ["[text](https://…)", "Link"],
];

export default function Info({ markdownShortcuts = true }: { markdownShortcuts?: boolean }) {
  return <div className="space-y-7">
    <section aria-labelledby="keyboard-guide">
      <h3 id="keyboard-guide" className="font-semibold mb-3">Hotkeys</h3>
      <div className="overflow-hidden rounded-xl border border-primary-border">
        <table className="w-full table-fixed text-left text-sm" aria-labelledby="keyboard-guide">
          <thead className="bg-secondary-bg text-muted-foreground">
            <tr><th scope="col" className="w-1/2 px-3 py-3 font-medium">Action</th><th scope="col" className="px-3 py-3 font-medium">Shortcut</th></tr>
          </thead>
          <tbody className="divide-y divide-primary-border">
            {shortcuts.map(item => <tr key={item.action}>
              <th scope="row" className="px-3 py-3 font-normal">{item.action}</th>
              <td className="px-3 py-3"><kbd style={{ fontFamily: "monospace" }} className="text-xs">{item.shortcut}</kbd></td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>
    <section aria-labelledby="markdown-guide">
      <div className="flex items-center justify-between gap-3">
        <h3 id="markdown-guide" className="font-semibold">Markdown Format</h3>
        <span className="rounded-full bg-accent/20 px-2.5 py-1 text-xs">{markdownShortcuts ? "Enabled" : "Disabled"}</span>
      </div>
      <p className="mt-2 mb-3 text-sm leading-relaxed text-muted-foreground">Complete paired markers to format text. For headings and lists, type a marker at the start of a line, then press Space.</p>
      <div className="overflow-hidden rounded-xl border border-primary-border">
        <table className="w-full table-fixed text-left text-sm" aria-labelledby="markdown-guide">
          <thead className="bg-secondary-bg text-muted-foreground">
            <tr><th scope="col" className="w-1/3 px-3 py-3 font-medium">Format</th><th scope="col" className="px-3 py-3 font-medium">What to type</th></tr>
          </thead>
          <tbody className="divide-y divide-primary-border">
            {markdown.map(([syntax, label]) => <tr key={label}>
              <th scope="row" className="px-3 py-3 font-normal">{label}</th>
              <td className="px-3 py-3 [overflow-wrap:anywhere]"><code style={{ fontFamily: "monospace" }} className="text-xs">{syntax}</code></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-muted-foreground">Undo restores the markers. Turn Markdown shortcuts off in Settings to keep them as text.</p>
    </section>
  </div>;
}
