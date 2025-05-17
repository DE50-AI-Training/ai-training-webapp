"use client";

import NewModelForm from "@/components/models/NewModelForm";
import { useSearchParams } from "next/navigation";

const NewModelPage = () => {
    const searchParams = useSearchParams();
    const datasetId = searchParams.get("dataset");
    return (
        <div className="bg-white rounded-xl ring-1 ring-gray-200 p-20 pt-6 pb-6">
            <NewModelForm
                baseDatasetId={datasetId ? Number(datasetId) : null}
            />
        </div>
    );
};

export default NewModelPage;
