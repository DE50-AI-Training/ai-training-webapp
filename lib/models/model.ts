import { MLPArchitecture, MLPArchitectureCreate } from "./architecture";

export type ProblemType = "classification" | "regression";

type ModelBase = {
    name: string;
    datasetId: number;
    inputColumns: number[];
    outputColumns: number[];
    problemType: ProblemType;
    trainingFraction: number;
};

export type Model = ModelBase & {
    id: number;
    mlpArchitecture?: MLPArchitecture;
    createdAt: string;
    lastBatchSize: number;
    lastMaxEpochs: number | null;
    lastLearningRate: number;
    trainingTime: number;
    epochsTrained: number;
};

export type ModelCreate = ModelBase & {
    mlpArchitecture?: MLPArchitectureCreate;
};

export type ModelUpdate = {
    name?: string;
};
