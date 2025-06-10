"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

import { Input } from "../ui/Input";
import { useRouter } from "next/navigation";
import {
    createDataset,
    duplicateDataset,
    uploadDataset,
} from "@/lib/services/dataset";
import { Dataset } from "@/lib/models/dataset";
import { FormSection } from "../models/FormSection";
import { useCreateDataset } from "@/lib/hooks/useCreateDataset";
import { DatasetInputTable } from "./DatasetInputTable";

const NewDatasetForm = ({ fromDataset }: { fromDataset: number | null }) => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { create: createDataset } = useCreateDataset();

    const [name, setName] = useState("");
    const [uploadedDataset, setUploadedDataset] = useState<Dataset | null>();

    useEffect(() => {
        if (fromDataset && !uploadedDataset) {
            // If coming from a dataset, fetch the dataset details only once
            const fetchDataset = async () => {
                try {
                    const dataset = await duplicateDataset(fromDataset);
                    if (dataset) {
                        setUploadedDataset(dataset);
                        setName(dataset.name);
                    }
                } catch (error) {
                    console.error("Error duplicating dataset:", error);
                }
            };
            fetchDataset();
        }
    }, [fromDataset, uploadedDataset]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (!uploadedDataset) {
                return;
            }
            const dataset = await createDataset(uploadedDataset.id, {
                name,
            });
            if (dataset) {
                router.push(`/datasets`);
            }
        } catch (error) {
            console.error("Error creating dataset:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col justify-center mx-auto py-10 max-w-3xl">
            <h1 className="text-2xl font-bold mb-8 text-center">New dataset</h1>
            <div className="flex justify-center space-y-10">
                <div className="mx-auto  space-y-3  max-w-sm">
                    <FormSection title="1. Upload dataset file" />
                    {!fromDataset && <Input
                        type="file"
                        placeholder="Upload dataset"
                        className=""
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                                try {
                                    const newDataset =
                                        await uploadDataset(file);
                                    setUploadedDataset(newDataset);
                                    setName(newDataset.name);
                                } catch (error) {
                                    console.error(
                                        "Error uploading dataset:",
                                        error,
                                    );
                                }
                            }
                        }}
                        accept=".csv, .xlsx, .xls"
                        required
                    />}
                    {fromDataset && (
                        <p className="text-sm text-gray-500">
                            You are duplicating an existing dataset. You can
                            modify the name and transformation.
                        </p>
                    )}
                </div>
            </div>
            {uploadedDataset && (
                <form onSubmit={onSubmit} className="mt-6 space-y-10">
                    <div className="mx-auto space-y-3 max-w-sm">
                        <FormSection title="2. Data transformation" />
                    </div>
                    <DatasetInputTable columns={uploadedDataset.columns} />
                    <div className="mx-auto space-y-3 max-w-sm">
                        <FormSection title="3. Dataset name" />
                        <Input
                            type="text"
                            placeholder="Dataset name"
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
                            className="w-[120px] bg-gradient-to-br from-green-100 to-orange-100 text-black border border-gray-300 hover:brightness-95"
                        >
                            {isSubmitting ? "Creating..." : "Create"}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default NewDatasetForm;
