export type ActivationFunction = "relu" | "sigmoid" | "tanh";

type ArchitectureBase = { inputSize: number; outputSize: number };

export type Architecture = ArchitectureBase & {
    id: string;
};

export type MLPArchitecture = ArchitectureBase & {
    activationFunction: ActivationFunction;
    layers: number;
};
