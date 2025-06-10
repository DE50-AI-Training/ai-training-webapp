"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import clsx from "clsx";

import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import { useTraining } from "@/lib/hooks/useTraining";
import { Model } from "@/lib/models/model";
import { useAtomValue } from "jotai";
import { TrainingStatus } from "@/lib/models/training";
import { FormSection } from "../FormSection";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/Tooltip";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { MLPLayersTable } from "../MLPLayersTable";
import { Spinner } from "@/components/ui/Spinner";

const ModelInformationCard = ({ model }: { model: Model }) => {
    const datasets = useAtomValue(datasetsAtom);
    const dataset = datasets.find((dataset) => dataset.id === model.datasetId);
    const layers = model.mlpArchitecture?.layers || [];
    const { stop, training } = useTraining(model.id);

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

    const trainingStatus = training?.status ?? "stopped";

    const { text: trainingStatusText, color: trainingStatusColor } =
        TRAINING_STATUS_MAP[trainingStatus];

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
    const activation = model.mlpArchitecture?.activation;

    return (
        <Card className="h-full w-full lg:w-1/3 bg-[#fdfdfd] border border-gray-200 shadow-none">
            <CardContent className="p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-center">
                    Model informations
                </h1>
                <hr className="border-gray-200 my-3" />
                <div className="space-y-1 text-sm">
                    <h2 className="text-lg font-medium mb-3">
                        Training informations
                    </h2>
                    {/* <FormSection title="Training informations" /> */}
                    <div className="flex items-center">
                        <strong className="mr-2">Model status:</strong>
                        <span
                            className={clsx(
                                "inline-block w-3.5 h-3.5 rounded-full mr-2",
                                trainingStatusColor,
                            )}
                        ></span>
                        <span>{trainingStatusText}</span>
                        {trainingStatus !== "stopped" && (
                            <Spinner className="w-3.5 h-3.5 ml-1" />
                        )}
                    </div>
                    {model.problemType === "classification" && (
                        <p>
                            <strong>Accuracy:</strong>{" "}
                            {training?.accuracy
                                ? `${training.accuracy.toFixed(2)}`
                                : "Not available"}
                        </p>
                    )}
                    {model.problemType === "regression" && (
                        <p>
                            <strong>Mean Absolute Error:</strong>{" "}
                            {training?.avgAbsError
                                ? `${training.avgAbsError.toFixed(2)}`
                                : "Not available"}
                        </p>
                    )}
                    <p>
                        <strong>Epochs trained:</strong>{" "}
                        {model.epochsTrained + (training?.epochs || 0)}{" "}
                        {training && `(${training.epochs} this session)`}
                    </p>
                    {training && (
                        <p>
                            <strong>Batch size:</strong> {training.batchSize}
                        </p>
                    )}
                    {training && (
                        <p>
                            <strong>Learning rate:</strong>{" "}
                            {training.learningRate}
                        </p>
                    )}
                </div>
                <hr className="border-gray-200 my-3" />
                <div className="space-y-1 text-sm">
                    <p className="text-lg font-medium mb-3">
                        Architecture informations
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
                        <strong>Input columns:</strong>{" "}
                        {model.inputColumns.length} columns
                    </p>
                    <p>
                        <strong>Output columns:</strong>{" "}
                        {model.outputColumns.length} columns
                    </p>

                    <div className="flex flex-row items-center gap-2">
                        <p>
                            <strong>Hidden layers: </strong>
                        </p>

                        <Dialog>
                            <DialogTrigger asChild>
                                <span className="underline cursor-pointer">
                                    {hiddenLayers} layers
                                </span>
                            </DialogTrigger>
                            <DialogContent className="bg-white max-w-xl">
                                <DialogHeader>
                                    <DialogTitle>
                                        "{model.name}" layers
                                    </DialogTitle>
                                </DialogHeader>
                                <div className="overflow-auto">
                                    <MLPLayersTable
                                        layers={layers}
                                    ></MLPLayersTable>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default ModelInformationCard;
