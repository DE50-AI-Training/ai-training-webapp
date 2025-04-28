type DatasetBase = {
    name: string;
};

type Dataset = DatasetBase & {
    id: string;
    createdAt: string;
};
