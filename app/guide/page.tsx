"use client";

import PageContainer from "@/components/PageContainer";

const videoData = [
    {
        title: "1. Import a dataset",
        desc: "Learn how to import your dataset and prepare it for training.",
        url: "https://www.youtube.com/embed/mdgMKjbCHMY",
    },
    {
        title: "2. Create a model instance",
        desc: "Understand model configurations and create your own instance step by step.",
        url: "https://www.youtube.com/embed/mdgMKjbCHMY",
    },
    {
        title: "3. Follow training",
        desc: "Track your model's training progress and understand key performance metrics.",
        url: "https://www.youtube.com/embed/mdgMKjbCHMY",
    },
    {
        title: "4. Use a model instance",
        desc: "Deploy and reuse your trained model to make predictions on your own data.",
        url: "https://www.youtube.com/embed/mdgMKjbCHMY",
    },
];

const GuidePage = () => {
    return (
        <PageContainer
            title="Need some help ?"
            subtitle="Watch our videos to learn how to use SimplifyAI step by
                    step."
        >
            {/* Videos grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {videoData.map((video, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col h-full text-center mb-4"
                    >
                        {/* Header */}
                        <div>
                            <h2 className="text-lg font-semibold">
                                {video.title}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {video.desc}
                            </p>
                        </div>
                        {/* Video container aligned at bottom */}
                        <div className="mt-auto w-full aspect-video rounded-md overflow-hidden ring-1 ring-gray-300 shadow-sm">
                            <iframe
                                className="w-full h-full"
                                src={video.url}
                                title={video.title}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </div>
                    </div>
                ))}
            </div>
        </PageContainer>
    );
};

export default GuidePage;
