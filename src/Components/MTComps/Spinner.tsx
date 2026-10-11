/** Accessible feedback for pending work, with a static reduced-motion fallback. */
export default function Spinner({ label = "Loading…", compact = false }: { label?: string; compact?: boolean }) {
  return <div role="status" aria-live="polite" className={`flex items-center justify-center gap-2 ${compact ? "py-2 text-sm" : "flex-col p-8"}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="/corvus-spinner.gif" alt="" className={`${compact ? "size-10" : "size-32"} object-contain motion-reduce:hidden`} />
    <span>{label}</span>
  </div>;
}
