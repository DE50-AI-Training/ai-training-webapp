"use client";

import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Separator } from "@/components/ui/Separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Badge } from "@/components/ui/Badge"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/Tooltip"
import { Toaster } from "@/components/ui/Toaster"
import { Toast } from "@/components/ui/Toast"
import { Progress } from "@/components/ui/Progress"
import { Popover } from "@/components/ui/Popover"
import { Label } from "@/components/ui/Label"
import { Spinner } from "@/components/ui/Spinner"
import { Switch } from "@/components/ui/Switch"
import { Input } from "@/components/ui/Input"
import { useRouter } from "next/navigation"
import { useAtom } from "jotai"
import { modelsAtom } from "@/lib/atoms/modelAtoms"
import { datasetsAtom } from "@/lib/atoms/datasetAtoms"
import { DocumentChartBarIcon, CubeTransparentIcon, ArrowRightIcon } from "@heroicons/react/24/outline"



export default function Home() {
    const router = useRouter()
    const [models] = useAtom(modelsAtom)
    const [datasets] = useAtom(datasetsAtom)
    const lastCreatedModel = models
        .slice()
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

    const formatDateTime = (iso: string) => {
        const date = new Date(iso)
        const d = date.toLocaleDateString()
        const t = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        return { date: d, time: t }
    }

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
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())


    return (
        <TooltipProvider>
            <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start w-full px-6 py-8">
                <Card className="w-full p-6 bg-white rounded-xl ring-1 ring-gray-200">

                    {/* Titre centré */}
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-2">Welcome to SimplifyAI !</h1>
                        <p className="text-sm text-gray-500 mb-6">Train, visualize and operate your AI models in just a few clicks.</p>
                    </div>

                    {/* Bloc d'infos fusionné */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 bg-gradient-to-r from-indigo-200 to-purple-200 p-4 rounded-lg text-center">

                        {/* Trained Models */}
                        <div
                            onClick={() => router.push("/models")}
                            className="cursor-pointer hover:bg-purple-100 transition rounded-md py-2"
                        >
                            <p className="text-lg font-semibold">{models.length}</p>
                            <span className="text-sm text-gray-700">Trained Models</span>
                        </div>

                        {/* Downloaded Datasets */}
                        <div
                            onClick={() => router.push("/datasets")}
                            className="cursor-pointer hover:bg-purple-100 transition rounded-md py-2"
                        >
                            <p className="text-lg font-semibold">{datasets.length}</p>
                            <span className="text-sm text-gray-700">Downloaded dataset</span>
                        </div>

                        {/* Last Created Model */}
                        <div
                            onClick={() => {
                                if (lastCreatedModel) {
                                    router.push(`/models/${lastCreatedModel.id}`)
                                }
                            }}
                            className="cursor-pointer hover:bg-purple-100 transition rounded-md py-2"
                        >
                            <p className="text-lg font-semibold truncate max-w-[140px] mx-auto">
                                {lastCreatedModel ? lastCreatedModel.name : "No model yet"}
                            </p>
                            <p className="text-sm text-gray-700">Your last created model</p>
                        </div>

                        {/* Guide (statique pour l'instant) */}
                        <div className="py-2">
                            <p className="text-lg font-semibold">Guide</p>
                            <p className="text-sm text-gray-700">Check out our guide</p>
                        </div>
                    </div>



                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
                        <Button variant="outline" className="flex-1" onClick={() => router.push("/models/new")}>New Model</Button>
                        <Button variant="outline" className="flex-1" onClick={() => router.push("/datasets/new")}>New Dataset</Button>
                    </div>

                    <Separator className="my-4" />

                    {/* Latest activity */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4">Latest Activity</h2>
                        <div className="flex flex-col gap-2">
                            {activityItems.map((item, i) => {
                                const { date, time } = formatDateTime(item.createdAt)
                                const Icon = item.type === "model" ? CubeTransparentIcon : DocumentChartBarIcon

                                const dataset = item.type === "model"
                                    ? datasets.find((d) => d.id === item.datasetId)
                                    : null

                                const text =
                                    item.type === "model"
                                        ? `${item.name} model has been created on ${date} at ${time} from dataset ${dataset?.name ?? "unknown"}`
                                        : `${item.name} dataset has been added on ${date} at ${time}`

                                return (
                                    <div key={i} className="flex items-center justify-between bg-indigo-50 rounded-lg px-4 py-2 text-sm">
                                        <span className="flex items-center gap-2">
                                            <Icon className="w-5 h-5 text-indigo-600" />
                                            {text}
                                        </span>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <ArrowRightIcon
                                                    className="w-5 h-5 text-indigo-600 cursor-pointer hover:text-indigo-800 transition"
                                                    onClick={() =>
                                                        router.push(item.type === "model" ? `/models/${item.id}` : `/datasets/${item.id}`)
                                                    }
                                                />
                                            </TooltipTrigger>
                                            <TooltipContent>View {item.type}</TooltipContent>
                                        </Tooltip>


                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </Card>
            </main>
        </TooltipProvider>
    )
}
