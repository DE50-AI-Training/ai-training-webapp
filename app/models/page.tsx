"use client";

import ModelCard from "@/components/modelCard/ModelCard";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Button } from "@/components/ui/Button";
import { useAtomValue } from "jotai";
import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { useRouter } from "next/navigation";
import TrainingFetcher from "@/components/models/TrainingFetcher";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import DatasetPopover from "@/components/datasets/DatasetPopover";
import { trainingsAtom } from "@/lib/atoms/trainingAtoms";
import PageContainer from "@/components/PageContainer";

const Models = () => {
    const router = useRouter();
    const models = useAtomValue(modelsAtom);
    const training = useAtomValue(trainingsAtom);

    const [selectedDatasetId, setSelectedDatasetId] = useState<number | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("newest");
    const [problemType, setProblemType] = useState<string | null>(null);
    const [showRunningModels, setShowRunningModels] = useState<boolean>(false);

    const filteredModels = models
        .filter((model) => {
            if (
                selectedDatasetId !== null &&
                model.datasetId !== selectedDatasetId
            )
                return false;
            if (
                problemType &&
                problemType !== "none" &&
                model.problemType !== problemType
            )
                return false;
            if (showRunningModels && !training[model.id]) return false;
            if (
                searchQuery &&
                !model.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
                return false;
            return true;
        })
        .sort((a, b) => {
            if (sortOrder === "newest")
                return (
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                );
            if (sortOrder === "oldest")
                return (
                    new Date(a.createdAt).getTime() -
                    new Date(b.createdAt).getTime()
                );
            if (sortOrder === "title") return a.name.localeCompare(b.name);
            return 0;
        });

    return (
        <PageContainer title="Models">
            <TrainingFetcher delay={1000} />
            <div className="flex justify-between items-center flex-col sm:flex-row mb-8">
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Select defaultValue="newest" onValueChange={setSortOrder}>
                        <SelectTrigger className="w-[150px] text-black font-medium px-2">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">
                                Date (Newest)
                            </SelectItem>
                            <SelectItem value="oldest">
                                Date (Oldest)
                            </SelectItem>
                            <SelectItem value="title">Title (A-Z)</SelectItem>
                        </SelectContent>
                    </Select>
                    <DatasetPopover
                        selectedDatasetId={selectedDatasetId}
                        setSelectedDatasetId={setSelectedDatasetId}
                    />
                    <Select defaultValue="none" onValueChange={setProblemType}>
                        <SelectTrigger className="w-[150px] text-black font-medium px-2">
                            <SelectValue placeholder="Problem type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="none" className="text-gray-500">
                                Problem type
                            </SelectItem>
                            <SelectItem value="classification">
                                Classification
                            </SelectItem>
                            <SelectItem value="regression">
                                Regression
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="pl-2 flex items-center space-x-2">
                        <Checkbox
                            id="runningModels"
                            checked={showRunningModels}
                            onCheckedChange={setShowRunningModels}
                        />
                        <Label htmlFor="runningModels">
                            Running models only
                        </Label>
                    </div>
                </div>

                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Button
                        className="w-[120px] bg-gradient-to-br from-violet-200 to-rose-100 text-black border border-gray-300 hover:brightness-95"
                        onClick={() => {
                            router.push("/models/new");
                        }}
                    >
                        New model +
                    </Button>
                </div>
            </div>
            <div className="flex gap-4 justify-center w-full flex-col sm:flex-row mb-4">
                <div className="flex justify-center w-full sm:w-auto">
                    <Input
                        placeholder="Search models..."
                        className="w-full max-w-[600px] min-w-[120px] md:w-[300px] lg:w-[400px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-8 sm:grid-cols-8">
                {filteredModels.map((m) => (
                    <div className=" col-span-4" key={m.id}>
                        <ModelCard model={m} key={m.id} />
                    </div>
                ))}
            </div>
        </PageContainer>
    );
};

export default Models;
