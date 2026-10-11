import Spinner from "@/src/Components/MTComps/Spinner";
export default function Loading() {
  return (
    <main className="flex min-h-[80dvh] items-center justify-center">
      <Spinner label="Opening your notes…" />
    </main>
  );
}
