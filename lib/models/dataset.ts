export type DatasetType = "csv";

type DatasetBase = {
    name: string;
};

export type Dataset = DatasetBase & {
    id: number;
    columns: string[];
    rowCount: number;
    uniqueValuesPerColumn: number[];
    createdAt: string;
    datasetType: DatasetType;
    originalFileName: string;
};

export type DatasetCreate = DatasetBase;

export type DatasetUpdate = Partial<DatasetBase>;
