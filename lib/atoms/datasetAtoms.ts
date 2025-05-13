import { atom } from "jotai";
import { Dataset } from "../models/dataset";

export const datasetsAtom = atom<Dataset[]>([]);
