"use client";
import Button from "@/src/Components/MTComps/Button";
import Image from "next/image";
import SearchBar from "@/src/Components/OTComps/NExplore/SearchBar";
import { ezCreateDDD } from "@/src/scripts/TypeFactories";
import { DropdownData } from "@/src/types/DropButton";
import DropButton from "@/src/Components/MTComps/DropButton";

export default function Home() {
  const icons = [
    ["material-symbols:format-list-bulleted-rounded","bullet"],
    ["material-symbols:format-list-numbered-rounded","number"],
    [ "material-symbols:checklist-rounded","checklist"]
  ];

  const dropdownList: DropdownData[] = icons.map((icon,) =>
    ezCreateDDD(icon[1], icon[0])
  );

  return (
    <div className="p-1 rounded-md border-zinc-200 border-2 size-fit mx-auto mt-2 flex justify-between">
      <Button
        icon="material-symbols:format-bold-rounded"
        action={() => console.log("Bold")}
        type="normal"
        tooltip="heart"
      />
      <Button
        icon="material-symbols:format-italic-rounded"
        action={() => console.log("Bold")}
        type="normal"
        tooltip="heart"
      />
      <Button
        icon="material-symbols:format-underlined-rounded"
        action={() => console.log("Bold")}
        type="last"
        tooltip="heart"
      />

      <DropButton
        icon = {icons[0][0]}
        tooltip = "lists"
        data = {dropdownList}
      />
    </div>
  );
}
