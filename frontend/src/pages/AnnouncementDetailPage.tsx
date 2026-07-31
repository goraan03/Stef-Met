import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { announcementsApi } from '@/api/endpoints';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { ErrorMessage } from '@/components/UI/ErrorMessage';
import { formatDate, isExpired, getImageUrl } from '@/utils/format';
import { ArrowLeft, Calendar, Clock, ImageOff } from 'lucide-react';

export function AnnouncementDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const location = useLocation();
    const [imageError, setImageError] = useState(false);
    const isUrgent = location.pathname.startsWith('/hitno');

    const { data: announcementResponse, isLoading, isError } = useQuery({
        queryKey: ['announcement', slug],
        queryFn: () => announcementsApi.getBySlug(slug!),
        enabled: !!slug,
    });

    if (isLoading) {
        return (
            <div className="section">
                <div className="container">
                    <LoadingSpinner />
                </div>
            </div>
        );
    }

    if (isError || !announcementResponse) {
        return (
            <div className="section">
                <div className="container">
                    <ErrorMessage message="Objava nije pronađena" />
                </div>
            </div>
        );
    }

    const announcement = announcementResponse.data;
    const expired = isExpired(announcement.expiresAt);

    return (
        <div className="section">
            <div className="container max-w-4xl">
                <Link
                    to={isUrgent ? '/hitno' : '/aktuelno'}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Nazad na {isUrgent ? 'hitno' : 'aktuelno'}
                </Link>

                <article>
                    {/* Header */}
                    <div className="mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            {announcement.type === 'URGENT' && (
                                <span className="badge-urgent">Hitno</span>
                            )}
                            {expired && (
                                <span className="badge bg-gray-200 text-gray-600">Isteklo</span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            {announcement.title}
                        </h1>

                        <div className="flex items-center gap-6 text-gray-600">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                <span>{formatDate(announcement.publishedAt)}</span>
                            </div>
                            {announcement.expiresAt && !expired && (
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    <span>Važi do {formatDate(announcement.expiresAt)}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image */}
                    {announcement.imageUrl && !imageError ? (
                        <div className="mb-8 rounded-xl overflow-hidden">
                            <img
                                src={getImageUrl(announcement.imageUrl)}
                                alt={announcement.title}
                                onError={() => setImageError(true)}
                                className="w-full h-auto"
                            />
                        </div>
                    ) : announcement.imageUrl ? (
                        <div className="mb-8 rounded-xl border border-gray-200 bg-gray-100 p-8 text-center text-gray-400">
                            <ImageOff className="w-10 h-10 mx-auto mb-3" />
                            <p>Slika nije dostupna</p>
                        </div>
                    ) : null}

                    {/* Content */}
                    <div className="prose prose-lg max-w-none">
                        <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                            {announcement.content}
                        </p>
                    </div>
                </article>
            </div>
        </div>
    );
}