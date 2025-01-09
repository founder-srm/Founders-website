'use client';
import { useAdminCheck } from "@/hooks/useAdminCheck";

export default function AdminLayout({children}: {children: React.ReactNode}) {
    const { isLoading } = useAdminCheck();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900" />
                <p className="ml-4">Checking permissions...</p>
            </div>
        );
    }

    return children;
}