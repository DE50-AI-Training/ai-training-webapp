import Image from "next/image";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/Tooltip";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import React from "react"

export const FormSection = ({
    title,
    tooltipContent,
}: {
    title: string;
    tooltipContent?: React.ReactNode
}) => {
    return (
        <div className="flex justify-center items-center mb-2">
            <h3 className="font-medium pr-2">{title}</h3>
            {tooltipContent && (
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <InformationCircleIcon className="h-5 w-5 cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>
                            {tooltipContent}
                            <span className="block mt-2 font-bold text-violet-300">Need help?</span> Check our{" "}
                            <a href="/guide" className="underline text-violet-300 hover:text-violet-500">
                                guide page
                            </a>
                            .
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            )}
        </div>
    );
};
