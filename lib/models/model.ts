import { MLPArchitecture } from "./architecture";

export type Model = {
    id: string;
    name: string;
    datasetId: string;
    mlpArchitecture?: MLPArchitecture;
};
