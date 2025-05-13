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

const Models = () => {
    const models = useAtomValue(modelsAtom);

    return (
        <div className="flex w-full flex-col bg-white mt-10 rounded-lg ring-2 ring-gray-200 p-20 pt-6 pb-6">
            <div className="pb-10">
                <p className="text-center text-[35px] font-bold">Models</p>
            </div>
            <div className="flex justify-between items-center flex-col sm:flex-row mb-3">
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Select>
                        <SelectTrigger className="w-auto bg-gray-200 border border-black space-x-1 py-0 px-2">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">MLP</SelectItem>
                            <SelectItem value="dark">CNN</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-auto bg-gray-200 border border-black space-x-1 p-2">
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="mlp">MLP</SelectItem>
                            <SelectItem value="cnn">CNN</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="pl-2 flex items-center space-x-2">
                        <Checkbox id="runningModels" />
                        <Label htmlFor="runningModels">
                            Running models only
                        </Label>
                    </div>
                </div>
                <div className="flex gap-4 items-center flex-col sm:flex-row">
                    <Button className="w-[120px] bg-gray-200 border border-black text-black">
                        Manage
                    </Button>
                    <Button className="w-[120px] bg-gradient-to-br from-violet-200 to-rose-100 text-black border border-black">
                        New model +
                    </Button>
                </div>
            </div>
            <div className="grid grid-cols-4 gap-8 sm:grid-cols-8">
                {models.map((m) => (
                    <div className=" col-span-4" key={m.id}>
                        <ModelCard model={m} key={m.id} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Models;
