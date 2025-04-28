import { BACKEND_URL } from "../env";
import { Model } from "../models/model";

export const getModels = async (): Promise<Model[]> => {
    //fetch models from the backend
    const response = await fetch(`${BACKEND_URL}/models`);
    if (!response.ok) {
        throw new Error("Failed to fetch models");
    }
    const data = await response.json();
    console.log("Models fetched:", data);
    return data as Model[];
};
