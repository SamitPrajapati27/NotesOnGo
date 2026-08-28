import {ToggleObject } from "@/src/types/BasicTypes";

export default function Toggle({checked, action } : ToggleObject) {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox"  className="sr-only peer" checked={checked} onChange={action}/>
      <div className={`relative w-15 h-8 bg-zinc-300 peer-focus:outline-none peer-focus:ring-none
       peer-focus:ring-brand-soft dark:peer-focus:ring-brand-soft rounded-full peer peer-checked:after:translate-x-full
        rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[5px] after:start-[5px]
         after:bg-white after:rounded-full after:size-6 after:transition-all peer-checked:bg-accent`}></div>
    </label>
  );
}
