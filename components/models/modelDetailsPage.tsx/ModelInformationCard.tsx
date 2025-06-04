"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import { useTraining } from "@/lib/hooks/useTraining";
import { Model } from "@/lib/models/model";
import { TrainingStatus } from "@/lib/models/training";
import { useAtomValue } from "jotai";
import { trainingStatusFormat } from "@/lib/utils";

const ModelInformationCard = ({ model }: { model: Model }) => {
    const datasets = useAtomValue(datasetsAtom);
    const dataset = datasets.find((dataset) => dataset.id === model.datasetId);
    const layers = model.mlpArchitecture?.layers || [];
    const { stop, training } = useTraining(model.id);
    const trainingStatus = training?.status ?? "stopped";
    const { text: trainingStatusText, color: trainingStatusColor } =
        trainingStatusFormat(trainingStatus);
    
    console.log(trainingStatusColor)

    const networkType = model.mlpArchitecture ? "MLP" : "";
    const problemType =
        model.problemType === "classification"
            ? "Classification"
            : model.problemType === "regression"
              ? "Regression"
              : "Unknown";

    const inputLayer = layers[0] || 0;
    const hiddenLayers = layers.slice(1, -1).length || 0;
    const outputLayer = layers[layers.length - 1] || 0;
    const activation = model.mlpArchitecture?.activation


    return (
        <Card className="h-full w-full lg:w-1/3 bg-[#fdfdfd] border border-gray-200 shadow-none">
            <CardContent className="p-6 space-y-6">
                <h1 className="text-3xl font-semibold text-center">
                    Model Informations
                </h1>
                <hr className="border-gray-200 my-3" />
                <div className="space-y-1">
                    <h2 className="text-xl font-semibold mb-3">
                        Training Informations
                    </h2>
                    <div className="flex flex-row gap-2">
                        <strong>Model status:</strong>
                        <span className="inline-flex items-center">
                            {/* Indicateur de statut */}
                            <span
                                className={`inline-block w-4 h-4 ${trainingStatusColor} rounded-full mr-2`}
                            ></span>
                            {/* Texte de statut */}
                            <span className=" mr-0.5">
                                {trainingStatusText}
                            </span>
                        </span>
                    </div>
                    <div className="flex flex-row gap-2">
                        <strong>Accuracy:</strong>
                        <span>
                            Actual model accuracy: {training?.score?.toFixed(2)}{" "}
                            %
                        </span>
                    </div>
                </div>
                <hr className="border-gray-200 my-3" />
                <div className="space-y-1">
                    <p className="text-xl font-semibold mb-3">
                        Architecture Informations
                    </p>
                    <p>
                        <strong>Dataset:</strong> {dataset?.name}
                    </p>
                    <p>
                        <strong>Problem type:</strong> {problemType}
                    </p>
                    <p>
                        <strong>Activation:</strong> {activation}
                    </p>
                    <p>
                        <strong>Network type:</strong> {networkType}
                    </p>
                    <p>
                        <strong>Input layer:</strong> {inputLayer} neurons
                    </p>
                    <p>
                        <strong>Output layer:</strong> {outputLayer} neurons
                    </p>

                    <div className="flex flex-row items-center gap-2">
                        <p>
                            <strong>Hidden layers: </strong>
                        </p>
                        <div className="border border-gray-250 rounded-md p-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    {hiddenLayers} layers
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    {Array.from({
                                        length: hiddenLayers,
                                    }).map((_, i) => (
                                        <React.Fragment key={i}>
                                            <DropdownMenuItem>
                                                Layer {i + 1} : {layers[i + 1]}
                                            </DropdownMenuItem>
                                            {i < hiddenLayers - 1 && (
                                                <DropdownMenuSeparator />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ModelInformationCard;
