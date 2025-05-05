export type ActivationFunction = "relu" | "sigmoid" | "tanh";

type ArchitectureBase = { inputSize: number; outputSize: number };

export type Architecture = ArchitectureBase & {
    id: string;
};

type MLPArchitectureBase = {
    activationFunction: ActivationFunction;
    layers: number;
};

export type MLPArchitecture = Architecture & MLPArchitectureBase;

export type MLPArchitectureCreate = ArchitectureBase & MLPArchitectureBase;
