import { Button } from "@/components/ui/Button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/Command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { datasetsAtom } from "@/lib/atoms/datasetAtoms";

type DatasetPopoverProps = {
    selectedDatasetId: number | null;
    setSelectedDatasetId: (id: number | null) => void;
};

const DatasetPopover = ({
    selectedDatasetId,
    setSelectedDatasetId,
}: DatasetPopoverProps) => {
    const datasets = useAtomValue(datasetsAtom);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    className="w-[200px] justify-between"
                >
                    {selectedDatasetId !== null
                        ? datasets.find(
                              (dataset) => dataset.id === selectedDatasetId,
                          )?.name
                        : "Select dataset"}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search dataset..."
                        className="h-9"
                    />
                    <CommandList>
                        <CommandEmpty>No dataset found.</CommandEmpty>
                        <CommandGroup>
                            {datasets.map((ds) => (
                                <CommandItem
                                    key={ds.id}
                                    value={String(ds.id)}
                                    onSelect={(currentValue) => {
                                        const id = parseInt(currentValue, 10);
                                        setSelectedDatasetId(
                                            selectedDatasetId === id
                                                ? null
                                                : id,
                                        );
                                    }}
                                >
                                    {ds.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            selectedDatasetId === ds.id
                                                ? "opacity-100"
                                                : "opacity-0",
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default DatasetPopover;
