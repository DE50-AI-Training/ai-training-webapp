import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { Dataset } from "@/lib/models/dataset";
import { useAtomValue } from "jotai";
import React from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/Tooltip";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useDeleteDataset } from "@/lib/hooks/useDeleteDataset";
import { useRouter } from "next/navigation";

const DatasetCard = ({ dataset }: { dataset: Dataset }) => {
    const router = useRouter();

    const models = useAtomValue(modelsAtom);
    const modelsUsed = models.filter((model) => model.datasetId === dataset.id);
    const { delete: deleteDataset } = useDeleteDataset();

    const dataType = dataset.datasetType === "csv" ? "CSV" : "";
    const date = new Date(dataset.createdAt);
    const formattedDate = date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        // Conteneur principal de la carte md:w-full -> shadow-lg
        <div className="w-full mx-auto my-5 font-sans rounded-lg shadow-md border border-gray-300 bg-gradient-to-br from-green-100 to-orange-100">
            {/* En-tête */}
            <div className="mb-1 pb-2 pl-4 p-3 ">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">
                        {dataset.name}
                    </h2>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <EllipsisVerticalIcon className="h-6 w-6 text-gray-800 cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-48">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => {
                                    router.push(
                                        `/datasets/new?fromDataset=${dataset.id}`,
                                    );
                                }}
                            >
                                Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    if (
                                        confirm(
                                            "Are you sure you want to delete this dataset?\nYOU WILL LOOSE ALL MODELS ASSOCIATED WITH THIS DATASET!",
                                        )
                                    ) {
                                        deleteDataset(dataset.id);
                                    }
                                }}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                <p className="text-[12px] text-gray-600">{formattedDate}</p>
            </div>

            {/* Contenu principal */}
            <div className="text-sm bg-gray-50 rounded-lg text-gray-700 border border-gray-300 space-y-2 mx-2 p-3 py-3 ">
                {" "}
                {/* Ajoute de l'espace entre les sections */}
                {/* Section 1: Dataset */}
                <div className="space-y-0">
                    {" "}
                    {/* Espace entre les lignes de la section */}
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Data Type:
                        </strong>
                        {dataType}
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Original file:
                        </strong>
                        {dataset.originalFileName}
                    </p>
                </div>
                <hr className="border-gray-200 my-3" /> {/* Séparateur */}
                {/* Section 2: Network */}
                <div className="space-y-0">
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Row count:
                        </strong>
                        {dataset.rowCount}
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Column count:
                        </strong>
                        {dataset.columns.length}
                    </p>
                </div>
            </div>

            {/* Pied de page / Barre de statut */}
            <div className="mt-3 border-t border-gray-200 flex justify-between items-center bg-gray-50 rounded-b-lg p-1 px-2">
                <div className="flex items-center">
                    {/* Texte de statut */}
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <span className="underline text-[13px]">
                                    Used in {modelsUsed.length} models
                                </span>
                            </TooltipTrigger>
                            <TooltipContent className="p-2">
                                <ul className="text-md">
                                    {modelsUsed.map((model) => (
                                        <li key={model.id}>
                                            -{" "}
                                            <a
                                                className="underline"
                                                href={`/models/${model.id}`}
                                            >
                                                {model.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>

                <div className="flex items-center space-x-2">
                    <a
                        className="underline text-[13px]"
                        href={`/models/new?fromDataset=${dataset.id}`}
                    >
                        Create model from data
                    </a>
                </div>
            </div>
        </div>
    );
};

export default DatasetCard;
