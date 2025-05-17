export type TrainingBase = {
    batchSize: number;
    maxEpochs: number;
    learningRate: number;
};

export type TrainingStart = TrainingBase;

export type Training = TrainingBase & {
    totalEpochs: number;
    sessionStart: string;
    trainingTimeAtStart: string;
};
