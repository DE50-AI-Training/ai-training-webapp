import { memo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select";

const FormSelect = ({
    value,
    onChange,
    options,
    placeholder,
}: {
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    placeholder: string;
}) => (
    <div className="flex justify-center">
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-1/2">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);

export default memo(FormSelect);
