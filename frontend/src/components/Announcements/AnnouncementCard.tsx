import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ImageOff } from 'lucide-react';
import type { Announcement } from '@/types';
import { formatDate, isExpired, truncate, getImageUrl } from '@/utils/format';

interface AnnouncementCardProps {
    announcement: Announcement;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
    const [imageError, setImageError] = useState(false);
    const expired = isExpired(announcement.expiresAt);
    const isUrgent = announcement.type === 'URGENT';

    return (
        <Link
            to={`/${isUrgent ? 'hitno' : 'aktuelno'}/${announcement.slug}`}
            className={`card group ${expired ? 'opacity-60' : ''}`}
        >
            {announcement.imageUrl && !imageError ? (
                <div className="aspect-video bg-gray-100 relative overflow-hidden">
                    <img
                        src={getImageUrl(announcement.imageUrl)}
                        alt={announcement.title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                </div>
            ) : announcement.imageUrl ? (
                <div className="aspect-video bg-gray-100 flex items-center justify-center text-gray-400">
                    <ImageOff className="w-10 h-10" />
                </div>
            ) : null}

            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    {isUrgent && <span className="badge-urgent">Hitno</span>}
                    {expired && <span className="badge bg-gray-200 text-gray-600">Isteklo</span>}
                </div>

                <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {announcement.title}
                </h3>

                {announcement.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {truncate(announcement.excerpt, 150)}
                    </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(announcement.publishedAt)}</span>
                    </div>
                    {announcement.expiresAt && !expired && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Do {formatDate(announcement.expiresAt)}</span>
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}