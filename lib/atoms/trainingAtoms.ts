import { atom } from "jotai";
import { Training } from "../models/training";

export const trainingsAtom = atom<Record<number, Training>>({});

export const updateTrainingAtom = atom(
    null,
    (
        get,
        set,
        { modelId, training }: { modelId: number; training: Training },
    ) => {
        const trainings = get(trainingsAtom);
        set(trainingsAtom, { ...trainings, [modelId]: training });
    },
);
