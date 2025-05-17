export type Activation = "relu" | "sigmoid" | "tanh";

export type ModelType = "MLP" | "CNN" | "RNN";

type ArchitectureBase = { activation: Activation };

export type Architecture = ArchitectureBase & {
    id: number;
};

type MLPArchitectureBase = {
    layers: number[];
};

export type MLPArchitecture = Architecture & MLPArchitectureBase;

export type MLPArchitectureCreate = ArchitectureBase & MLPArchitectureBase;
