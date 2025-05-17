import { MLPArchitecture, MLPArchitectureCreate } from "./architecture";

export type ProblemType = "classification";

type ModelBase = {
    name: string;
    datasetId: number;
    inputColumns: number[];
    outputColumns: number[];
    problemType: ProblemType;
};

export type Model = ModelBase & {
    id: number;
    mlpArchitecture?: MLPArchitecture;
    createdAt: string;
};

export type ModelCreate = ModelBase & {
    mlpArchitecture?: MLPArchitectureCreate;
};

export type ModelUpdate = {
    name?: string;
};
