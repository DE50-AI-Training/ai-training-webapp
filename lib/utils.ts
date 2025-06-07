import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TrainingStatus } from "./models/training";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

