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

const UseModelCard = ({ model }: { model: Model }) => {
    const [selectedMode, setSelectedMode] = useState<"import" | "write">(
        "import",
    );

    return (
        <Card className="h-full w-full lg:w-2/3 bg-[#fdfdfd] border border-gray-200 shadow-none">
            <CardContent className="p-6 space-y-3">
                <h2 className="text-3xl font-semibold text-center">
                    Try your model
                </h2>
                <hr className="border-gray-200 my-3" />

                <div className="space-y-3">
                    <FormSection
                        title="1. Choose Data type to test"
                        tooltipContent="Choose the type of data you want to use for testing your model."
                    />
                    <div className="flex justify-center gap-3">
                        <Button
                            variant={
                                selectedMode === "import"
                                    ? "default"
                                    : "secondary"
                            }
                            onClick={() => setSelectedMode("import")}
                        >
                            Import Dataset
                        </Button>
                        <Button
                            variant={
                                selectedMode === "write"
                                    ? "default"
                                    : "secondary"
                            }
                            onClick={() => setSelectedMode("write")}
                        >
                            Write own data
                        </Button>
                    </div>
                    <hr className="border-gray-200 my-3" />
                    {/* Conditional content depending on selection */}
                    {selectedMode === "import" && (
                        <div>
                            <FormSection
                                title="2. Import dataset"
                                tooltipContent="
                                                Choose the dataset for which you
                                                want to predict the results.
                                       "
                            />
                            <div className="flex justify-center items-center flex-col pt-2">
                                <Input type="file" className="max-w-xs" />
                            </div>

                            <hr className="border-gray-200 my-3" />

                            <FormSection
                                title="3. Transform data"
                                tooltipContent="Choose the dataset to be used for training"
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
                            <hr className="border-gray-200 my-3" />

                            <div className="flex justify-center items-center flex-col gap-2">
                                <FormSection title="4. Result" />
                                <Button className="bg-gradient-to-br from-green-100 to-orange-100 text-black w-full max-w-[10rem] mx-auto">
                                    Generate Result
                                </Button>
                            </div>
                        </div>
                    )}

                    {selectedMode === "write" && (
                        <div>
                            <FormSection
                                title="2. Write your own data"
                                tooltipContent="Enter your own data manually."
                            />
                            <div className="flex justify-center items-center flex-col pt-2">
                                <textarea
                                    rows={4}
                                    placeholder="Enter your own data here..."
                                    className="w-full border border-gray-300 rounded p-2"
                                />
                                <p className="text-sm text-gray-500">
                                    Paste raw data manually into the box.
                                </p>
                            </div>

                            <hr className="border-gray-200 my-3" />

                            <div className="flex justify-center items-center flex-col gap-2">
                                <FormSection
                                    title="3. Result"
                                    tooltipContent="Click to generate the result."
                                />
                                <Button className="bg-gradient-to-br from-green-100 to-orange-100 text-black w-full max-w-xs mx-auto">
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