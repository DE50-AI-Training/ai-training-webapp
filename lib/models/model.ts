import { MLPArchitecture, MLPArchitectureCreate } from "./architecture";

type ModelBase = {
    name: string;
    datasetId: string;
};

export type Model = ModelBase & {
    id: number;
    mlpArchitecture?: MLPArchitecture;
};

export type ModelCreate = ModelBase & {
    mlpArchitecture?: MLPArchitectureCreate;
};

export type ModelUpdate = {
    name?: string;
};
