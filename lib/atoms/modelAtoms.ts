import { atom } from "jotai";
import { Model } from "../models/model";

export const modelsAtom = atom<Model[]>([]);

export const addModelAtom = atom(null, (get, set, newModel: Model) => {
    const models = get(modelsAtom);
    set(modelsAtom, [...models, newModel]);
});

export const removeModelAtom = atom(null, (get, set, modelId: string) => {
    const models = get(modelsAtom);
    set(
        modelsAtom,
        models.filter((model) => model.id !== modelId),
    );
});
