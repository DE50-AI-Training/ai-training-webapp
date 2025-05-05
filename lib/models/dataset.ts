type DatasetBase = {
    name: string;
};

export type Dataset = DatasetBase & {
    id: string;
};

export type DatasetCreate = DatasetBase;

export type DatasetUpdate = Partial<DatasetBase>;
