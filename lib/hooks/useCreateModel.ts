import { useState } from "react";
import { useAtom } from "jotai";
import { addModelAtom } from "../atoms/modelAtoms";
import { Model, ModelCreate } from "../models/model";
import { createModel } from "../services/models";

export const useCreateModel = () => {
    const [, addModel] = useAtom(addModelAtom);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const create = async (model: ModelCreate): Promise<Model | null> => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await createModel(model);
            if (data) {
                addModel(data);
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
