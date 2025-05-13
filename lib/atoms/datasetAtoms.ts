import { atom } from "jotai";
import { Dataset } from "../models/dataset";

export const datasetsAtom = atom<Dataset[]>([]);

export const addDatasetAtom = atom(null, (get, set, newDataset: Dataset) => {
    const datasets = get(datasetsAtom);
    set(datasetsAtom, [...datasets, newDataset]);
});
