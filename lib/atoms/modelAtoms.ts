import { atom } from "jotai";
import { Model } from "../models/model";

// État global pour la liste des modèles
export const modelsAtom = atom<Model[]>([]);

// Atom d'écriture pour ajouter un nouveau modèle
export const addModelAtom = atom(null, (get, set, newModel: Model) => {
    const models = get(modelsAtom);
    set(modelsAtom, [...models, newModel]);
});

// Atom d'écriture pour mettre à jour un modèle existant
export const updateModelAtom = atom(null, (get, set, updatedModel: Model) => {
    const models = get(modelsAtom);
    const updatedModels = models.map((model) =>
        model.id === updatedModel.id ? updatedModel : model,
    );
    set(modelsAtom, updatedModels);
    return updatedModel;
});

// Atom d'écriture pour supprimer un modèle
export const removeModelAtom = atom(null, (get, set, modelId: number) => {
    const models = get(modelsAtom);
    set(
        modelsAtom,
        models.filter((model) => model.id !== modelId),
    );
});
