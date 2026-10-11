export type AppError = { id: number; title: string; message: string };
let current: AppError | null = null;
let nextId = 0;
const listeners = new Set<() => void>();

/** Publish a recoverable failure without logging note contents or stack traces in the UI. */
export function reportError(cause: unknown, title = "Something went wrong") {
  const message = cause instanceof Error ? cause.message
    : typeof cause === "string" ? cause : "An unexpected error occurred. Please try the action again.";
  if (current?.title === title && current.message === message) return;
  current = { id: ++nextId, title, message };
  listeners.forEach((listener) => listener());
}

/** Dismiss the visible error without changing notes or retrying a failed action. */
export function dismissError() {
  current = null;
  listeners.forEach((listener) => listener());
}

/** Subscribe React to reported errors, including errors raised before the popup mounts. */
export function subscribeErrors(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

/** Return the stable current error snapshot for useSyncExternalStore. */
export function getError() { return current; }

/** Keep server-rendered pages free of browser-session error state. */
export function getServerError() { return null; }
