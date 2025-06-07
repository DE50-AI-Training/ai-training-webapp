"use client";

import NewModelForm from "@/components/models/NewModelForm";
import PageContainer from "@/components/PageContainer";
import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { useAtomValue } from "jotai";
import { useSearchParams } from "next/navigation";

const NewModelPage = () => {
    const searchParams = useSearchParams();
    const datasetId = searchParams.get("fromDataset");
    const modelId = searchParams.get("fromModel");

    const models = useAtomValue(modelsAtom);
    const model = modelId
        ? (models.find((m) => m.id === Number(modelId)) ?? null)
        : null;

    return (
        <PageContainer title="New Model">

            <NewModelForm
                fromDataset={datasetId && !modelId ? Number(datasetId) : null}
                fromModel={model}
            />
        </PageContainer>
    );
};

export default NewModelPage;
