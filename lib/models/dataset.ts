export type DatasetType = "csv";

export type DatasetColumnTypeEnum = "numeric" | "categorical" | "image";

export type DatasetColumn = {
    name: string;
    type: DatasetColumnTypeEnum;
    uniqueValues: number;
    classes: string[] | null;
    nullCount: number;
};

type DatasetBase = {
    name: string;
};

export type Dataset = DatasetBase & {
    id: number;
    columns: DatasetColumn[];
    rowCount: number;
    createdAt: string;
    datasetType: DatasetType;
    originalFileName: string;
};

export type DatasetCreate = DatasetBase;

export type DatasetUpdate = Partial<DatasetBase>;
