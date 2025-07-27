type Props = {
    children: React.ReactNode;
};

export function MainLayout({ children }: Props) {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto px-6 py-8">
                {children}
            </div>
        </div>
    );
}
