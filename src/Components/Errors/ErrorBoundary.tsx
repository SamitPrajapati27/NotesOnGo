"use client";
import { Component, type ReactNode } from "react";
import { reportError } from "@/src/scripts/errors";

type Props = { children: ReactNode; label: string; recovery?: ReactNode };

/** Isolate rendering failures and let the user retry without reloading browser storage. */
export default class ErrorBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  /** Replace a broken subtree with recovery controls on the next render. */
  static getDerivedStateFromError() { return { failed: true }; }

  /** Route React rendering failures to the shared error popup. */
  componentDidCatch(error: Error) { reportError(error, `${this.props.label} error`); }

  /** Show recovery actions while preserving state outside this boundary. */
  render() {
    if (this.state.failed) return <section role="alert" className="p-4 space-y-3 border border-primary-border rounded-lg">
      <p>{this.props.label} could not be displayed. You can retry without reloading the page.</p>
      <p className="text-sm">Export your note before reloading if you have unsaved changes.</p>
      {this.props.recovery}
      <button type="button" className="btn btn-full" onClick={() => this.setState({ failed: false })}>Try again</button>
    </section>;
    return this.props.children;
  }
}
