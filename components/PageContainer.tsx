const PageContainer = ({
    children,
    title,
    subtitle = "",
}: {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}) => {
    return (
        <div className="flex w-full flex-col bg-white rounded-xl ring-1 ring-gray-200 p-20 pt-6 mb-4">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-center mb-4">{title}</h1>
                {subtitle && (
                    <p className="text-xl font-medium text-gray-700 text-center">
                        {subtitle}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
};

export default PageContainer;
