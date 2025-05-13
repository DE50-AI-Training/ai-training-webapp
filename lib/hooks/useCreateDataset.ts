import { useState } from "react";
import { useAtom } from "jotai";
import { addDatasetAtom } from "../atoms/datasetAtoms";
import { Dataset, DatasetCreate } from "../models/dataset";
import { createDataset } from "../services/dataset";

export const useCreateDataset = () => {
    const [, addDataset] = useAtom(addDatasetAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (
        datasetId: number,
        dataset: DatasetCreate,
    ): Promise<Dataset | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await createDataset(datasetId, dataset);
            if (data) {
                addDataset(data);
            }
            return data;
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { create, isLoading, error };
};
