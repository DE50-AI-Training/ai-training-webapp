"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { FormSection } from "@/components/models/FormSection";
import { Model } from "@/lib/models/model";
import { Button } from "@/components/ui/Button";
import { useState } from "react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/Tooltip";

const UseModelCard = ({ model }: { model: Model }) => {
    const [selectedMode, setSelectedMode] = useState<"import" | "write">(
        "import",
    );

    return (
        <Card className="h-full w-full lg:w-2/3 bg-[#fdfdfd] border border-gray-200 shadow-none">
            <CardContent className="p-6 space-y-6">
                <h2 className="text-3xl font-semibold text-center">
                    Prediction
                </h2>
                <hr className="border-gray-200 my-3" />

                <div className="space-y-6">
                    <div>
                        <FormSection title="1. Choose your prediction input" />
                        <div className="flex justify-center gap-3 pt-2">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            selectedMode === "import"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() =>
                                            setSelectedMode("import")
                                        }
                                    >
                                        From a dataset
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Generate predictions based on a custom
                                    dataset
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant={
                                            selectedMode === "write"
                                                ? "default"
                                                : "outline"
                                        }
                                        onClick={() => setSelectedMode("write")}
                                    >
                                        From manual input
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    Generate a prediction from a single input
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                    <hr className="border-gray-200 my-3" />
                    {/* Conditional content depending on selection */}
                    {selectedMode === "import" && (
                        <div className="space-y-6">
                            <div>
                                <FormSection title="2. Import dataset" />
                                <div className="flex justify-center items-center flex-col pt-2">
                                    <Input type="file" className="max-w-xs" />
                                </div>
                            </div>

                            <hr className="border-gray-200 my-3" />

                            <div className="flex flex-col align-center">
                                <FormSection
                                    title="3. Map columns"
                                    tooltipContent="Map the columns of your dataset to the columns of the model input."
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
                                            <TableCell className="font-semibold">
                                                Data type
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-semibold">
                                                Non-null rows
                                            </TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell>1</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell className="font-semibold">
                                                Null rows
                                            </TableCell>
                                            <TableCell>6</TableCell>
                                            <TableCell>6</TableCell>
                                            <TableCell>0</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                                <Button className="bg-gradient-to-br from-green-100 to-orange-100 text-black w-full max-w-[10rem] mx-auto border border-gray-300 hover:brightness-95 mt-8">
                                    Generate Result
                                </Button>
                            </div>

                        </div>
                    )}

                    {selectedMode === "write" && (
                        <div className="space-y-6">
                            <FormSection
                                title="2. Write your own data"
                                tooltipContent="Enter your own data manually."
                            />
                            <div className="flex justify-center items-center flex-col">
                                <textarea
                                    rows={4}
                                    placeholder="Enter your own data here..."
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <p className="text-sm text-gray-500">
                                    Paste raw data manually into the box.
                                </p>
                                <Button className="bg-gradient-to-br from-green-100 to-orange-100 text-black w-full max-w-[10rem] mx-auto border border-gray-300 hover:brightness-95 mt-8">
                                    Generate Result
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default UseModelCard;
