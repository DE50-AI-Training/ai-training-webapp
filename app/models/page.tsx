"use client";

import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { useAtomValue } from "jotai";

const Models = () => {
    const models = useAtomValue(modelsAtom);

    return (
        <div className="rounded-t-2xl bg-white shadow-sm px-10 w-full h-screen">
            Models: {models.map((m) => m.name).join(", ")}
        </div>
    );
};

export default Models;
