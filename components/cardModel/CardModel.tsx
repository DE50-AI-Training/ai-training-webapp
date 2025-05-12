import React from 'react';
import { Checkbox } from "@/components/ui/Checkbox";
import { Label } from "@/components/ui/Label";

const CardModel = ({
  title = "My first image model",
  date = "19/05/2025 at 16:18",
  dataset = "Image number dataset",
  problemType = "Image classification",
  networkType = "MLP",
  inputLayer = "762 neurons",
  hiddenLayers = "2 layers",
  outputLayer = "4 neurons",
  activation = "ReLU",
  regularization = "L1 (0.001 rate)",
  statusText = "Training (02:52:23 - 12,548 iterations)",
  isTraining = true // Pour déterminer la couleur du point et potentiellement l'état du bouton
}) => {

  return (
    // Conteneur principal de la carte md:w-full -> 
    <div className="w-1/2 md:w-1/2 mx-auto my-5 font-sans rounded-xl shadow-lg border border-gray-300 bg-gradient-to-br from-violet-200 to-rose-100 border border-black-200">

      {/* En-tête */}
      <div className="mb-1 pb-2 pl-4 p-3 ">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-[12px] text-gray-600">{date}</p>
      </div>

      {/* Contenu principal */}
      <div className="text-sm bg-gray-50 rounded-xl text-grey-700 shadow-lg border border-gray-300 space-y-2 mx-2 p-3 py-3 "> {/* Ajoute de l'espace entre les sections */}

        {/* Section 1: Dataset */}
        <div className="space-y-0"> {/* Espace entre les lignes de la section */}
          <p><strong className="font-medium text-gray-800 mr-1">Dataset:</strong>{dataset}</p>
          <p><strong className="font-medium text-gray-800 mr-1">Problem type:</strong>{problemType}</p>
        </div>

        <hr className="border-gray-200 my-3" /> {/* Séparateur */}

        {/* Section 2: Network */}
        <div className="space-y-0">
          <p><strong className="font-medium text-gray-800 mr-1">Network type:</strong>{networkType}</p>
          <p><strong className="font-medium text-gray-800 mr-1">Input layer:</strong>{inputLayer}</p>
          <p><strong className="font-medium text-gray-800 mr-1">Hidden layers:</strong>{hiddenLayers}</p>
          <p><strong className="font-medium text-gray-800 mr-1">Output layer:</strong>{outputLayer}</p>
        </div>

        <hr className="border-gray-200 my-3" /> {/* Séparateur */}

        {/* Section 3: Training Params */}
        <div className="space-y-0">
          <p><strong className="font-medium text-gray-800 mr-1">Activation:</strong>{activation}</p>
          <p><strong className="font-medium text-gray-800 mr-1">Regularization:</strong>{regularization}</p>
        </div>
      </div>

      {/* Pied de page / Barre de statut */}
      <div className="mt-3 border-t border-gray-200 flex justify-between items-center bg-pink-50 rounded-b-xl p-1 px-2">
        <div className="flex items-center">
          {/* Indicateur de statut */}
          <span className={`inline-block w-3.5 h-3.5 ${isTraining ? 'bg-lime-400' : 'bg-gray-400'} rounded-full mr-2`}></span>
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

export default CardModel;