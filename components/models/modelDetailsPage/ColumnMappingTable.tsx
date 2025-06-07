"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/Select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { Dataset } from "@/lib/models/dataset";
import { Model } from "@/lib/models/model";

interface ColumnMappingTableProps {
    model: Model;
    dataset: Dataset;
    uploadedDataset: Dataset | null | undefined;
    selectedColumns: Record<number, number | null>;
    onColumnMapping: (
        modelColumnIndex: number,
        uploadedColumnIndex: string,
    ) => void;
}

const ColumnMappingTable = ({
    model,
    dataset,
    uploadedDataset,
    selectedColumns,
    onColumnMapping,
}: ColumnMappingTableProps) => {
    const getCompatibleColumns = (
        targetColumnType: string,
        currentModelColumnIndex?: number,
    ) => {
        if (!uploadedDataset) return [];

        const selectedColumnIndices = Object.values(selectedColumns).filter(
            (val) => val !== null,
        );
        const currentSelection =
            currentModelColumnIndex !== undefined
                ? selectedColumns[currentModelColumnIndex]
                : null;

        return uploadedDataset.columns
            .map((col, index) => ({ ...col, index }))
            .filter((col) => {
                const isCompatibleType = col.type === targetColumnType;
                const isNotSelected =
                    !selectedColumnIndices.includes(col.index) ||
                    col.index === currentSelection;
                return isCompatibleType && isNotSelected;
            });
    };

    return (
        <div className="mt-6">
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <Table className="border-collapse overflow-hidden">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="py-3 font-medium border-b" />
                            {model.inputColumns.map((columnIndex) => {
                                const col = dataset?.columns[columnIndex];
                                return (
                                    <TableHead
                                        key={columnIndex}
                                        className="text-center py-3 font-medium border-b relative"
                                    >
                                        <div className="flex items-center justify-center">
                                            <span>{col?.name}</span>
                                        </div>
                                    </TableHead>
                                );
                            })}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="text-center py-4 px-1">
                                <span className="text-gray-500">Data type</span>
                            </TableCell>
                            {model.inputColumns.map((columnIndex) => {
                                const col = dataset?.columns[columnIndex];
                                return (
                                    <TableCell
                                        key={columnIndex}
                                        className="text-center py-4 px-1"
                                    >
                                        <span className="text-gray-500">
                                            {col?.type}
                                        </span>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="text-center py-4 px-1">
                                <span className="text-gray-500">
                                    Mapped column
                                </span>
                            </TableCell>
                            {model.inputColumns.map((modelColumnIndex) => {
                                const col = dataset?.columns[modelColumnIndex];
                                const compatibleColumns = getCompatibleColumns(
                                    col?.type || "",
                                    modelColumnIndex,
                                );
                                return (
                                    <TableCell
                                        key={modelColumnIndex}
                                        className="text-center py-4 px-1"
                                    >
                                        <Select
                                            value={
                                                selectedColumns[
                                                    modelColumnIndex
                                                ]?.toString() || ""
                                            }
                                            onValueChange={(value) =>
                                                onColumnMapping(
                                                    modelColumnIndex,
                                                    value,
                                                )
                                            }
                                            disabled={
                                                !uploadedDataset ||
                                                compatibleColumns.length === 0
                                            }
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select column" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {compatibleColumns.map(
                                                    (uploadedCol) => (
                                                        <SelectItem
                                                            key={uploadedCol.index}
                                                            value={uploadedCol.index.toString()}
                                                        >
                                                            {uploadedCol.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ColumnMappingTable;
