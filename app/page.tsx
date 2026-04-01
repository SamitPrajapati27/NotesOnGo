"use client";
import Button from "@/src/Components/MTComps/Button";
import Image from "next/image";
import SearchBar from "@/src/Components/OTComps/NExplore/SearchBar";

export default function Home() {
  return (
    <div className="p-2">
      <Button 
        icon="material-symbols:heart-plus" 
        action={() => console.log("heart")} 
        type="normal" 
        tooltip="heart"/>
    </div>
  );
}

