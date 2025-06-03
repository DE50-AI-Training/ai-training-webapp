"use client";

import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import {
    Tooltip,
    TooltipTrigger,
    TooltipContent,
    TooltipProvider,
} from "@/components/ui/Tooltip";

import { useRouter } from "next/navigation";
import { useAtom } from "jotai";
import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import {
    DocumentChartBarIcon,
    CubeTransparentIcon,
    ArrowRightIcon,
} from "@heroicons/react/24/outline";

const Home = () => {
    const router = useRouter();
    const [models] = useAtom(modelsAtom);
    const [datasets] = useAtom(datasetsAtom);
    const lastCreatedModel = models
        .slice()
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )[0];

    const formatDateTime = (iso: string) => {
        const date = new Date(iso);
        const d = date.toLocaleDateString();
        const t = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        return { date: d, time: t };
    };

    const activityItems = [
        ...models.map((m) => ({
            type: "model" as const,
            id: m.id,
            name: m.name,
            createdAt: m.createdAt,
            datasetId: m.datasetId,
        })),
        ...datasets.map((d) => ({
            type: "dataset" as const,
            id: d.id,
            name: d.name,
            createdAt: d.createdAt,
        })),
    ].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return (
            <div className="flex w-full flex-col bg-white rounded-xl ring-1 ring-gray-200 p-20 pt-6 pb-6">
                {/* Titre centré */}
                <div className="text-center">
                    <p className="text-center text-[35px] font-bold">
                        Welcome to SimplifyAI !
                    </p>
                    <p className="text-xl font-medium text-gray-700 mb-4">
                        Train, visualize and operate your AI models in just a few clicks.
                    </p>
                    <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-2">
                        SimplifyAI helps you build and use AI models without writing a single line of code.
                    </p>
                    <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-6">
                        Whether you're analyzing customer data or experimenting with machine learning, SimplifyAI gives you the tools to import data, train models, and generate predictions — all in a few clicks.
                    </p>

                </div>

                {/* Bloc d'infos fusionné */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 border border-gray-300 ring-1 bg-gradient-to-b from-indigo-200 to-purple-200 p-4 rounded-lg text-center">
                    {/* Trained Models */}
                    <div
                        onClick={() => router.push("/models")}
                        className="cursor-pointer hover:bg-purple-100 transition rounded-md py-2"
                    >
                        <p className="text-xl font-semibold">{models.length}</p>
                        <span className="text-sm text-gray-700">
                            Trained Models
                        </span>
                    </div>

                    {/* Downloaded Datasets */}
                    <div
                        onClick={() => router.push("/datasets")}
                        className="cursor-pointer hover:bg-purple-100 transition rounded-md py-2"
                    >
                        <p className="text-xl font-semibold">
                            {datasets.length}
                        </p>
                        <span className="text-sm text-gray-700">
                            Downloaded dataset
                        </span>
                    </div>

                    {/* Last Created Model */}
                    <div
                        onClick={() => {
                            if (lastCreatedModel) {
                                router.push(`/models/${lastCreatedModel.id}`);
                            }
                        }}
                        className="cursor-pointer hover:bg-purple-100 transition rounded-md py-2"
                    >
                        <p className="text-xl font-semibold truncate max-w-[140px] mx-auto">
                            {lastCreatedModel
                                ? lastCreatedModel.name
                                : "No model yet"}
                        </p>
                        <p className="text-sm text-gray-700">
                            Your last created model
                        </p>
                    </div>

                    {/* Guide (statique pour l'instant) */}
                    <div
                        onClick={() => {
                            if (lastCreatedModel) {
                                router.push(`/guide`);
                            }
                        }}
                        className="cursor-pointer hover:bg-purple-100 transition rounded-md py-2"
                    >
                        <p className="text-xl font-semibold">Guide</p>
                        <p className="text-sm text-gray-700">
                            Check out our guide
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push("/models/new")}
                    >
                        New Model
                    </Button>
                    <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => router.push("/datasets/new")}
                    >
                        New Dataset
                    </Button>
                </div>

                <Separator className="my-4" />

                {/* Latest activity */}
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Latest Activity
                    </h2>
                    <div className="flex flex-col gap-2">
                        {activityItems.map((item, i) => {
                            const { date, time } = formatDateTime(
                                item.createdAt,
                            );
                            const Icon =
                                item.type === "model"
                                    ? CubeTransparentIcon
                                    : DocumentChartBarIcon;

                            const dataset =
                                item.type === "model"
                                    ? datasets.find(
                                        (d) => d.id === item.datasetId,
                                    )
                                    : null;

                            const text =
                                item.type === "model"
                                    ? `${item.name} model has been created on ${date} at ${time} from dataset ${dataset?.name ?? "unknown"}`
                                    : `${item.name} dataset has been added on ${date} at ${time}`;

                            return (
                                <div
                                    key={i}
                                    className="flex items-center justify-between  bg-indigo-50 rounded-lg px-4 py-2 text-sm"
                                >
                                    <span className="flex items-center gap-2">
                                        <Icon className="w-5 h-5 text-indigo-600" />
                                        {text}
                                    </span>

                                    {item.type === "model" && (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <ArrowRightIcon
                                                    className="w-5 h-5 text-indigo-600 cursor-pointer hover:text-indigo-800 transition"
                                                    onClick={() =>
                                                        router.push(
                                                            `/models/${item.id}`,
                                                        )
                                                    }
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                View {item.type}
                                            </TooltipContent>
                                        </Tooltip>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
    );
};

export default Home;
