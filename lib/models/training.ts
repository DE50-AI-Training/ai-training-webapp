export type TrainingStatus =
    | "starting"
    | "training"
    | "stopping"
    | "stopped"
    | "error";

export type TrainingBase = {
    batchSize: number;
    maxEpochs: number | null;
    learningRate: number;
};

export type TrainingStart = TrainingBase;

export type Training = TrainingBase & {
    epochs: number;
    sessionStart: string;
    trainingTimeAtStart: string;
    status: TrainingStatus;
    modelId: number;
    score: number | null;
};
