"use client";

import NewModelForm from "@/components/models/NewModelForm";
import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { useAtomValue } from "jotai";
import { useSearchParams } from "next/navigation";

const NewModelPage = () => {
    const searchParams = useSearchParams();
    const datasetId = searchParams.get("fromDataset");
    const modelId = searchParams.get("fromModel");

    const models = useAtomValue(modelsAtom);
    const model = modelId ? models.find((m) => m.id === Number(modelId)) ?? null : null;

    return (
        <div className="bg-white rounded-xl ring-1 ring-gray-200 p-20 pt-6 pb-6">
            <NewModelForm
                fromDataset={datasetId && !modelId ? Number(datasetId) : null}
                fromModel={model}
            />
        </div>
    );
};

export default NewModelPage;
