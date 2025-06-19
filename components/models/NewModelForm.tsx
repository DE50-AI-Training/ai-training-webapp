"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

import { MLPLayersTable } from "./MLPLayersTable";
import { FormSection } from "./FormSection";
import { useAtomValue } from "jotai";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import FormSelect from "./FormSelect";
import MultipleSelector, { Option } from "../ui/MultipleSelector";
import { Model, ModelCreate, ProblemType } from "@/lib/models/model";
import { Input } from "../ui/Input";
import { Activation, ModelType } from "@/lib/models/architecture";
import { useRouter } from "next/navigation";
import { useCreateModel } from "@/lib/hooks/useCreateModel";
import { Slider } from "../ui/Slider";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/Tooltip";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";

const NewModelForm = ({
    fromDataset,
    fromModel,
}: {
    fromDataset: number | null;
    fromModel: Model | null;
}) => {
    const router = useRouter();
    const { create: createModel } = useCreateModel();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState("");
    const [problemType, setProblemType] =
        useState<ProblemType>("classification");
    const [datasetId, setdatasetId] = useState<number | null>(fromDataset);
    const [columnToClassify, setColumnToClassify] = useState<string>("");
    const [columnsAsParameters, setColumnsAsParameters] = useState<Option[]>(
        [],
    );
    const [selectedModel, setSelectedModel] = useState<ModelType>("MLP");
    const [layers, setLayers] = useState<number[]>([0, 8, 8, 0]); // [input, hidden1, hidden2, output]
    const [activationFunction, setActivationFunction] =
        useState<Activation>("relu");
    const [trainingFraction, setTrainingFraction] = useState(0.8);

    const datasets = useAtomValue(datasetsAtom);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!datasetId) {
            return;
        }
        setIsSubmitting(true);
        try {
            // Construction de l'objet modèle avec architecture conditionnelle
            const newModel: ModelCreate = {
                datasetId,
                inputColumns: columnsAsParameters.map((col) =>
                    Number(col.value),
                ),
                outputColumns: columnToClassify
                    ? [Number(columnToClassify)]
                    : [],
                name,
                problemType,
                mlpArchitecture:
                    selectedModel === "MLP"
                        ? {
                              activation: activationFunction,
                              layers,
                          }
                        : undefined,
                trainingFraction,
            };
            const model = await createModel(newModel);
            if (model) {
                router.push(`/models/${model.id}`);
            }
        } catch (error) {
            console.error("Error creating model:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const datasetOptions: Option[] = datasets.map((dataset) => ({
        label: dataset.name,
        value: dataset.id.toString(),
    }));

    const problemOptions: Option[] = [
        {
            label: "Classification",
            value: "classification",
        },
        {
            label: "Regression",
            value: "regression",
        },
    ];

    const activationOptions: Option[] = [
        { label: "ReLU", value: "relu" },
        { label: "Sigmoid", value: "sigmoid" },
        { label: "Tanh", value: "tanh" },
    ];

    const modelOptions: Option[] = [
        { label: "Multi-layer perceptron", value: "MLP" },
    ];

    const selectedDataset = datasets.find(
        (dataset) => dataset.id === datasetId,
    );

    const columnOptions: Option[] = selectedDataset
        ? selectedDataset.columns
              .map((column, index) => ({
                  value: index.toString(),
                  label: column.name,
              }))
              .filter((option, index) => {
                  const column = selectedDataset.columns[index];
                  const isTargetColumn = columnToClassify === option.value;
                  const isInParameters = columnsAsParameters.some(
                      (col) => col.value === option.value,
                  );
                  return (
                      column.type === "numeric" &&
                      !isTargetColumn &&
                      !isInParameters
                  );
              })
        : [];

    const targetColumnOptions: Option[] = selectedDataset
        ? selectedDataset.columns
              .map((column, index) => ({
                  value: index.toString(),
                  label: column.name,
              }))
              .filter((option) => {
                  const isInParameters = columnsAsParameters.some(
                      (col) => col.value === option.value,
                  );
                  return !isInParameters;
              })
        : [];

    useEffect(() => {
        if (problemType === "classification") {
            const selectedColumnIndex = columnToClassify
                ? Number(columnToClassify)
                : -1;

            const totalUniqueValues =
                selectedColumnIndex >= 0 &&
                selectedDataset?.columns?.[selectedColumnIndex]
                    ? selectedDataset.columns[selectedColumnIndex]
                          .uniqueValues || 0
                    : 0;

            setLayers((prev) => {
                const newLayers = [...prev];
                newLayers[newLayers.length - 1] = totalUniqueValues;
                return newLayers;
            });
        } else if (problemType === "regression") {
            setLayers((prev) => {
                const newLayers = [...prev];
                newLayers[newLayers.length - 1] = columnToClassify ? 1 : 0;
                return newLayers;
            });
        }
    }, [columnToClassify, problemType, selectedDataset?.columns]);

    // Set initial states if fromModel is provided
    useEffect(() => {
        if (fromModel) {
            setName(fromModel.name + " (copy)" || "");
            setProblemType(fromModel.problemType || "classification");
            setdatasetId(fromModel.datasetId || null);
            setTrainingFraction(fromModel.trainingFraction || 0.8);
            setColumnToClassify(
                fromModel.outputColumns.length > 0
                    ? fromModel.outputColumns[0].toString()
                    : "",
            );
            setColumnsAsParameters(
                fromModel.inputColumns.map((col) => ({
                    value: col.toString(),
                    label:
                        selectedDataset?.columns[col].name || `Column ${col}`,
                })),
            );
            if (fromModel.mlpArchitecture) {
                setSelectedModel("MLP");
                setLayers(fromModel.mlpArchitecture.layers || [0, 8, 8, 0]);
                setActivationFunction(
                    fromModel.mlpArchitecture.activation || "relu",
                );
            }
        }
    }, [fromModel, selectedDataset]);

    return (
        <div className="flex flex-col justify-center mx-auto max-w-3xl w-full">
            <form onSubmit={onSubmit} className="space-y-10">
                {/* Training data section */}
                <div className="space-y-3">
                    <FormSection
                        title="1. Select training data"
                        tooltipContent={
                            <p>
                                Choose the dataset that will be used to train
                                the model.
                            </p>
                        }
                    />
                    <FormSelect
                        value={datasetId?.toString() || ""}
                        onChange={(value) => setdatasetId(Number(value))}
                        options={datasetOptions}
                        placeholder="Training data"
                    />
                </div>

                {/* Problem type section */}
                {datasetId && (
                    <div className="space-y-3">
                        <FormSection
                            title="2. Select problem type"
                            tooltipContent={
                                <div>
                                    <p>Specify whether your task is:</p>
                                    <ul className="list-disc list-inside mt-1">
                                        <li>
                                            Classification: predict categories
                                        </li>
                                        <li>
                                            Regression: predict continuous
                                            values
                                        </li>
                                    </ul>
                                </div>
                            }
                        />
                        <FormSelect
                            value={problemType}
                            onChange={(value) =>
                                setProblemType(value as ProblemType)
                            }
                            options={problemOptions}
                            placeholder="Problem type"
                        />
                        {/* Commented select elements */}
                        <div className="relative flex gap-2 items-center max-w-sm mx-auto">
                            <Select
                                value={columnToClassify}
                                onValueChange={setColumnToClassify}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Target column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {targetColumnOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <InformationCircleIcon className="h-5 w-5 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Select the column that the model should
                                        learn to predict.
                                    </p>
                                    <p>This is usually your output or label.</p>
                                    <span className="block mt-2 font-bold text-violet-300">
                                        Need help?
                                    </span>{" "}
                                    Check our{" "}
                                    <a
                                        href="/guide"
                                        className="underline text-violet-300 hover:text-violet-500"
                                    >
                                        guide page
                                    </a>
                                    .
                                </TooltipContent>
                            </Tooltip>
                        </div>
                        <div className="relative flex gap-2 items-center max-w-sm mx-auto">
                            <MultipleSelector
                                options={columnOptions}
                                placeholder="Input columns"
                                onChange={(value) => {
                                    setColumnsAsParameters(value);
                                    setLayers((prev) => {
                                        const newLayers = [...prev];
                                        newLayers[0] = value.length;
                                        return newLayers;
                                    });
                                }}
                                value={columnsAsParameters}
                            />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <InformationCircleIcon className="h-5 w-5 cursor-pointer" />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>
                                        Select the columns that the model will
                                        use as input features to make
                                        predictions.
                                    </p>
                                    <span className="block mt-2 font-bold text-violet-300">
                                        Need help?
                                    </span>{" "}
                                    Check our{" "}
                                    <a
                                        href="/guide"
                                        className="underline text-violet-300 hover:text-violet-500"
                                    >
                                        guide page
                                    </a>
                                    .
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                )}

                {/* Architecture selection section */}
                {!!(
                    datasetId &&
                    columnToClassify &&
                    columnsAsParameters.length
                ) && (
                    <>
                        <div className="space-y-3 ">
                            <FormSection
                                title="3. Choose architecture"
                                tooltipContent={
                                    <p>
                                        Select the model architecture best
                                        suited for your problem.
                                    </p>
                                }
                            />
                            <FormSelect
                                value={selectedModel}
                                onChange={(value) =>
                                    setSelectedModel(value as ModelType)
                                }
                                options={modelOptions}
                                placeholder="Select model"
                            />
                        </div>

                        {/* MLP Layers table, only shown for perceptron model */}
                        {selectedModel === "MLP" && (
                            <MLPLayersTable
                                layers={layers}
                                setLayers={setLayers}
                            />
                        )}

                        {/* Activation function selection */}
                        <div className="space-y-3 ">
                            <FormSection
                                title="Activation function"
                                tooltipContent={
                                    <p>
                                        Choose the activation function which
                                        affects how neurons process inputs.
                                    </p>
                                }
                            />
                            <FormSelect
                                value={activationFunction}
                                onChange={(value) =>
                                    setActivationFunction(value as Activation)
                                }
                                options={activationOptions}
                                placeholder="Activation function"
                            />
                        </div>

                        {/* Choose testing fraction section */}
                        <div className="mx-auto space-y-3 max-w-sm">
                            <FormSection
                                title="4. Training data fraction"
                                tooltipContent={
                                    <div>
                                        <p>
                                            Set the fraction of the dataset to
                                            be used for training the model.
                                        </p>
                                        <p>
                                            The rest will be used for testing
                                            its performance.
                                        </p>
                                    </div>
                                }
                            />
                            <div className="flex items-center justify-center">
                                <Slider
                                    value={[trainingFraction]}
                                    onValueChange={(value) =>
                                        setTrainingFraction(value[0])
                                    }
                                    min={0.1}
                                    max={0.9}
                                    step={0.01}
                                />
                                <span className="ml-4">
                                    {Math.round(trainingFraction * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* Choose name section */}
                        <div className="mx-auto  space-y-3  max-w-sm">
                            <FormSection title="5. Model name" />
                            <Input
                                type="text"
                                placeholder="Model name"
                                className=""
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Submit button */}
                        <div className="flex justify-center space-y-3">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="outline"
                                className="w-[120px] bg-gradient-to-br from-violet-200 to-rose-100 text-black border border-gray-300 hover:brightness-95"
                            >
                                {isSubmitting ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    </>
                )}
            </form>
        </div>
    );
};

export default NewModelForm;
