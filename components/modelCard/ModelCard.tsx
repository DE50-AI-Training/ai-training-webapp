import React from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Model } from "@/lib/models/model";
import { useAtomValue } from "jotai";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import {
    InformationCircleIcon,
    PlayIcon,
    StopIcon,
} from "@heroicons/react/24/outline";
import { useTraining } from "@/lib/hooks/useTraining";
import { TrainingStatus } from "@/lib/models/training";
import { Spinner } from "../ui/Spinner";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import TrainPopover from "./TrainPopover";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/Tooltip";

const ModelCard = ({ model }: { model: Model }) => {
    const datasets = useAtomValue(datasetsAtom);
    const dataset = datasets.find((dataset) => dataset.id === model.datasetId);
    const layers = model.mlpArchitecture?.layers || [];

    const networkType = model.mlpArchitecture ? "MLP" : "";
    const problemType =
        model.problemType === "classification" ? "Classification" : undefined;
    const inputLayer = layers[0] || 0;
    const hiddenLayers = layers.slice(1, -1).length || 0;
    const outputLayer = layers[layers.length - 1] || 0;
    const activation = "relu";

    const { stop, training } = useTraining(model.id);
    const trainingStatus = training?.status ?? "stopped";

    const TRAINING_STATUS_MAP: Record<
        TrainingStatus,
        { text: string; color: string }
    > = {
        stopped: { text: "Stopped", color: "bg-red-400" },
        starting: { text: "Starting", color: "bg-blue-400" },
        training: {
            text: `Training`,
            color: "bg-lime-400",
        },
        stopping: { text: "Stopping", color: "bg-yellow-400" },
        error: { text: "Error", color: "bg-red-400" },
    };

    const { text: trainingStatusText, color: trainingStatusColor } =
        TRAINING_STATUS_MAP[trainingStatus];

    const date = new Date(model.createdAt);
    const formattedDate = date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });

    return (
        // Conteneur principal de la carte md:w-full ->
        <div className="w-full mx-auto my-5 font-sans rounded-lg shadow-lg border border-gray-300 bg-gradient-to-br from-violet-200 to-rose-100">
            {/* En-tête */}
            <div className="mb-1 pb-2 pl-4 p-3 ">
                <a
                    className="text-xl font-bold text-gray-800 underline"
                    href={`/models/${model.id}`}
                >
                    {model.name}
                </a>
                <p className="text-[12px] text-gray-600">{formattedDate}</p>
            </div>

            {/* Contenu principal */}
            <div className="text-sm bg-gray-50 rounded-lg text-gray-700 border border-gray-300 space-y-2 mx-2 p-3 py-3 ">
                {/* Section 1: Dataset */}
                <div className="space-y-0">
                    {/* Espace entre les lignes de la section */}
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Dataset:
                        </strong>
                        {dataset?.name}
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Problem type:
                        </strong>
                        {problemType}
                    </p>
                </div>
                <hr className="border-gray-200 my-3" /> {/* Séparateur */}
                {/* Section 2: Network */}
                <div className="space-y-0">
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Network type:
                        </strong>
                        {networkType}
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Input layer:
                        </strong>
                        {inputLayer} neurons
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Hidden layers:
                        </strong>
                        {hiddenLayers} layers
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Output layer:
                        </strong>
                        {outputLayer} neurons
                    </p>
                </div>
                <hr className="border-gray-200 my-3" /> {/* Séparateur */}
                {/* Section 3: Training Params */}
                <div className="space-y-0">
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Activation:
                        </strong>
                        {activation}
                    </p>
                </div>
            </div>

            {/* Pied de page / Barre de statut */}
            <div className="mt-3 border-t border-gray-200 flex justify-between items-center bg-pink-50 rounded-b-lg p-1 px-2">
                <div className="flex items-center">
                    {/* Indicateur de statut */}
                    <span
                        className={`inline-block w-3.5 h-3.5 ${trainingStatusColor} rounded-full mr-2`}
                    ></span>
                    {/* Texte de statut */}
                    <span className="text-sm mr-0.5">{trainingStatusText}</span>
                    {trainingStatus !== "stopped" && (
                        <div className="flex flex-row text-sm mr-2 gap-2">
                            <Spinner className="w-3.5 h-3.5" />
                            <span>·</span>
                        </div>
                    )}
                    {training?.status === "training" && (
                        <div className="flex flex-row text-sm mr-1 items-center gap-2">
                            {` ${training?.epochs} / ${training?.maxEpochs} epochs `}
                        </div>
                    )}
                    {training?.status === "training" && (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <InformationCircleIcon className="h-4 w-4 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        {`Batch size: ${training?.batchSize}`}
                                    </p>
                                    <p>
                                        {`Epochs: ${training?.epochs} / ${training?.maxEpochs}`}
                                    </p>
                                    <p>
                                        {`Learning rate: ${training?.learningRate}`}
                                    </p>
                                    <p>
                                        {model.problemType === "classification"
                                            ? `Accuracy: ${training?.score?.toFixed(2) ?? "Not available"}`
                                            : `Mean Absolute Error: ${training?.score?.toFixed(2) ?? "Not available"}`}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    )}
                </div>

                {/* Bouton Stop */}
                {training ? (
                    <div
                        className="flex items-center space-x-0.5 cursor-pointer underline"
                        onClick={stop}
                    >
                        <a className="text-sm">Stop</a>
                        <StopIcon className="h-5 w-5  cursor-pointer" />
                    </div>
                ) : (
                    <Popover>
                        <PopoverTrigger className="flex items-center space-x-0.5 cursor-pointer underline">
                            <a className="text-sm">Train</a>
                            <PlayIcon className="h-5 w-5  cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent>
                            <TrainPopover model={model} />
                        </PopoverContent>
                    </Popover>
                )}
            </div>
        </div>
    );
};

export default ModelCard;
