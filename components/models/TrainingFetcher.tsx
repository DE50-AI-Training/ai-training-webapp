import { updateModelAtom } from "@/lib/atoms/modelAtoms";
import { trainingsAtom } from "@/lib/atoms/trainingAtoms";
import { Training } from "@/lib/models/training";
import { getModel, getTrainings } from "@/lib/services/models";
import { useAtom, useSetAtom } from "jotai";
import { useEffect, useState } from "react";

const TrainingFetcher = ({ delay }: { delay: number }) => {
    const [trainings, setTrainings] = useAtom(trainingsAtom);
    const count = Object.keys(trainings).length;
    const [loading, setLoading] = useState(true);
    const [, updateModel] = useAtom(updateModelAtom);

    const updateModelCache = (modelId: number) => {
        getModel(modelId).then((model) => {
            if (model) {
                updateModel(model);
            }
        });
    };

    useEffect(() => {
        const fetchTrainings = async () => {
            try {
                const newTrainings = await getTrainings();

                const trainingMap: Record<number, Training> =
                    newTrainings.reduce(
                        (acc: Record<number, Training>, training: Training) => {
                            acc[training.modelId] = training;
                            return acc;
                        },
                        {},
                    );
                Object.keys(trainings).forEach((modelId) => {
                    if (!trainingMap[Number(modelId)]) {
                        console.log(
                            `Training with modelId ${modelId} not found in new trainings`,
                        );
                        updateModelCache(Number(modelId));
                    }
                });

                setTrainings(trainingMap);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching trainings:", error);
                setLoading(false);
            }
        };

        fetchTrainings();
        if (count) {
            const intervalId = setInterval(fetchTrainings, delay);
            return () => clearInterval(intervalId);
        }
    }, [count]);

    return null;
};

export default TrainingFetcher;
