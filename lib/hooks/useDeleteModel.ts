import { useState } from "react";
import { useAtom } from "jotai";
import { removeModelAtom } from "../atoms/modelAtoms";
import { deleteModel } from "../services/models";

export const useDeleteModel = () => {
    const [, removeModel] = useAtom(removeModelAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteModelById = async (modelId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteModel(modelId);
            removeModel(modelId);
        } catch (err: any) {
            setError(err.message);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return { delete: deleteModelById, isLoading, error };
};
