import React from 'react';

const CardTraining = ({
  title = "Number images data",
  date = "19/05/2025 at 16:18",
  dataType = "Image",
  originalDataset = "my-dataset.csv",
  imageCount = "12,415",
  imageSize = "16x16 pixels",
  statusModelUsed = "4 models",
}) => {

  return (
    // Conteneur principal de la carte md:w-full -> shadow-lg
    <div className="w-1/2 md:w-1/2 mx-auto my-5 font-sans rounded-xl shadow-lg border border-gray-300 bg-gradient-to-br from-green-100 to-orange-100 border border-black-200">

      {/* En-tête */}
      <div className="mb-1 pb-2 pl-4 p-3 ">
        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
        <p className="text-[12px] text-gray-600">{date}</p>
      </div>

      {/* Contenu principal */}
      <div className="text-sm bg-gray-50 rounded-xl text-grey-700 shadow-lg border border-gray-300 space-y-2 mx-2 p-3 py-3 "> {/* Ajoute de l'espace entre les sections */}

        {/* Section 1: Dataset */}
        <div className="space-y-0"> {/* Espace entre les lignes de la section */}
          <p><strong className="font-medium text-gray-800 mr-1">Data Type:</strong>{dataType}</p>
          <p><strong className="font-medium text-gray-800 mr-1">Original dataset:</strong>{originalDataset}</p>
        </div>

        <hr className="border-gray-200 my-3" /> {/* Séparateur */}

        {/* Section 2: Network */}
        <div className="space-y-0">
          <p><strong className="font-medium text-gray-800 mr-1">Image count:</strong>{imageCount}</p>
          <p><strong className="font-medium text-gray-800 mr-1">Input layer:</strong>{imageSize}</p>
        </div>
      </div>

      {/* Pied de page / Barre de statut */}
      <div className="mt-3 border-t border-gray-200 flex justify-between items-center bg-gray-50 rounded-b-xl p-1 px-2">
        <div className="flex items-center">
        {/* Texte de statut */}
          <span className="text-[13px]">Used in <a className="underline" href=''>{statusModelUsed}</a></span>
        </div>

        {/* Bouton Stop */}
        <div className="flex items-center space-x-2">
              <a className="underline text-[13px]" href=''>Select model from data</a>
              
            </div>
      </div>
    </div>
  );
};

export default CardTraining;