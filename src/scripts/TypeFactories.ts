import { DropdownData } from "../types/DropButton";

/**
 * This is for testing the types 
 * @param text 
 * @param icon 
 * @param action 
 * @returns 
 */
export function ezCreateDDD(text: string, icon: string): DropdownData {
  const newData: DropdownData = {
    text,
    icon,
  };

  return newData;
}