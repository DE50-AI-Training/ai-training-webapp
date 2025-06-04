"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Model } from "@/lib/models/model";
import ModelInformationCard from "./ModelInformationCard";
import UseModelCard from "./UseModelCard";
import { useTraining } from "@/lib/hooks/useTraining";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import {
    ArrowDownTrayIcon,
    DocumentDuplicateIcon,
    StopIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";

const ModelDetails = ({ model }: { model: Model }) => {
    const date = new Date(model.createdAt);

    const { training } = useTraining(model.id);
    const isTraining = training?.status === "training";

    return (
        <div className="flex w-full flex-col bg-white rounded-xl ring-1 ring-gray-200 p-20 pt-6 pb-6 gap-8">
            <p className="text-4xl font-bold text-center">
                "{model.name}" model details
            </p>
            {/* Top Buttons */}
            <Card className="flex justify-around items-center h-full w-full bg-[#fdfdfd] border border-gray-200 shadow-none py-4">
                <div className="text-center flex-1 mx-2">
                    <p className="text-xl font-semibold pb-2">Training</p>
                    <div className="flex flex-row justify-center gap-2">
                        <Button className="bg-gradient-to-r from-red-300 to-orange-200 pl-4 pr-6 border border-gray-400 text-black">
                            <StopIcon className="w-4 h-4" />
                            Stop training{" "}
                        </Button>
                        {/* {!isTraining && (
                            <Button className="bg-gradient-to-r  pl-4 pr-6 border border-gray-400 text-black">
                               Change paramters
                            </Button>
                        )} */}
                    </div>
                </div>
                <div className="text-center flex-1 mx-2">
                    <p className="text-xl font-semibold pb-2">Export model</p>
                    <div className="flex justify-center gap-2">
                        <Button className="bg-gray-300 pl-4 pr-6 border border-gray-400 text-black">
                            <ArrowDownTrayIcon className="w-4 h-4 " />
                            Weights{" "}
                        </Button>
                        <Button className="bg-gray-300 pl-4 pr-6 border border-gray-400 text-black">
                            <ArrowDownTrayIcon className="w-4 h-4 " />
                            Architecture{" "}
                        </Button>
                    </div>
                </div>
                <div className="text-center flex-1 mx-2">
                    <p className="text-xl font-semibold pb-2">Manage model</p>
                    <div className="flex justify-center gap-2">
                        <Button className="bg-gray-300 pl-4 pr-6 border border-gray-400 text-black">
                            <DocumentDuplicateIcon className="w-4 h-4" />
                            Duplicate{" "}
                        </Button>
                        <Button className="bg-gray-300 pl-4 pr-6 border border-gray-400 text-black">
                            <TrashIcon className="w-4 h-4" />
                            Delete{" "}
                        </Button>
                    </div>
                </div>
            </Card>

            {/* Main Grid */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Model Information */}
                <ModelInformationCard model={model} />
                <UseModelCard model={model} />
                {/* Try your model */}
            </div>
        </div>
    );
};

export default ModelDetails;
