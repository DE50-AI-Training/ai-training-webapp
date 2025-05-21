import { atom } from "jotai";
import { Model } from "../models/model";

export const modelsAtom = atom<Model[]>([]);

export const addModelAtom = atom(null, (get, set, newModel: Model) => {
    const models = get(modelsAtom);
    set(modelsAtom, [...models, newModel]);
});

export const updateModelAtom = atom(null, (get, set, updatedModel: Model) => {
    const models = get(modelsAtom);
    const updatedModels = models.map((model) =>
        model.id === updatedModel.id ? updatedModel : model,
    );
    set(modelsAtom, updatedModels);
    return updatedModel;
});

export const removeModelAtom = atom(null, (get, set, modelId: number) => {
    const models = get(modelsAtom);
    set(
        modelsAtom,
        models.filter((model) => model.id !== modelId),
    );
});
