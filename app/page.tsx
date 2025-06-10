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
import PageContainer from "@/components/PageContainer";

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
        <PageContainer
            title="Welcome to SimplifyAI !"
            subtitle="Train, visualize and operate your AI models in just a few clicks."
        >
            {/* Titre centré */}
            <div className="text-center">
                <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-2">
                    SimplifyAI helps you build and use AI models without writing
                    a single line of code.
                </p>
                <p className="text-sm text-gray-500 max-w-2xl mx-auto mb-6">
                    Whether you're analyzing customer data or experimenting with
                    machine learning, SimplifyAI gives you the tools to import
                    data, train models, and generate predictions — all in a few
                    clicks.
                </p>
            </div>

            {/* Bloc d'infos fusionné */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 border border-gray-300 bg-gradient-to-l from-indigo-100 to-purple-100 p-4 rounded-lg text-center">
                {/* Trained Models */}
                <div
                    onClick={() => router.push("/models")}
                    className="cursor-pointer hover:bg-opacity-5 hover:bg-black transition rounded-md py-2"
                >
                    <p className="text-xl font-semibold">{models.length}</p>
                    <span className="text-sm text-gray-700">
                        Trained Models
                    </span>
                </div>

                {/* Downloaded Datasets */}
                <div
                    onClick={() => router.push("/datasets")}
                    className="cursor-pointer hover:bg-opacity-5 hover:bg-black transition rounded-md py-2"
                >
                    <p className="text-xl font-semibold">{datasets.length}</p>
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
                    className="cursor-pointer hover:bg-opacity-5 hover:bg-black transition rounded-md py-2"
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
                    className="cursor-pointer hover:bg-opacity-5 hover:bg-black transition rounded-md py-2"
                >
                    <p className="text-xl font-semibold">Guide</p>
                    <p className="text-sm text-gray-700">Check out our guide</p>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div
                    onClick={() => router.push("/datasets/new")}
                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-purple-50 to-pink-100 p-6 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-pink-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
                    <div className="relative flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200 transition-colors">
                            <DocumentChartBarIcon className="h-6 w-6 text-purple-800" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-800 transition-colors">
                                Add New Dataset
                            </h3>
                            <p className="text-sm text-gray-600">
                                Import and prepare your training data
                            </p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-purple-700 transition-all group-hover:translate-x-1" />
                    </div>
                </div>
                <div
                    onClick={() => router.push("/models/new")}
                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-100 p-6 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-40" />
                    <div className="relative flex items-center space-x-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 ">
                            <CubeTransparentIcon className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                                Create New Model
                            </h3>
                            <p className="text-sm text-gray-600">
                                Train a new AI model from your datasets
                            </p>
                        </div>
                        <ArrowRightIcon className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-all group-hover:translate-x-1" />
                    </div>
                </div>

                
            </div>

            <Separator className="my-4" />

            {/* Latest activity */}
            <div>
                <h2 className="text-lg font-semibold mb-4">Latest Activity</h2>
                <div className="flex flex-col gap-2">
                    {activityItems.map((item, i) => {
                        const { date, time } = formatDateTime(item.createdAt);
                        const Icon =
                            item.type === "model"
                                ? CubeTransparentIcon
                                : DocumentChartBarIcon;

                        const dataset =
                            item.type === "model"
                                ? datasets.find((d) => d.id === item.datasetId)
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
                                    <Icon className="w-5 h-5 text-indigo-800" />
                                    {text}
                                </span>

                                {item.type === "model" && (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <ArrowRightIcon
                                                className="w-5 h-5 text-indigo-800 cursor-pointer hover:text-indigo-400 transition"
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
        </PageContainer>
    );
};

export default Home;
