export type ActivationFunction = "relu" | "sigmoid" | "tanh";

type ArchitectureBase = {};

export type Architecture = ArchitectureBase & {
    id: number;
};

type MLPArchitectureBase = {
    activationFunction: ActivationFunction;
    layers: number[];
};

export type MLPArchitecture = Architecture & MLPArchitectureBase;

export type MLPArchitectureCreate = ArchitectureBase & MLPArchitectureBase;
