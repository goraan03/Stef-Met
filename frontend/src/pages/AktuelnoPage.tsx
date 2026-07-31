import { useQuery } from '@tanstack/react-query';
import { announcementsApi } from '@/api/endpoints';
import { PageHeader } from '@/components/UI/PageHeader';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { ErrorMessage } from '@/components/UI/ErrorMessage';
import { EmptyState } from '@/components/UI/EmptyState';
import { AnnouncementCard } from '@/components/Announcements/AnnouncementCard';

export function AktuelnoPage() {
    const { data: announcementsResponse, isLoading, isError } = useQuery({
        queryKey: ['announcements', 'current'],
        queryFn: () => announcementsApi.getAll({ type: 'CURRENT', visible: true }),
    });

    const announcements = announcementsResponse?.data || [];

    return (
        <div>
            <PageHeader
                title="Aktuelno"
                description="Vesti, obaveštenja i informacije o kompaniji i dostupnoj opremi"
            />

            <section className="section">
                <div className="container">
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : isError ? (
                        <ErrorMessage />
                    ) : announcements.length === 0 ? (
                        <EmptyState message="Trenutno nema aktuelnih obaveštenja" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {announcements.map((announcement) => (
                                <AnnouncementCard key={announcement.id} announcement={announcement} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}