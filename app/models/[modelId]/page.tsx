"use client";

import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { useAtomValue } from "jotai";

import React from "react";
import ModelDetails from "@/components/models/modelDetailsPage.tsx/ModelDetails";

const ModelDetailsPage = ({ params }: { params: { modelId: string } }) => {
    const models = useAtomValue(modelsAtom);
    const model = models.find((m) => m.id === Number(params.modelId));
    if (!model) {
        return <div>Model not found</div>;
    }

    return (
        <div>
            <ModelDetails model={model} />
        </div>
    );
};

export default ModelDetailsPage;
