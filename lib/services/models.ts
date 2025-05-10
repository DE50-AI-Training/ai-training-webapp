import { BACKEND_URL } from "../env";
import { Model, ModelCreate, ModelUpdate } from "../models/model";

export const getModels = async (): Promise<Model[]> => {
    const response = await fetch(`${BACKEND_URL}/models`);
    if (!response.ok) {
        throw new Error("Failed to fetch models");
    }
    const data = await response.json();
    return data;
};

export const createModel = async (model: ModelCreate): Promise<Model> => {
    const response = await fetch(`${BACKEND_URL}/models`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
    });
    if (!response.ok) {
        throw new Error("Failed to create model");
    }
    const data = await response.json();
    return data;
};

export const updateModel = async (
    modelId: number,
    model: ModelUpdate,
): Promise<Model> => {
    const response = await fetch(`${BACKEND_URL}/models/${modelId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
    });
    if (!response.ok) {
        throw new Error("Failed to update model");
    }
    const data = await response.json();
    return data;
};
