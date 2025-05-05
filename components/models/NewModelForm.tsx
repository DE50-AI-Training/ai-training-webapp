import { useState } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import Image from 'next/image'

// Type pour notre formulaire avec un nombre variable de couches
interface ModelFormData {
  problemType: string;
  trainingData: string;
  columnsToClassify: string;
  columnsAsParameters: string;
  selectedModel: string;
  networkConfig: {
    inputLayer: number;
    hiddenLayers: number[];
    outputLayer: number;
  };
}

export default function NewModelForm() {
  // État local du formulaire avec hiddenLayers comme tableau
  const [formData, setFormData] = useState<ModelFormData>({
    problemType: "",
    trainingData: "",
    columnsToClassify: "",
    columnsAsParameters: "",
    selectedModel: "multi-layer-perceptron",
    networkConfig: {
      inputLayer: 762,
      hiddenLayers: [16, 16],
      outputLayer: 10
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fonctions pour mettre à jour l'état du formulaire
  const updateFormData = (field: keyof ModelFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateInputLayer = (value: number) => {
    setFormData(prev => ({
      ...prev,
      networkConfig: {
        ...prev.networkConfig,
        inputLayer: value
      }
    }));
  };

  const updateOutputLayer = (value: number) => {
    setFormData(prev => ({
      ...prev,
      networkConfig: {
        ...prev.networkConfig,
        outputLayer: value
      }
    }));
  };

  const updateHiddenLayer = (index: number, value: number) => {
    setFormData(prev => {
      const newHiddenLayers = [...prev.networkConfig.hiddenLayers];
      newHiddenLayers[index] = value;
      return {
        ...prev,
        networkConfig: {
          ...prev.networkConfig,
          hiddenLayers: newHiddenLayers
        }
      };
    });
  };

  const addHiddenLayer = () => {
    setFormData(prev => {
      const lastValue = prev.networkConfig.hiddenLayers[prev.networkConfig.hiddenLayers.length - 1] || 16;
      return {
        ...prev,
        networkConfig: {
          ...prev.networkConfig,
          hiddenLayers: [...prev.networkConfig.hiddenLayers, lastValue]
        }
      };
    });
  };

  const removeHiddenLayer = (indexToRemove: number) => {
    setFormData(prev => {
      // Vérifier qu'il reste au moins une couche cachée
      if (prev.networkConfig.hiddenLayers.length <= 1) {
        return prev; // Ne pas supprimer si c'est la dernière couche
      }
      
      const newHiddenLayers = prev.networkConfig.hiddenLayers.filter((_, index) => index !== indexToRemove);
      return {
        ...prev,
        networkConfig: {
          ...prev.networkConfig,
          hiddenLayers: newHiddenLayers
        }
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Code pour soumettre le formulaire à votre API
      console.log(formData);

      // Simuler un délai
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Rediriger vers la page des modèles après création
      // router.push("/models");
    } catch (error) {
      console.error("Error creating model:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-8 text-center">New model</h1>

      <Card className="max-w-3xl mx-auto">
        <CardContent className="pt-6">

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* 1. Sélection du type de problème */}
            <div className="space-y-3">
              <div className="flex justify-center items-center mb-2">
                <h3 className="font-medium pr-2">1. Select problem type</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Image
                        src="/images/information.svg"
                        width={20}
                        height={20}
                        alt="Information icon"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choisissez le type de problème à résoudre</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-center">
                <Select
                  value={formData.problemType}
                  onValueChange={(value) => updateFormData("problemType", value)}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Problem type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classification">Classification</SelectItem>
                    <SelectItem value="regression">Regression</SelectItem>
                    <SelectItem value="clustering">Clustering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 2. Sélection des données d'entraînement */}
            <div className="space-y-3">
              <div className="flex justify-center items-center mb-2">
                <h3 className="font-medium pr-2">2. Select training data</h3>
                <TooltipProvider>
                  <Tooltip>
                  <TooltipTrigger asChild>
                      <Image
                        src="/images/information.svg"
                        width={20}
                        height={20}
                        alt="Information icon"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Sélectionnez les données d'entraînement</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex justify-center">
                <Select
                  value={formData.trainingData}
                  onValueChange={(value) => updateFormData("trainingData", value)}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Training data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dataset1">Dataset 1</SelectItem>
                    <SelectItem value="dataset2">Dataset 2</SelectItem>
                    <SelectItem value="dataset3">Dataset 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Select
                  value={formData.columnsToClassify}
                  onValueChange={(value) => updateFormData("columnsToClassify", value)}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Columns to be classified" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="column1">Column 1</SelectItem>
                    <SelectItem value="column2">Column 2</SelectItem>
                    <SelectItem value="column3">Column 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-center">
                <Select
                  value={formData.columnsAsParameters}
                  onValueChange={(value) => updateFormData("columnsAsParameters", value)}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Columns used as parameters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All columns</SelectItem>
                    <SelectItem value="selected">Selected columns only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 3. Sélection du modèle */}
            <div className="space-y-3">
              <div className="flex justify-center items-center mb-2">
                <h3 className="font-medium pr-2">3. Select model</h3>
                <TooltipProvider>
                  <Tooltip>
                  <TooltipTrigger asChild>
                      <Image
                        src="/images/information.svg"
                        width={20}
                        height={20}
                        alt="Information icon"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Choisissez le type de modèle à entraîner</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="flex justify-center">
                <Select
                  value={formData.selectedModel}
                  onValueChange={(value) => updateFormData("selectedModel", value)}
                >
                  <SelectTrigger className="w-1/2">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multi-layer-perceptron">Multi-layer perceptron</SelectItem>
                    <SelectItem value="random-forest">Random Forest</SelectItem>
                    <SelectItem value="svm">SVM</SelectItem>
                    <SelectItem value="logistic-regression">Logistic Regression</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.selectedModel === "multi-layer-perceptron" && (
                <div className="mt-6">
                  <div className="overflow-x-auto">
                    <Table className="border-collapse border-t border-l border-r border-gray-200 rounded-lg">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center py-3 font-medium border-b">Input layer</TableHead>
                          {formData.networkConfig.hiddenLayers.map((_, index) => (
                            <TableHead key={index} className="text-center py-3 font-medium border-b relative">
                              <div className="flex items-center justify-center">
                                <span>Layer {index + 1}</span>
                                <button 
                                  type="button"
                                  onClick={() => removeHiddenLayer(index)}
                                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                  disabled={formData.networkConfig.hiddenLayers.length <= 1}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </div>
                            </TableHead>
                          ))}
                          <TableHead className="text-center py-3 font-medium border-b">Output layer</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-center py-4 px-0 border-r border-gray-200">
                            <Input
                              type="number"
                              value={formData.networkConfig.inputLayer}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                updateInputLayer(parseInt(e.target.value) || 0)}
                              className="w-16 text-center mx-auto border-0 shadow-none bg-transparent focus:ring-0 focus:border-transparent"
                            />
                          </TableCell>
                          
                          {formData.networkConfig.hiddenLayers.map((layerValue, index) => (
                            <TableCell key={index} className="text-center py-4 px-0 border-r border-gray-200">
                              <Input
                                type="number"
                                value={layerValue}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                  updateHiddenLayer(index, parseInt(e.target.value) || 0)}
                                className="w-16 text-center mx-auto border-0 shadow-none bg-transparent focus:ring-0 focus:border-transparent"
                              />
                            </TableCell>
                          ))}
                          
                          <TableCell className="text-center py-4 px-0">
                            <Input
                              type="number"
                              value={formData.networkConfig.outputLayer}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                                updateOutputLayer(parseInt(e.target.value) || 0)}
                              className="w-16 text-center mx-auto border-0 shadow-none bg-transparent focus:ring-0 focus:border-transparent"
                            />
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={addHiddenLayer}
                      className="px-3 py-1 text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                      </svg>
                      <span className="ml-1">Add layer</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-center pb-4">
              <div className="relative inline-block group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#D97A7A] to-[#A48DD3] rounded-md opacity-60 group-hover:opacity-40 transition-opacity"></div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="ghost"
                  className="relative px-8 py-2 text-black font-medium z-10 hover:bg-transparent focus:bg-transparent"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

    </div>
  )
}