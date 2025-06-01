import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/Table";
import { DatasetColumn } from "@/lib/models/dataset";

interface DatasetInputTableProps {
    columns: DatasetColumn[];
}

export const DatasetInputTable = ({ columns }: DatasetInputTableProps) => {
    const getColumnType = (col: DatasetColumn) => {
        switch (col.type) {
            case "numeric":
                return "Numeric";
            case "categorical":
                return "Categorical";
            case "image":
                return "Image";
            default:
                return "Unknown";
        }
    };

    return (
        <div className="mt-6">
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <Table className="border-collapse overflow-hidden">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead />
                            {columns.map((col, index) => (
                                <TableHead
                                    key={index}
                                    className="text-center py-3 font-medium border-b relative"
                                >
                                    <div className="flex items-center justify-center">
                                        <span>{col.name}</span>
                                    </div>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="text-center py-4 px-1">
                                <span className="text-gray-500">Data type</span>
                            </TableCell>
                            {columns.map((col, index) => (
                                <TableCell
                                    key={index}
                                    className="text-center py-4 px-1"
                                >
                                    <span className="text-gray-500">
                                        {getColumnType(col)}
                                    </span>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="text-center py-4 px-1">
                                <span className="text-gray-500">Null rows</span>
                            </TableCell>
                            {columns.map((col) => (
                                <TableCell
                                    key={col.name}
                                    className="text-center py-4 px-1"
                                >
                                    <span className="text-gray-500">
                                        {col.nullCount}
                                    </span>
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow className="hover:bg-transparent">
                            <TableCell className="text-center py-4 px-1">
                                <span className="text-gray-500">Unique values</span>
                            </TableCell>
                            {columns.map((col) => (
                                <TableCell className="text-center py-4 px-1">
                                    <span className="text-gray-500">
                                        {col.uniqueValues}
                                    </span>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
