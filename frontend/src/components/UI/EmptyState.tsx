import { Factory } from 'lucide-react';

interface EmptyStateProps {
    message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Factory className="w-16 h-16 mb-4 text-gray-300" />
            <p className="text-lg">{message}</p>
        </div>
    );
}