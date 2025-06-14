"use client";

import DatasetCard from "@/components/datasetCard/DatasetCard";
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
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { useState } from "react";
import { modelsAtom } from "@/lib/atoms/modelAtoms";
import PageContainer from "@/components/PageContainer";

const Datasets = () => {
    const router = useRouter();
    const datasets = useAtomValue(datasetsAtom);
    const models = useAtomValue(modelsAtom);

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortOrder, setSortOrder] = useState<string>("newest");
    const [showUsedInModels, setShowUsedInModels] = useState<boolean>(false);

    const filteredDatasets = datasets
        .filter((dataset) => {
            if (
                showUsedInModels &&
                !models.some((model) => model.datasetId === dataset.id)
            )
                return false;
            if (
                searchQuery &&
                !dataset.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <PageContainer title="Datasets">
            <div className="flex justify-between items-center flex-col sm:flex-row mb-8">
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Select defaultValue="newest" onValueChange={setSortOrder}>
                        <SelectTrigger className=" w-[150px] text-black font-medium px-2">
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
                    <div className="pl-2 flex items-center space-x-2">
                        <Checkbox
                            id="runningModels"
                            checked={showUsedInModels}
                            onCheckedChange={(checked) => setShowUsedInModels(checked === true)}
                        />
                        <Label htmlFor="runningModels">
                            Only datasets used by a model
                        </Label>
                    </div>
                </div>
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Button
                        className="w-[120px] bg-gradient-to-br from-green-100 to-orange-100 text-black border border-gray-300 hover:brightness-95"
                        onClick={() => {
                            router.push("/datasets/new");
                        }}
                    >
                        New data +
                    </Button>
                </div>
            </div>

            <div className="flex gap-4 justify-center w-full flex-col sm:flex-row mb-4">
                <div className="flex justify-center w-full sm:w-auto">
                    <Input
                        placeholder="Search datasets..."
                        className="w-full max-w-[600px] min-w-[120px] md:w-[300px] lg:w-[400px]"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-4 gap-8 sm:grid-cols-8">
                {filteredDatasets.map((d) => (
                    <div className=" col-span-4" key={d.id}>
                        <DatasetCard key={d.id} dataset={d} />
                    </div>
                ))}
            </div>
        </PageContainer>
    );
};

export default Datasets;
