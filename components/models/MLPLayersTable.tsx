import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface MLPLayersTableProps {
    layers: number[];
    setLayers?: (layers: number[]) => void;
}

export const MLPLayersTable = ({ layers, setLayers }: MLPLayersTableProps) => {
    const inputLayer = layers[0];
    const outputLayer = layers[layers.length - 1];
    const hiddenLayers = layers.slice(1, -1);

    const addHiddenLayer = () => {
        const newValue = hiddenLayers[hiddenLayers.length - 1] || 0;
        setLayers?.([inputLayer, ...hiddenLayers, newValue, outputLayer]);
    };

    const removeHiddenLayer = (index: number) => {
        if (hiddenLayers.length <= 1) return;
        const newHidden = hiddenLayers.filter((_, i) => i !== index);
        setLayers?.([inputLayer, ...newHidden, outputLayer]);
    };

    const updateHiddenLayer = (index: number, value: number) => {
        const newHidden = hiddenLayers.map((v, i) => (i === index ? value : v));
        setLayers?.([inputLayer, ...newHidden, outputLayer]);
    };

    const isEditing = !!setLayers;

    return (
        <div className="mt-6">
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <Table className="border-collapse  overflow-hidden">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="text-center py-3 font-medium border-b border-r">
                                Input layer
                            </TableHead>
                            {hiddenLayers.map((_, index) => (
                                <TableHead
                                    key={index}
                                    className="text-center py-3 font-medium border-b border-r relative"
                                >
                                    <div className="flex items-center justify-center">
                                        <span>Layer {index + 1}</span>
                                        {isEditing && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeHiddenLayer(index)
                                                }
                                                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                                                disabled={
                                                    hiddenLayers.length <= 1
                                                }
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </TableHead>
                            ))}
                            <TableHead className="text-center py-3 font-medium border-b">
                                Output layer
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="text-center py-4 px-0 border-r border-gray-200">
                                <span className="text-gray-500">
                                    {inputLayer}
                                </span>
                            </TableCell>

                            {hiddenLayers.map((layerValue, index) => (
                                <TableCell
                                    key={index}
                                    className="text-center py-4 px-0 border-r border-gray-200"
                                >
                                    {isEditing ? (
                                        <Input
                                            type="number"
                                            value={layerValue}
                                            onChange={(e) =>
                                                updateHiddenLayer(
                                                    index,
                                                    parseInt(e.target.value) ||
                                                        0,
                                                )
                                            }
                                            className="w-16 text-center mx-auto shadow-none focus:ring-0 focus:border-transparent"
                                        />
                                    ) : (
                                        <span className="text-gray-500">
                                            {layerValue}
                                        </span>
                                    )}
                                </TableCell>
                            ))}

                            <TableCell className="text-center py-4 px-0">
                                <span className="text-gray-500">
                                    {outputLayer}
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {isEditing && (
                <div className="flex justify-center mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addHiddenLayer}
                        className="px-3 py-1 text-sm"
                    >
                        <PlusIcon className="w-4 h-4" />
                        <span className="ml-1">Add layer</span>
                    </Button>
                </div>
            )}
        </div>
    );
};
