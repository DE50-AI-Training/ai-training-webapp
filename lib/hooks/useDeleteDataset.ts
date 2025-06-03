import { useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { removeDatasetAtom } from "../atoms/datasetAtoms";
import { deleteDataset } from "../services/dataset";
import { modelsAtom } from "../atoms/modelAtoms";

export const useDeleteDataset = () => {
    const [, removeDataset] = useAtom(removeDatasetAtom);
    const setModels = useSetAtom(modelsAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteDatasetById = async (datasetId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteDataset(datasetId);
            removeDataset(datasetId);
            setModels((prevModels) =>
                prevModels.filter((model) => model.datasetId !== datasetId),
            );
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { delete: deleteDatasetById, isLoading, error };
};
