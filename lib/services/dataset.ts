import { BACKEND_URL } from "../env";
import { Dataset, DatasetCreate, DatasetUpdate } from "../models/dataset";

export const getDatasets = async (): Promise<Dataset[]> => {
    const response = await fetch(`${BACKEND_URL}/datasets`, {
        cache: "no-store",
    });
    if (!response.ok) {
        throw new Error("Failed to fetch datasets");
    }
    const data = await response.json();
    return data as Dataset[];
};

export const uploadDataset = async (file: File): Promise<Dataset> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${BACKEND_URL}/datasets`, {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        throw new Error("Failed to upload dataset");
    }

    const data = await response.json();
    return data as Dataset;
};

export const createDataset = async (
    datasetId: number,
    dataset: DatasetCreate,
): Promise<Dataset> => {
    const response = await fetch(`${BACKEND_URL}/datasets/${datasetId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataset),
    });
    if (!response.ok) {
        throw new Error("Failed to create dataset");
    }
    const data = await response.json();
    return data as Dataset;
};

export const updateDataset = async (
    datasetId: number,
    dataset: DatasetUpdate,
): Promise<Dataset> => {
    const response = await fetch(`${BACKEND_URL}/datasets/${datasetId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataset),
    });
    if (!response.ok) {
        throw new Error("Failed to update dataset");
    }
    const data = await response.json();
    return data as Dataset;
};
