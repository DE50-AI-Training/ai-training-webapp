"use client";

import NewDatasetForm from "@/components/datasets/NewDatasetForm";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const NewDatasetPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const datasetIdParam = searchParams.get("fromDataset");

    const [datasetId, setDatasetId] = useState<number | null>(
        datasetIdParam ? Number(datasetIdParam) : null
    );

    useEffect(() => {
        if (datasetIdParam) {
            setDatasetId(Number(datasetIdParam));
            router.replace("/datasets/new");
        }
    }, [datasetIdParam, router]);

    return (
        <div className="bg-white rounded-xl ring-1 ring-gray-200 p-20 pt-6 pb-6">
            <NewDatasetForm fromDataset={datasetId} />
        </div>
    );
};

export default NewDatasetPage;
