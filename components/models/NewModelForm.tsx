"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { MLPLayersTable } from "./MLPLayersTable";
import { FormSection } from "./FormSection";
import { useAtomValue } from "jotai";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import FormSelect from "./FormSelect";
import MultipleSelector, { Option } from "../ui/MultipleSelector";
import { ModelCreate } from "@/lib/models/model";
import { createModel } from "@/lib/services/models";
import { Input } from "../ui/Input";

enum ProblemType {
    CLASSIFICATION = "classification",
}

enum ModelType {
    MLP = "mlp",
}

const NewModelForm = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [name, setName] = useState("");
    const [problemType, setProblemType] = useState<ProblemType>(
        ProblemType.CLASSIFICATION,
    );
    const [datasetId, setdatasetId] = useState<number | null>(null);
    const [columnsToClassify, setColumnsToClassify] = useState<Option[]>([]);
    const [columnsAsParameters, setColumnsAsParameters] = useState<Option[]>(
        [],
    );
    const [selectedModel, setSelectedModel] = useState<ModelType>(
        ModelType.MLP,
    );
    const [layers, setLayers] = useState<number[]>([0, 8, 8, 0]); // [input, hidden1, hidden2, output]

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
                name: "New Model",
                mlpArchitecture:
                    selectedModel === ModelType.MLP
                        ? {
                              activationFunction: "relu",
                              layers,
                          }
                        : undefined,
            };
            createModel(newModel);
        } catch (error) {
            console.error("Error creating model:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const datasetOptions = datasets.map((dataset) => ({
        label: dataset.name,
        value: dataset.id.toString(),
    }));

    const problemOptions = [
        {
            label: "Classification",
            value: ProblemType.CLASSIFICATION,
        },
    ];

    const modelOptions = [
        { label: "Multi-layer perceptron", value: ModelType.MLP },
    ];

    const selectedDataset = datasets.find(
        (dataset) => dataset.id === datasetId,
    );

    const columnOptions = selectedDataset
        ? selectedDataset.columns
              .map((column, index) => ({
                  value: index.toString(),
                  label: column,
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

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-2xl font-bold mb-8 text-center">New model</h1>

            <Card className="max-w-3xl mx-auto">
                <CardContent className="pt-6">
                    <form onSubmit={onSubmit} className="space-y-10">
                        {/* 1. Training data section */}
                        <div className="space-y-3">
                            <FormSection
                                title="1. Select training data"
                                tootipContent="Choose the dataset to use for training"
                            />
                            <FormSelect
                                value={datasetId?.toString() || ""}
                                onChange={(value) =>
                                    setdatasetId(Number(value))
                                }
                                options={datasetOptions}
                                placeholder="Training data"
                            />
                        </div>

                        {/* 2. Problem type section */}
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
                                placeholder="Columns to be classified"
                                onChange={(value) => {
                                    setColumnsToClassify(value);
                                    setLayers((prev) => {
                                        const newLayers = [...prev];
                                        newLayers[newLayers.length - 1] =
                                            value.length;
                                        return newLayers;
                                    });
                                }}
                                value={columnsToClassify}
                            />
                            <MultipleSelector
                                options={columnOptions}
                                placeholder="Columns used as parameters"
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
                        </div>

                        {/* 3. Architecture selection section */}
                        <div className="space-y-3">
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
                        {selectedModel === ModelType.MLP && (
                            <MLPLayersTable
                                layers={layers}
                                setLayers={setLayers}
                            />
                        )}

                        {/* 4. Choose name section */}
                        <div className="space-y-3">
                            <FormSection title="4. Model name" />
                            <Input
                                type="text"
                                placeholder="Model name"
                                className=""
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        {/* Submit button */}
                        <div className="flex justify-center pb-4">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="outline"
                                className="relative px-8 py-2  font-semibold border border-gray-400  bg-gradient-to-r from-[#D97A7A77] to-[#A48DD377] rounded-md"
                            >
                                {isSubmitting ? "Creating..." : "Create"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default NewModelForm;
