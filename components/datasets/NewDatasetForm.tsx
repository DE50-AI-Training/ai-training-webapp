"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

import { Input } from "../ui/Input";
import { useRouter } from "next/navigation";
import { createDataset, uploadDataset } from "@/lib/services/dataset";
import { Dataset } from "@/lib/models/dataset";
import { FormSection } from "../models/FormSection";
import { useCreateDataset } from "@/lib/hooks/useCreateDataset";

const NewDatasetForm = () => {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { create: createDataset } = useCreateDataset();

    const [name, setName] = useState("");
    const [uploadedDataset, setUploadedDataset] = useState<Dataset | null>();

    const onSubmit = async (e: React.FormEvent) => {
        setIsSubmitting(true);
        try {
            e.preventDefault();
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
                    <Input
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
                    />
                </div>
            </div>
            {uploadedDataset && (
                <form onSubmit={onSubmit} className="mt-6 space-y-3">
                    <div className="mx-auto space-y-3 max-w-sm">
                        <FormSection title="2. Data transformation" />
                        Coming soon...
                    </div>
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
                            className="px-8 py-2  font-semibold border border-gray-400  bg-gradient-to-r from-[#D97A7A77] to-[#A48DD377] rounded-md"
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
