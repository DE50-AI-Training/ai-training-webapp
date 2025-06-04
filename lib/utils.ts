import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { TrainingStatus } from "./models/training";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const trainingStatusFormat = (trainingStatus: TrainingStatus) => {
    const TRAINING_STATUS_MAP: Record<
        TrainingStatus,
        { text: string; color: string }
    > = {
        stopped: { text: "Stopped", color: "bg-red-400" },
        starting: { text: "Starting", color: "bg-blue-400" },
        training: {
            text: `Training`,
            color: "bg-lime-400",
        },
        stopping: { text: "Stopping", color: "bg-yellow-400" },
        error: { text: "Error", color: "bg-red-400" },
    };

    return TRAINING_STATUS_MAP[trainingStatus];
};
