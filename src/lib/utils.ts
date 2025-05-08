import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const checkIfHazmat = (dgItem: string) => {
  const isHazmat: boolean =
    dgItem !== "--" &&
    dgItem !== "STANDARD" &&
    dgItem !== "" &&
    dgItem !== null &&
    dgItem !== undefined;

  return isHazmat;
};
