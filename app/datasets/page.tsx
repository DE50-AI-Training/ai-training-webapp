"use client";

import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import { useAtomValue } from "jotai";

const Datasets = () => {
    const datasets = useAtomValue(datasetsAtom);

    return (
        <div className="rounded-t-2xl bg-white shadow-sm px-10 w-full h-screen">
            Datasets: {datasets.map((d) => d.name).join(", ")}
        </div>
    );
};

export default Datasets;
