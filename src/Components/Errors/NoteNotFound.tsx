"use client";
import Link from "next/link";

export default function NoteNotFound({ onHome }: { onHome?: () => void }) {
  return (
    <main className="flex min-h-[80dvh] flex-col items-center justify-center gap-5 px-6 py-10 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/corvus-404.gif"
        alt="Corvus looking for a missing note"
        className="w-56 max-w-full rounded-2xl sm:w-72"
      />
      <div className="max-w-md space-y-3">
        <h1 className="text-3xl font-semibold sm:text-4xl">
         Note Not found
        </h1>
        <p className="text-muted-foreground">
          This note may have been deleted, or the link may belong to another
          browser. Return home to open your available notes.
        </p>
      </div>
      <Link
        href="/"
        className="btn btn-full px-6 py-3"
        onClick={(event) => {
          if (
            onHome &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey
          ) {
            event.preventDefault();
            onHome();
          }
        }}>
        Go Home
      </Link>
    </main>
  );
}
