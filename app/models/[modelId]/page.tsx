"use client";

import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { useAtomValue } from "jotai";

const Model = ({ params }: { params: { modelId: string } }) => {
    const models = useAtomValue(modelsAtom);
    const model = models.find((m) => m.id === Number(params.modelId));
    if (!model) {
        return <div>Model not found</div>;
    }

    return (
        <div className="flex w-full flex-col bg-white rounded-xl ring-1 ring-gray-200 p-20 pt-6 pb-6">
            Model: {model.name}
        </div>
    );
};

export default Model;
