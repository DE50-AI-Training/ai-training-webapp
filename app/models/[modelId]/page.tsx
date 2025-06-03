"use client";

import { modelsAtom } from "@/lib/atoms/modelAtoms";
import { useAtomValue } from "jotai";


import React, { useState } from 'react';
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";
import { useTraining } from "@/lib/hooks/useTraining";
import { Tooltip, TooltipContent, TooltipProvider } from "@radix-ui/react-tooltip";
import { TooltipTrigger } from "@/components/ui/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Spinner } from "@/components/ui/Spinner";
import { TrainingStatus } from "@/lib/models/training";
import { FormSection } from "@/components/models/FormSection";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/DropdownMenu";

const Model = ({ params }: { params: { modelId: string } }) => {
    const models = useAtomValue(modelsAtom);
    const model = models.find((m) => m.id === Number(params.modelId));
    if (!model) {
        return <div>Model not found</div>;
    }



    const datasets = useAtomValue(datasetsAtom);
        const dataset = datasets.find((dataset) => dataset.id === model.datasetId);
        const layers = model.mlpArchitecture?.layers || [];
    
        const networkType = model.mlpArchitecture ? "MLP" : "";
        const problemType =
            model.problemType === "classification"
                ? "Classification"
                : model.problemType === "regression"
                  ? "Regression"
                  : "Unknown";
        const inputLayer = layers[0] || 0;
        const hiddenLayers = layers.slice(1, -1).length || 0;
        const outputLayer = layers[layers.length - 1] || 0;
        const activation = "relu";
    
        const { stop, training } = useTraining(model.id);
        const trainingStatus = training?.status ?? "stopped";
    
        const TRAINING_STATUS_MAP: Record<
            TrainingStatus,
            { text: string; color: string }
        > = {
            stopped: { text: "Stopped", color: "bg-red-400" },
            starting: { text: "Starting", color: "bg-blue-400" },
            training: {
                text: `Training`,
                color: "bg-lime-400",
            },
            stopping: { text: "Stopping", color: "bg-yellow-400" },
            error: { text: "Error", color: "bg-red-400" },
        };
    
        const { text: trainingStatusText, color: trainingStatusColor } =
            TRAINING_STATUS_MAP[trainingStatus];
    
        const date = new Date(model.createdAt);
        const formattedDate = date.toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });


        const [selectedMode, setSelectedMode] = useState<'import' | 'write' | null>(null);

    return (
        <div className="flex w-full flex-col bg-white rounded-xl ring-1 ring-gray-200 p-14 pt-3 pb-3 space-y-4">
      <h1 className="text-5xl font-semibold text-center">Model: {model.name}</h1> 
      {/* Top Buttons */}
      <div className="flex justify-around items-center border rounded-lg py-4">
        <div className="text-center">
          <p className="text-xl font-semibold pb-2">Training</p>
          <Button className="bg-gradient-to-r from-red-400 to-orange-300 px-6 border border-gray-400 text-black">STOP Training</Button>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold pb-2">Model Save</p>
          <Button className="bg-gray-300 px-6 border border-gray-400 text-black">Save your Model</Button>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold pb-2">Model Copy</p>
          <Button className="bg-gray-300 px-6 border border-gray-400 text-black">Copy Model</Button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex flex-col md:flex-row gap-5">
        {/* Model Information */}
        <Card className=" h-full w-full md:w-1/3 bg-gray-50">
          <CardContent className="p-6 space-y-3">
            <h1 className="text-4xl font-semibold text-center">Model Informations</h1>
            <hr className="border-gray-200 my-3" />
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">Training Informations</h2>
              <hr className="border-gray-200 my-3" />
              <div className="flex flex-col gap-1">
                <strong>Model status:</strong>
                <span className="inline-flex items-center gap-2">
                  {/* Indicateur de statut */}
                    <span
                        className={`inline-block w-3.5 h-3.5 ${trainingStatusColor} rounded-full mr-2`}
                    ></span>
                    {/* Texte de statut */}
                    <span className="text-sm mr-0.5">{trainingStatusText}</span>
                    {trainingStatus !== "stopped" && (
                        <div className="flex flex-row text-sm mr-2 gap-2">
                            <Spinner className="w-3.5 h-3.5" />
                            <span>·</span>
                        </div>
                    )}
                    {training?.status === "training" && (
                        <>
                            <div className="flex flex-row text-sm mr-1 items-center gap-2">
                                {` ${training?.epochs} / ${training?.maxEpochs} epochs `}
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <InformationCircleIcon className="h-4 w-4 cursor-pointer" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            {`Batch size: ${training?.batchSize}`}
                                        </p>
                                        <p>
                                            {`Epochs: ${training?.epochs} / ${training?.maxEpochs}`}
                                        </p>
                                        <p>
                                            {`Learning rate: ${training?.learningRate}`}
                                        </p>
                                        <p>
                                            {model.problemType === "classification"
                                                ? `Accuracy: ${training?.score?.toFixed(2) ?? "Not available"}`
                                                : `Mean Absolute Error: ${training?.score?.toFixed(2) ?? "Not available"}`}
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </>
                    )}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <strong>Accuracy:</strong> 
              <span>Actual model accuracy: {training?.score?.toFixed(2)} %</span>
              </div>
            </div>
            <div className="space-y-3">
                <hr className="border-gray-200 my-3" />
              <p className="text-2xl font-semibold">Architecture Informations</p>
              <hr className="border-gray-200 my-3" />
              <p><strong>Dataset:</strong> {dataset?.name}</p>
              <p><strong>Problem type:</strong> {model.problemType}</p>
              <p><strong>Activation:</strong> {activation}</p>
              <p><strong>Last learning rate:</strong>{training?.learningRate}</p>
              <p><strong>Network type:</strong> {networkType}</p>
              <p><strong>Input layer:</strong> {inputLayer} neurons</p>
              <p><strong>Output layer:</strong> {outputLayer} neurons</p>
              
              
              <div className="flex flex-row items-center gap-2">
                <p><strong>Hidden layers: </strong></p> 
                <div className="border border-gray-250 rounded-md p-2">
                <DropdownMenu>
                  <DropdownMenuTrigger>{hiddenLayers} layers</DropdownMenuTrigger>
                  <DropdownMenuContent> 
                    {Array.from({ length: hiddenLayers }).map((_, i) => (
                      <React.Fragment key={i}>
                        <DropdownMenuItem>Layer {i + 1} : {layers[i + 1]}</DropdownMenuItem>
                        {i < hiddenLayers - 1 && <DropdownMenuSeparator />}
                      </React.Fragment>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                </div>
                
                </div>
              
              
            </div>
          </CardContent>
        </Card>

        {/* Try your model */}
        <Card className="h-full w-full md:w-2/3 bg-gray-50">
          <CardContent className="p-6 space-y-3">
            <h2 className="text-4xl font-semibold text-center">Try your model</h2>
            <hr className="border-gray-200 my-3" />

            <div className="space-y-3">
               <FormSection
                                      title="1. Choose Data type to test"
                                      tootipContent="Choose the type of data you want to use for testing your model."
                                  />
              <div className="flex justify-center gap-3">
                <Button
            variant={selectedMode === 'import' ? 'default' : 'secondary'}
            onClick={() => setSelectedMode('import')}
          >
            Import Dataset
          </Button>
          <Button
            variant={selectedMode === 'write' ? 'default' : 'secondary'}
            onClick={() => setSelectedMode('write')}
          >
            Write own data
          </Button>
              </div>
              <hr className="border-gray-200 my-3" />
        {/* Conditional content depending on selection */}
      {selectedMode === 'import' && (
        <div>
              <FormSection
                                      title="2. Import dataset"
                                      tootipContent="Choose the dataset to use for training"
                                  />
              <div className="flex justify-center items-center flex-col pt-2">
                <Input type="file" className="max-w-xs" />
                </div>

                <hr className="border-gray-200 my-3" />

              <FormSection
                                      title="3. Transform data"
                                      tootipContent="Choose the dataset to be used for training"
                                  />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead></TableHead>
                    <TableHead>Column 1</TableHead>
                    <TableHead>Column 2</TableHead>
                    <TableHead>Column 3</TableHead>
                    <TableHead>Column 4</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Data type</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Non-null rows</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Null rows</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>6</TableCell>
                    <TableCell>0</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <hr className="border-gray-200 my-3" />

              <div className="flex justify-center items-center flex-col gap-2">
              <FormSection
                                      title="4. Result"
                                      tootipContent="Click to generate the result."
                                  />
              <Button className="bg-gradient-to-br from-green-100 to-orange-100 text-black w-full max-w-xs mx-auto">Generate Result</Button>
            </div>
        </div>

        )}

        {selectedMode === 'write' && (
        <div>
               <FormSection
                                      title="2. Write your own data"
                                      tootipContent="Enter your own data manually."
                                  />
              <div className="flex justify-center items-center flex-col pt-2">
                <textarea
            rows={4}
            placeholder="Enter your own data here..."
            className="w-full border border-gray-300 rounded p-2"
          />
          <p className="text-sm text-gray-500">Paste raw data manually into the box.</p>
                </div>

                <hr className="border-gray-200 my-3" />
              
              <div className="flex justify-center items-center flex-col gap-2">
              <FormSection
                                      title="3. Result"
                                      tootipContent="Click to generate the result."
                                  />
              <Button className="bg-gradient-to-br from-green-100 to-orange-100 text-black w-full max-w-xs mx-auto">Generate Result</Button>
            </div>
        </div>

        )}

            </div>
          </CardContent>
        </Card>
      </div>
    </div>

        
    );
};

export default Model;
