import { useAtom, useAtomValue } from "jotai";
import { Training, TrainingStart } from "../models/training";
import { useState } from "react";
import { startTraining, stopTraining } from "../services/models";
import { Model } from "../models/model";
import { trainingsAtom, updateTrainingAtom } from "../atoms/trainingAtoms";

export const useTraining = (
    modelId: number,
): {
    train: (trainingParams: TrainingStart) => Promise<Training | null>;
    stop: () => Promise<void>;
    training: Training | null;
    isLoading: boolean;
    error: string | null;
} => {
    const trainings = useAtomValue(trainingsAtom);

    const [, updateTraining] = useAtom(updateTrainingAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const training: Training | null = trainings[modelId] ?? null;

    const train = async (trainingParams: TrainingStart) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await startTraining(modelId, trainingParams);
            if (data) {
                updateTraining({ modelId, training: data });
            }
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    const stop = async () => {
        setIsLoading(true);
        setError(null);
        try {
            await stopTraining(modelId);
            const newTraining: Training = { ...training, status: "stopping" };
            updateTraining({ modelId, training: newTraining });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        train,
        stop,
        training,
        isLoading,
        error,
    };
};
