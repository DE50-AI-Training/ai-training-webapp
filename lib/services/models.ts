import { BACKEND_URL } from "../env";
import { InferConfig, Model, ModelCreate, ModelUpdate } from "../models/model";
import { Training, TrainingStart } from "../models/training";

export const getModels = async (): Promise<Model[]> => {
    const response = await fetch(`${BACKEND_URL}/models`, {
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch models");
    }
    const data = await response.json();
    return data;
};

export const getModel = async (modelId: number): Promise<Model> => {
    const response = await fetch(`${BACKEND_URL}/models/${modelId}`, {
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch model");
    }
    const data = await response.json();
    return data;
};

export const downloadWeights = async (modelId: number) =>
    window.open(`${BACKEND_URL}/models/${modelId}/weights`, "_blank");

export const downloadArchitecture = async (modelId: number) =>
    window.open(`${BACKEND_URL}/models/${modelId}/architecture`, "_blank");

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

export const startTraining = async (
    modelId: number,
    trainingParams: TrainingStart,
): Promise<Training> => {
    const response = await fetch(`${BACKEND_URL}/models/${modelId}/train`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(trainingParams),
    });
    if (!response.ok) {
        throw new Error("Failed to start training");
    }
    const data = await response.json();
    return data;
};

export const stopTraining = async (modelId: number): Promise<void> => {
    const response = await fetch(`${BACKEND_URL}/models/${modelId}/stop`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });
    if (!response.ok) {
        throw new Error("Failed to stop training");
    }
    return;
};
export const inferModel = async (
    modelId: number,
    config: InferConfig,
    filename: string,
) => {
    const response = await fetch(`${BACKEND_URL}/models/${modelId}/infer`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
    });
    if (!response.ok) {
        throw new Error("Failed to infer model");
    }

    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
};

export const inferModelSingleInput = async (
    modelId: number,
    input: (string | number)[],
): Promise<string> => {
    console.log("Infer model with single input", modelId, input);
    const response = await fetch(
        `${BACKEND_URL}/models/${modelId}/infer-single`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(input),
        },
    );
    if (!response.ok) {
        throw new Error("Failed to infer model with single input");
    }
    const data = await response.json();
    return data.prediction;
};

export const getTrainings = async (): Promise<Training[]> => {
    const response = await fetch(`${BACKEND_URL}/models/trainings`, {
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch trainings");
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

export const deleteModel = async (modelId: number): Promise<void> => {
    const response = await fetch(`${BACKEND_URL}/models/${modelId}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error("Failed to delete model");
    }
    return;
};
