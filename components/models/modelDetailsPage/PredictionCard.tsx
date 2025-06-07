"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { FormSection } from "@/components/models/FormSection";
import { InferConfig, Model } from "@/lib/models/model";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/Tooltip";
import { uploadDataset } from "@/lib/services/dataset";
import { Dataset } from "@/lib/models/dataset";
import { useAtomValue } from "jotai";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import ColumnMappingTable from "./ColumnMappingTable";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { inferModel, inferModelSingleInput } from "@/lib/services/models";
import { ClipboardIcon } from "@heroicons/react/24/outline";

const UseModelCard = ({ model }: { model: Model }) => {
    const datasets = useAtomValue(datasetsAtom);
    const dataset = datasets.find((dataset) => dataset.id === model.datasetId);

    const [selectedMode, setSelectedMode] = useState<"import" | "write">(
        "import",
    );

    const [uploadedDataset, setUploadedDataset] = useState<Dataset | null>();

    // Store the selected uploadedDataset column for each dataset column
    const [selectedColumns, setSelectedColumns] = useState<
        Record<number, number | null>
    >({});

    // Store manual input values for each model column
    const [manualInputs, setManualInputs] = useState<Record<number, string>>(
        {},
    );

    const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const newDataset = await uploadDataset(file);
                setUploadedDataset(newDataset);

                // Automatically map columns with matching names
                const autoMapping: Record<number, number | null> = {};

                model.inputColumns.forEach((modelColumnIndex) => {
                    const modelColumn = dataset?.columns[modelColumnIndex];
                    if (modelColumn) {
                        // Find matching column in uploaded dataset by name and type
                        const matchingUploadedColumn =
                            newDataset.columns.findIndex(
                                (uploadedCol) =>
                                    uploadedCol.name.toLowerCase() ===
                                        modelColumn.name.toLowerCase() &&
                                    uploadedCol.type === modelColumn.type,
                            );

                        if (matchingUploadedColumn !== -1) {
                            autoMapping[modelColumnIndex] =
                                matchingUploadedColumn;
                        }
                    }
                });

                setSelectedColumns(autoMapping);
            } catch (error) {
                console.error("Error uploading dataset:", error);
            }
        }
    };

    const isDatasetValid =
        uploadedDataset &&
        uploadedDataset.columns.length > model.inputColumns.length;

    const handleColumnMapping = (
        modelColumnIndex: number,
        uploadedColumnIndex: string,
    ) => {
        setSelectedColumns((prev) => ({
            ...prev,
            [modelColumnIndex]:
                uploadedColumnIndex === "none"
                    ? null
                    : parseInt(uploadedColumnIndex),
        }));
    };

    // Check if all required columns are mapped
    const areAllColumnsMapped = () => {
        if (!uploadedDataset || model.inputColumns.length === 0) return false;

        return model.inputColumns.every(
            (columnIndex) =>
                selectedColumns[columnIndex] !== null &&
                selectedColumns[columnIndex] !== undefined,
        );
    };

    // Check if all manual inputs are filled
    const areAllManualInputsFilled = () => {
        return model.inputColumns.every(
            (columnIndex) =>
                manualInputs[columnIndex] &&
                manualInputs[columnIndex].trim() !== "",
        );
    };

    const handleManualInputChange = (columnIndex: number, value: string) => {
        setManualInputs((prev) => ({
            ...prev,
            [columnIndex]: value,
        }));
    };

    const [predictionResult, setPredictionResult] = useState<string | null>(
        null,
    );

    const copyToClipboard = () => {
        if (predictionResult) {
            navigator.clipboard.writeText(predictionResult);    
        }
    };

    if (!dataset) {
        return null;
    }

    return (
        <Card className="h-full w-full lg:w-2/3 bg-[#fdfdfd] border border-gray-200 shadow-none">
            <CardContent className="p-6 space-y-6">
                <h2 className="text-2xl font-semibold text-center">
                    Prediction
                </h2>
                <hr className="border-gray-200 my-3" />

                <div className="space-y-6">
                    <div>
                        <FormSection title="1. Choose your prediction input" />
                        <div className="flex justify-center gap-3 pt-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            selectedMode === "import"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            setSelectedMode("import")
                                        }
                                    >
                                        From a dataset
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Generate predictions based on a custom
                                    dataset
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            selectedMode === "write"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() => setSelectedMode("write")}
                                    >
                                        From manual input
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Generate a prediction from a single input
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <hr className="border-gray-200 my-3" />
                    {/* Conditional content depending on selection */}
                    {selectedMode === "import" && (
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <FormSection title="2. Upload dataset file" />
                                <div className="flex justify-center items-center flex-col">
                                    <Input
                                        type="file"
                                        className="max-w-xs"
                                        onChange={onUpload}
                                    />
                                </div>
                                {uploadedDataset && !isDatasetValid && (
                                    <p className="text-sm text-red-500 text-center">
                                        The uploaded dataset must have at least{" "}
                                        {model.inputColumns.length} columns to
                                        map to the model input.
                                    </p>
                                )}
                            </div>
                            {isDatasetValid && (
                                <>
                                    <hr className="border-gray-200 my-3" />

                                    <div className="flex flex-col align-center">
                                        <FormSection
                                            title="3. Map input columns"
                                            tooltipContent="Map the columns of your dataset to the columns of the model input."
                                        />
                                        <ColumnMappingTable
                                            model={model}
                                            dataset={dataset}
                                            uploadedDataset={uploadedDataset}
                                            selectedColumns={selectedColumns}
                                            onColumnMapping={
                                                handleColumnMapping
                                            }
                                        />
                                        <Button
                                            className="bg-gradient-to-br from-green-100 to-orange-100 text-black w-full max-w-[10rem] border border-gray-300 hover:brightness-95 mt-8 disabled:opacity-50 mx-auto"
                                            disabled={!areAllColumnsMapped()}
                                            onClick={() => {
                                                const inferConfig: InferConfig =
                                                    {
                                                        batch_size: 32,
                                                        dataset_id:
                                                            uploadedDataset?.id,
                                                    };
                                                inferModel(
                                                    model.id,
                                                    inferConfig,
                                                    "result.csv",
                                                );
                                            }}
                                        >
                                            Generate Result
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {selectedMode === "write" && (
                        <div className="space-y-6">
                            <FormSection
                                title="2. Write your own data"
                                tooltipContent="Enter your own data manually."
                            />
                            <div className="space-y-4">
                                {model.inputColumns.map((columnIndex) => {
                                    const column = dataset.columns[columnIndex];
                                    return (
                                        <div
                                            key={columnIndex}
                                            className="flex items-center space-x-4"
                                        >
                                            <label className="text-sm font-medium text-gray-700 min-w-[150px] text-right">
                                                {column.name} ({column.type}):
                                            </label>
                                            {column.type === "categorical" ? (
                                                <Select
                                                    value={
                                                        manualInputs[
                                                            columnIndex
                                                        ] || ""
                                                    }
                                                    onValueChange={(value) =>
                                                        handleManualInputChange(
                                                            columnIndex,
                                                            value,
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger className="flex-1 text-black font-medium">
                                                        <SelectValue
                                                            placeholder={`Select ${column.name.toLowerCase()}`}
                                                        />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {column.classes?.map(
                                                            (value) => (
                                                                <SelectItem
                                                                    key={value}
                                                                    value={
                                                                        value
                                                                    }
                                                                >
                                                                    {value}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Input
                                                    type="number"
                                                    placeholder={`Enter ${column.name.toLowerCase()}`}
                                                    value={
                                                        manualInputs[
                                                            columnIndex
                                                        ] || ""
                                                    }
                                                    onChange={(e) =>
                                                        handleManualInputChange(
                                                            columnIndex,
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="flex-1"
                                                />
                                            )}
                                        </div>
                                    );
                                })}

                                <div className="flex justify-center mt-8">
                                    <Button
                                        className="bg-gradient-to-br from-green-100 to-orange-100 text-black w-full max-w-[10rem] border border-gray-300 hover:brightness-95 disabled:opacity-50"
                                        disabled={!areAllManualInputsFilled()}
                                        onClick={async () => {
                                            const orderedInputs =
                                                model.inputColumns.map(
                                                    (columnIndex) => {
                                                        const value =
                                                            manualInputs[
                                                                columnIndex
                                                            ];
                                                        const column =
                                                            dataset.columns[
                                                                columnIndex
                                                            ];

                                                        // For categorical columns, return the string value
                                                        if (
                                                            column.type ===
                                                            "categorical"
                                                        ) {
                                                            return value;
                                                        }
                                                        // For numerical columns, parse as float
                                                        return parseFloat(
                                                            value,
                                                        );
                                                    },
                                                );

                                            const result =
                                                await inferModelSingleInput(
                                                    model.id,
                                                    orderedInputs,
                                                );
                                            setPredictionResult(
                                                result.toString(),
                                            );
                                        }}
                                    >
                                        Generate Result
                                    </Button>
                                </div>
                                    <div className="flex items-center space-x-3">
                                        <div className="px-4 py-2 bg-white border border-gray-300 rounded-md font-mono text-sm text-center mx-auto  h-9 ">
                                            {predictionResult}
                                            <ClipboardIcon
                                                className="inline-block w-4 h-4 ml-4 cursor-pointer"
                                                onClick={copyToClipboard}
                                            />
                                        </div>
                                    </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default UseModelCard;
