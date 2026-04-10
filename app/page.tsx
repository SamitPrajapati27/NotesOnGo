import Image from "next/image";
import SearchBar from "@/src/Components/OTComps/NExplore/SearchBar";
import { ezCreateDDD } from "@/src/scripts/TypeFactories";
import { DropdownData } from "@/src/types/DropButton";
import DropButton from "@/src/Components/MTComps/DropButton";
import Toolbar from "@/src/Components/OTComps/Toolbar";
import TextEditor from "@/src/Components/OTComps/TextEditor";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="flex flex-col items-center justify-between">
        <Toolbar />
        <TextEditor />
      </section>
    </main>
  );
}