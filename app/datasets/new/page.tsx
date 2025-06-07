"use client";

import NewDatasetForm from "@/components/datasets/NewDatasetForm";
import PageContainer from "@/components/PageContainer";
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
        <PageContainer title="New Dataset">
            <NewDatasetForm fromDataset={datasetId} />
        </PageContainer>
    );
};

export default NewDatasetPage;
