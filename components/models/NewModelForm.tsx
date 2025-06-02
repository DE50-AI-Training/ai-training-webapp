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
    const [columnsToClassify, setColumnsToClassify] = useState<Option[]>([]);
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
            const newModel: ModelCreate = {
                datasetId,
                inputColumns: columnsAsParameters.map((col) =>
                    Number(col.value),
                ),
                outputColumns: columnsToClassify.map((col) =>
                    Number(col.value),
                ),
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
              .filter((option) => {
                  const isInClassify = columnsToClassify.some(
                      (col) => col.value === option.value,
                  );
                  const isInParameters = columnsAsParameters.some(
                      (col) => col.value === option.value,
                  );
                  return !isInClassify && !isInParameters;
              })
        : [];

    useEffect(() => {
        if (problemType === "classification") {
            const selectedColumnIndexes = columnsToClassify.map((col) =>
                Number(col.value),
            );

            const totalUniqueValues =
                selectedDataset?.columns?.reduce((acc, column, index) => {
                    if (selectedColumnIndexes.includes(index)) {
                        return acc + (column.uniqueValues    || 0);
                    }
                    return acc;
                }, 0) || 0;

            setLayers((prev) => {
                const newLayers = [...prev];
                newLayers[newLayers.length - 1] = totalUniqueValues;
                return newLayers;
            });
        } else if (problemType === "regression") {
            setLayers((prev) => {
                const newLayers = [...prev];
                newLayers[newLayers.length - 1] = columnsToClassify.length;
                return newLayers;
            });
        }
    }, [columnsToClassify, problemType, selectedDataset?.columns]);

    // Set initial states if fromModel is provided
    useEffect(() => {
        if (fromModel) {
            setName(fromModel.name + " (copy)" || "");
            setProblemType(fromModel.problemType || "classification");
            setdatasetId(fromModel.datasetId || null);
            setTrainingFraction(
                fromModel.trainingFraction || 0.8,
            );
            setColumnsToClassify(
                fromModel.outputColumns.map((col) => ({
                    value: col.toString(),
                    label: selectedDataset?.columns[col] || `Column ${col}`,
                })),
            );
            setColumnsAsParameters(
                fromModel.inputColumns.map((col) => ({
                    value: col.toString(),
                    label: selectedDataset?.columns[col] || `Column ${col}`,
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
        <div className="flex flex-col justify-center mx-auto py-10 max-w-3xl">
            <h1 className="text-2xl font-bold mb-8 text-center">New model</h1>
            <form onSubmit={onSubmit} className="space-y-10">
                {/* Training data section */}
                <div className="space-y-3">
                    <FormSection
                        title="1. Select training data"
                        tootipContent="Choose the dataset to use for training"
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
                            tootipContent="Choose the type of problem to solve"
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
                        <MultipleSelector
                            options={columnOptions}
                            placeholder="Target column(s)"
                            onChange={(value) => {
                                setColumnsToClassify(value);
                            }}
                            value={columnsToClassify}
                            className="w-1000² mx-auto"
                        />
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
                            className="w-sm mx-auto"
                        />
                    </div>
                )}

                {/* Architecture selection section */}
                {!!(
                    datasetId &&
                    columnsToClassify.length &&
                    columnsAsParameters.length
                ) && (
                    <>
                        <div className="space-y-3 ">
                            <FormSection
                                title="3. Choose architecture"
                                tootipContent="Choose the type of model to train"
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
                                tootipContent="Choose the activation function for the model"
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
                                tootipContent="Choose training fraction for the model"
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
                                className="px-8 py-2  font-semibold border border-gray-400  bg-gradient-to-r from-[#D97A7A77] to-[#A48DD377] rounded-md"
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
