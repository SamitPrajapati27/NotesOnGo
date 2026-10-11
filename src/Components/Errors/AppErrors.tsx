"use client";
import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import Popup from "../MTComps/Popup";
import ErrorBoundary from "./ErrorBoundary";
import { dismissError, getError, getServerError, reportError, subscribeErrors } from "@/src/scripts/errors";

/** Show reported failures, uncaught browser errors, and rejected promises in one modal. */
export default function AppErrors({ children }: { children: ReactNode }) {
  const error = useSyncExternalStore(subscribeErrors, getError, getServerError);
  useEffect(() => {
    /** Forward uncaught event-handler and asynchronous exceptions to the popup. */
    const onError = (event: ErrorEvent) => reportError(event.error || event.message);
    /** Forward rejected asynchronous work without suppressing developer diagnostics. */
    const onRejection = (event: PromiseRejectionEvent) => reportError(event.reason);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);
  return <>
    <ErrorBoundary label="Workspace">{children}</ErrorBoundary>
    <Popup isOpen={Boolean(error)} onClose={dismissError} title={error?.title || "Something went wrong"}>
      <p role="alert" className="whitespace-pre-wrap break-words text-sm">{error?.message}</p>
      <p className="mt-3 text-sm">Dismiss this message to return to your work. If saving failed, export your note before reloading.</p>
      <button type="button" className="btn btn-full mt-4" onClick={dismissError}>Dismiss</button>
    </Popup>
  </>;
}
