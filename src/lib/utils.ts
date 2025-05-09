import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIfHazmat = (dgItem: unknown): boolean => {
  if (typeof dgItem !== "string") return false;

  return !["--", "STANDARD", ""].includes(dgItem);
};
