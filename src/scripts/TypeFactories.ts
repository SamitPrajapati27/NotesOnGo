import { DropdownData } from "../types/DropButton";

/**
 * This is for testing the types 
 * @param text 
 * @param icon 
 * @pram tooltip
 * @param action 
 * @returns 
 */
export function ezCreateDDD(tooltip: string,icon?: string, text?: string): DropdownData {
  const newData: DropdownData = {
    text: text || tooltip,
    icon,
    tooltip
  };

  return newData;
}