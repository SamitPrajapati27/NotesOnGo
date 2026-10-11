# Notes on Go

A browser-based rich-text notes app built with Next.js, React, TypeScript,
Tailwind CSS, and Slate.

## Run locally

Use Node.js 22.6+ and npm so both the application and the existing TypeScript-stripping test command can run. No database server, account, or environment variables are required for the current implementation.


```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000).

For a production server, run `npm run build` followed by `npm start`. The build downloads Google Fonts and needs network access.

## What the website does

Notes on Go is a personal writing workspace for creating and organizing notes directly in a browser. Write rich text with bold, italic, underline, three heading levels, bullet and numbered lists, task checkboxes, and links. The editor also shows a live word count and provides undo/redo through Slate History. Use the sidebar to manage notes, switch between light and dark themes, and open accent settings.

Notes stay in browser storage rather than a remote database. Export files to keep a portable copy or move notes to another browser.


## Multiple notes

Open the sidebar to create, switch, search, rename, or delete notes. Each note
keeps its own title and formatted document. Autosave starts enabled and can be
toggled beside Save and Export. With autosave off, edits stay in memory until
you press Save or re-enable autosave. Unsaved edits trigger a warning before
leaving the page. Reopening the app restores the last saved selected note.
The Save button can also retry a failed write. Successful manual saves briefly show
a checkmark on the Save button. A small dot indicates unsaved changes; save errors
remain visible above the editor. Deleting the last note creates a fresh blank document.

The editor font menu applies Default, Elegant (IBM Plex Serif), or Fun (Gamja
Flower) to the current note. Font choices are stored with each note.

Notes are stored in this browser's localStorage, under `notes-on-go:notes:v1`.
They are specific to the site's origin and browser profile; clearing browser
site data removes them. There is no account or cross-device sync. Storage
errors are shown above the editor. If another tab changes stored notes, a stale
tab refuses to overwrite them; copy its unsaved text before reloading.

Use Export to download the active note as Markdown (`.md`), plain text (`.txt`),
or JSON (`.json`). Markdown preserves headings, emphasis, lists, and checkboxes;
JSON includes the title, metadata, and full Slate document.

The same Import & Export popup includes an Import view. Select one or more
`.md`, `.txt`, or Notes on Go `.json` files, review the titles, and import them
as new notes. JSON exports preserve the full document; Markdown supports
headings, lists, tasks, emphasis, and links. Unsupported Markdown features
are kept as text. Imports never overwrite existing IDs. Files are limited to
1 MB each and 5 MB per batch; invalid batches add no notes.

Select text and use the toolbar link button or **⌘K / Ctrl+K** to insert a link.
With no selection, enter the display text as well as the address. Click a link
to edit or remove it; ⌘/Ctrl-click opens it in a new tab. Links persist with the
note and are included in Markdown and JSON exports.

Each note has a `/notes/[id]` address. Switching notes updates browser history
without leaving the workspace or losing in-memory drafts. Direct URLs and
reloads open that note, and Back/Forward switch notes. These URLs still use
this browser's local storage; they do not publish or sync notes. Missing IDs
show a recovery screen rather than silently opening a different note.

See [the implementation plan](docs/multiple-notes.md) for the storage model,
validation, and follow-up work.

## Checks

```sh
npm test              # Node 22.6+; uses experimental TypeScript stripping
npx tsc --noEmit
npm run lint
npm run build
```

The production build downloads Google Fonts and requires network access.

## UI controls

`Toggle` supports `size="sm"`, `size="md"` (default), and `size="lg"`.
Autosave uses the small 36 × 20px track; the thumb keeps a 2px inset at each size.
Note rows and New Note fill the sidebar, which scrolls independently on short screens.

Shared buttons use the original neutral surfaces and accent hover colors,
keyboard focus rings, and highlights for active formatting and open menus.
The sidebar slides in and out. Motion respects reduced-motion settings. Auto Save is vertically
centered beside Save and Export; successful manual saves show a brief checkmark
without adding visible status text or shifting the layout.

The layout was checked at 390 × 844 (mobile), 768 × 1024 (tablet), and
1440 × 900 (desktop), including note widths, title alignment, toolbar wrapping,
autosave alignment, Save feedback, and export controls.

## How the code works

1. `app/layout.tsx` provides global styles, metadata, and the two Google Fonts. Both `/` and `/notes/[id]` render the workspace in `app/page.tsx`.
2. `useNotes()` in `src/scripts/saving.ts` loads and validates the localStorage collection after mounting. It resolves the requested note ID and exposes create, select, edit, rename, delete, import, and save commands.
3. `TextEditor` creates a Slate editor enhanced with React, undo/redo history, and inline links. Document changes go back to `useNotes`; selection-only changes do not trigger document saves. Switching notes remounts the editor for that note.
4. Toolbar commands call Slate transformations in `engine.tsx` and `links.ts`. Slate renderers turn stored elements and text marks into the visible document.
5. Collection changes update memory first. With autosave enabled, each change attempts a localStorage write. A stored snapshot check prevents a stale tab from overwriting another tab’s edits.
6. Import converts supported files into validated notes with fresh IDs. Export serializes the active note and starts a browser download using a temporary Blob URL.

### Stored data

The storage value is a JSON object with `version: 1`, a `notes` array, and `activeNoteId`. Each note contains `id`, `title`, `data` (Slate document nodes), `createdAt`, `updatedAt`, and an optional `font`. Invalid stored data is left untouched; the app shows an error and keeps new changes in memory. Storage is origin-specific, so changing the hostname or port uses a different collection.

### Source map

| Location | Responsibility |
| --- | --- |
| `app/` | Next.js routes, root layout, global styles, and shared button styles |
| `src/Components/MTComps/` | Reusable buttons, dropdowns, switches, and modal shell |
| `src/Components/OTComps/` | Slate editor, toolbar, link dialog, and workspace utilities |
| `src/Components/OTComps/NExplore/` | Sidebar, title search, and editable note rows |
| `src/Components/Popups/` | Import/export, information, and settings content |
| `src/scripts/dataBase.ts` | Collection creation, validation, deletion, and conflict-checked persistence |
| `src/scripts/saving.ts` | React state, autosave, save feedback, and browser navigation |
| `src/scripts/engine.tsx`, `hotkeys.ts`, `links.ts` | Slate rendering, formatting, keyboard behavior, and link editing |
| `src/scripts/importing.ts`, `exporting.ts` | File conversion, validation, and downloads |
| `src/scripts/setup.tsx` | Dropdown configuration, popup/settings hooks, shortcuts, and word counts |
| `src/scripts/noteRoutes.ts`, `urls.ts`, `tooltips.ts` | Note paths, link normalization, and tooltip placement |
| `src/types/` | Shared component interfaces and Slate custom types |
| `public/` | Static image and icon assets |
| `tests/` | Local Node test suites; ignored by Git |

### Libraries and development tools

These are all direct packages declared in [package.json](package.json); versions below are the declared ranges. [package-lock.json](package-lock.json) records resolved versions and transitive dependencies. Iconify is declared in both dependency sections and is listed once here.

| Package | Declared version | Use |
| --- | --- | --- |
| [Next.js](https://nextjs.org/docs) | `^16.2.6` | App Router, development server, production build, and font loading |
| [React](https://react.dev/) | `19.2.4` | Components, state, effects, and hooks |
| [React DOM](https://react.dev/reference/react-dom) | `19.2.4` | Browser rendering and portals for tooltips/dialogs |
| [Slate](https://docs.slatejs.org/) | `^0.124.1` | Rich-text document model and editing transformations |
| [Slate React](https://docs.slatejs.org/libraries/slate-react) | `^0.124.2` | React bindings and editable surface |
| [Slate History](https://docs.slatejs.org/libraries/slate-history) | `^0.113.1` | Editor undo/redo history |
| [Marked](https://marked.js.org/) | `^18.1.0` | Markdown tokenization for imports |
| [Iconify React](https://iconify.design/docs/icon-components/react/) | `^6.0.2` | Toolbar and interface icons |
| [Tailwind CSS](https://tailwindcss.com/docs) | `^4` | Utility classes, theme styling, and responsive layout |
| [@tailwindcss/postcss](https://www.npmjs.com/package/@tailwindcss/postcss) | `^4` | Tailwind’s PostCSS build integration |
| [TypeScript](https://www.typescriptlang.org/docs/) | `^5` | Static types and compiler checks |
| [ESLint](https://eslint.org/docs/latest/) | `^9` | Source-code linting |
| [eslint-config-next](https://www.npmjs.com/package/eslint-config-next) | `16.2.1` | Next.js and React lint configuration |
| [@types/node](https://www.npmjs.com/package/@types/node) | `^20` | Node.js TypeScript definitions |
| [@types/react](https://www.npmjs.com/package/@types/react) | `^19` | React TypeScript definitions |
| [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) | `^19` | React DOM TypeScript definitions |

Editor fonts: [IBM Plex Serif](https://fonts.google.com/specimen/IBM+Plex+Serif) and [Gamja Flower](https://fonts.google.com/specimen/Gamja+Flower), loaded through `next/font/google`.

### Function documentation

Named functions, components, hooks, and handlers use JSDoc-style `/** ... */` summaries immediately before their declarations, similar to JavaDoc in NetBeans. Add `@param`, `@returns`, and `@throws` when they clarify a function’s contract; TypeScript already supplies parameter types. Keep inline comments for reasoning or non-obvious behavior rather than narrating every line.

### Current limitations

- There is no account system, backend notes database, cross-device sync, or public note sharing. Note URLs only identify data in the current browser.
- Theme and accent choices are session-only. The tooltip preference is present in settings but is not yet connected to the shared button tooltips.
- The toolbar updates indentation metadata, but the active renderer does not use the existing `BlockWrapper` that applies indentation and alignment.
- Markdown and plain-text exports cannot preserve every Slate property; use JSON for full note fidelity.
- `Save.tsx` and `Input-Textbox.tsx` are placeholders that currently render nothing.
- `/tests/` is ignored as requested. `npm test` requires those local files; a fresh clone will not receive untracked test files through Git.

## Contributors

- [Anish Thapa (@anish-Thapa4)](https://github.com/anish-Thapa4)
- [Samit Prajapati (@SamitPrajapati27)](https://github.com/SamitPrajapati27)
