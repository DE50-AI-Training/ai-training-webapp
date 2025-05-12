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
        <div className="rounded-t-2xl bg-white shadow-sm px-10 w-full">
            Model: {model.name}
        </div>
    );
};

export default Model;
