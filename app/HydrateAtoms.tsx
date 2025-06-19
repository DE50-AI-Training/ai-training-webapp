"use client";

import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { Dataset } from "@/lib/models/dataset";
import { Model } from "@/lib/models/model";
import { useHydrateAtoms } from "jotai/utils";
import { ReactNode } from "react";

const HydrateAtoms = ({
    initialModels,
    initialDatasets,
    children,
}: {
    initialModels: Model[];
    initialDatasets: Dataset[];
    children: ReactNode;
}) => {
    useHydrateAtoms([
        [modelsAtom, initialModels],
        [datasetsAtom, initialDatasets],
    ]);
    return <>{children}</>;
};

export default HydrateAtoms;
