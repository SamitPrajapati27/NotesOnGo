"use client";

import Image from "next/image";
import SearchBar from "@/src/Components/OTComps/NExplore/SearchBar";

export default function Home() {
  return (
    <div className="p-8">
      <h1>Notes to Go</h1>
        <SearchBar onSearch={(q) => console.log(q)} />
    </div>
  );
}

