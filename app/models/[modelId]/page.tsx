"use client";

import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { useAtomValue } from "jotai";

import React from "react";
import { useRouter } from "next/navigation";
import TrainingFetcher from "@/components/models/TrainingFetcher";
import PageContainer from "@/components/PageContainer";
import ActionBar from "@/components/models/modelDetailsPage/ActionBar";
import ModelInformationCard from "@/components/models/modelDetailsPage/ModelInformationCard";
import UseModelCard from "@/components/models/modelDetailsPage/PredictionCard";

const ModelDetailsPage = ({ params }: { params: { modelId: string } }) => {
    const router = useRouter();

    const models = useAtomValue(modelsAtom);
    const model = models.find((m) => m.id === Number(params.modelId));
    if (!model) {
        router.push(`/models`);
        return null;
    }

    return (
        <PageContainer title={`"${model.name}" model details`}>
            {/* Loading Indicator */}
            <TrainingFetcher delay={1000} />
            {/* Top Buttons */}
            <div className="mb-8">
                <ActionBar model={model} />
            </div>

            {/* Main Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Model Information */}
                <ModelInformationCard model={model} />
                <UseModelCard model={model} />
                {/* Try your model */}
            </div>
        </PageContainer>
    );
};

export default ModelDetailsPage;
