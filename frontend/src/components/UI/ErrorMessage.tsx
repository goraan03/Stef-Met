import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
    message?: string;
}

export function ErrorMessage({ message = 'Došlo je do greške. Pokušajte ponovo.' }: ErrorMessageProps) {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <p>{message}</p>
            </div>
        </div>
    );
}