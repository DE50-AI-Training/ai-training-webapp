import { Model } from "@/lib/models/model";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { useTraining } from "@/lib/hooks/useTraining";
import { useState } from "react";

const TrainPopover = ({ model }: { model: Model }) => {
    const { train } = useTraining(model.id);

    const [batchSize, setBatchSize] = useState(model.lastBatchSize);
    const [maxEpochs, setMaxEpochs] = useState(model.lastMaxEpochs);
    const [learningRate, setLearningRate] = useState(model.lastLearningRate);

    return (
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <h4 className="font-medium leading-none">Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                    Set the dimensions for the layer.
                </p>
            </div>
            <div className="flex flex-col gap-2">
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="batchSize">Batch size</Label>
                    <Input
                        id="batchSize"
                        value={batchSize}
                        type="number"
                        onChange={(e) => setBatchSize(parseInt(e.target.value))}
                        min={1}
                        className="col-span-2"
                    />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="maxEpochs">Epochs (optional)</Label>
                    <Input
                        id="maxEpochs"
                        value={maxEpochs ?? ""}
                        type="number"
                        min={0}
                        onChange={(e) => setMaxEpochs(parseInt(e.target.value) ?? null)}
                        className="col-span-2"
                    />
                </div>
                <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="learningRate">Learning rate</Label>
                    <Input
                        id="learningRate"
                        value={learningRate}
                        type="number"
                        min={0}
                        step={0.001}
                        onChange={(e) =>
                            setLearningRate(parseFloat(e.target.value))
                        }
                        
                        className="col-span-2"
                    />
                </div>
                <Button
                    type="submit"
                    variant="default"
                    className="col-span-3 w-full"
                    onClick={() => {
                        train({
                            batchSize,
                            maxEpochs,
                            learningRate,
                        });
                    }}
                >
                    Train
                </Button>
            </div>
        </div>
    );
};

export default TrainPopover;
