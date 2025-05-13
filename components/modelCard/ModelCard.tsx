import React from "react";
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";
import { Model } from "@/lib/models/model";
import { useAtomValue } from "jotai";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";

const ModelCard = ({ model }: { model: Model }) => {
    const datasets = useAtomValue(datasetsAtom);
    const dataset = datasets.find((dataset) => dataset.id === model.datasetId);
    const layers = model.mlpArchitecture?.layers || [];

    const networkType = model.mlpArchitecture ? "MLP" : "";
    const inputLayer = layers[0] || 0;
    const hiddenLayers = layers.slice(1, -1).length || 0;
    const outputLayer = layers[layers.length - 1] || 0;
    const activation = "relu";

    const isTraining = true;
    const statusText = isTraining ? "Training..." : "Idle";

    return (
        // Conteneur principal de la carte md:w-full ->
        <div className="w-full mx-auto my-5 font-sans rounded-lg shadow-lg border border-gray-300 bg-gradient-to-br from-violet-200 to-rose-100">
            {/* En-tête */}
            <div className="mb-1 pb-2 pl-4 p-3 ">
                <a className="text-xl font-bold text-gray-800 underline" href={`/models/${model.id}`} >
                    {model.name}
                </a>
                <p className="text-[12px] text-gray-600">{"LA DATE"}</p>
            </div>

            {/* Contenu principal */}
            <div className="text-sm bg-gray-50 rounded-lg text-gray-700 border border-gray-300 space-y-2 mx-2 p-3 py-3 ">
                {/* Section 1: Dataset */}
                <div className="space-y-0">
                    {/* Espace entre les lignes de la section */}
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Dataset:
                        </strong>
                        {dataset?.name}
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Problem type:
                        </strong>
                        PROBLEM_TYPE
                    </p>
                </div>
                <hr className="border-gray-200 my-3" /> {/* Séparateur */}
                {/* Section 2: Network */}
                <div className="space-y-0">
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Network type:
                        </strong>
                        {networkType}
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Input layer:
                        </strong>
                        {inputLayer} neurons
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Hidden layers:
                        </strong>
                        {hiddenLayers} layers
                    </p>
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Output layer:
                        </strong>
                        {outputLayer} neurons
                    </p>
                </div>
                <hr className="border-gray-200 my-3" /> {/* Séparateur */}
                {/* Section 3: Training Params */}
                <div className="space-y-0">
                    <p>
                        <strong className="font-medium text-gray-800 mr-1">
                            Activation:
                        </strong>
                        {activation}
                    </p>
                </div>
            </div>

            {/* Pied de page / Barre de statut */}
            <div className="mt-3 border-t border-gray-200 flex justify-between items-center bg-pink-50 rounded-b-lg p-1 px-2">
                <div className="flex items-center">
                    {/* Indicateur de statut */}
                    <span
                        className={`inline-block w-3.5 h-3.5 ${isTraining ? "bg-lime-400" : "bg-gray-400"} rounded-full mr-2`}
                    ></span>
                    {/* Texte de statut */}
                    <span className="text-[13px]">{statusText}</span>
                </div>

                {/* Bouton Stop */}
                <div className="flex items-center space-x-2">
                    <Label htmlFor="stop">Stop</Label>
                    <Checkbox id="stop" />
                </div>
            </div>
        </div>
    );
};

export default ModelCard;
