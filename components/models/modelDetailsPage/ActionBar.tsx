import React from "react";
import { Button } from "@/components/ui/Button";
import { Model } from "@/lib/models/model";
import { useTraining } from "@/lib/hooks/useTraining";
import {
    ArrowDownTrayIcon,
    DocumentDuplicateIcon,
    PlayIcon,
    StopIcon,
    TrashIcon,
} from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { useRouter } from "next/navigation";
import { useDeleteModel } from "@/lib/hooks/useDeleteModel";
import { downloadArchitecture, downloadWeights } from "@/lib/services/models";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover";
import TrainPopover from "@/components/models/modelCard/TrainPopover";

const ActionBar = ({ model }: { model: Model }) => {
    const router = useRouter();
    const { delete: deleteModel } = useDeleteModel();

    const { stop, training } = useTraining(model.id);
    const isTraining = training?.status && training?.status !== "stopped";
    return (
        <Card className="flex justify-around items-center h-full w-full bg-[#fdfdfd] border border-gray-200 shadow-none py-4">
            <div className="text-center flex-1 mx-2">
                <p className="text-lg font-semibold pb-2">Training</p>
                <div className="flex flex-row justify-center gap-2">
                    {isTraining && (
                        <Button
                            className="bg-gradient-to-br from-red-200 to-orange-100 text-black border border-gray-300 hover:brightness-95"
                            onClick={stop}
                        >
                            <StopIcon className="w-4 h-4" />
                            Stop training{" "}
                        </Button>
                    )}
                    {!isTraining && (
                        <Popover>
                            <PopoverTrigger asChild>
                                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-gradient-to-br from-violet-200 to-rose-100 text-black border border-gray-300 hover:brightness-95 shadow-sm">
                                    <PlayIcon className="w-4 h-4" />
                                    Start training
                                </button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <TrainPopover model={model} />
                            </PopoverContent>
                        </Popover>
                    )}
                </div>
            </div>
            <div className="text-center flex-1 mx-2">
                <p className="text-lg font-semibold pb-2">Export model</p>
                <div className="flex justify-center gap-2">
                    <Button
                        className="pl-4 pr-6 text-black"
                        variant="outline"
                        onClick={() => downloadWeights(model.id)}
                        disabled={!model.epochsTrained}
                    >
                        <ArrowDownTrayIcon className="w-4 h-4 " />
                        Weights{" "}
                    </Button>
                    <Button
                        className="pl-4 pr-6 text-black"
                        variant="outline"
                        onClick={() => downloadArchitecture(model.id)}
                    >
                        <ArrowDownTrayIcon className="w-4 h-4 " />
                        Architecture{" "}
                    </Button>
                </div>
            </div>
            <div className="text-center flex-1 mx-2">
                <p className="text-lg font-semibold pb-2">Manage model</p>
                <div className="flex justify-center gap-2">
                    <Button
                        className="pl-4 pr-6 text-black"
                        variant="outline"
                        onClick={() => {
                            router.push(`/models/new?fromModel=${model.id}`);
                        }}
                    >
                        <DocumentDuplicateIcon className="w-4 h-4" />
                        Duplicate{" "}
                    </Button>
                    <Button
                        className="pl-4 pr-6 text-black"
                        variant="outline"
                        onClick={async () => {
                            if (
                                confirm(
                                    "Are you sure you want to delete this model?\nTHIS IS IRREVERSIBLE!",
                                )
                            ) {
                                deleteModel(model.id);
                            }
                        }}
                    >
                        <TrashIcon className="w-4 h-4" />
                        Delete{" "}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

export default ActionBar;
