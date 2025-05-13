import Image from "next/image";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export const FormSection = ({
    title,
    tootipContent,
}: {
    title: string;
    tootipContent?: string;
}) => {
    return (
        <div className="flex justify-center items-center mb-2">
            <h3 className="font-medium pr-2">{title}</h3>
            {tootipContent && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <InformationCircleIcon className="h-5 w-5 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{tootipContent}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
};
