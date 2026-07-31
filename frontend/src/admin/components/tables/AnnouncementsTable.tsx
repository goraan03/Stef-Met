import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi } from '@/api/endpoints';
import { AnnouncementFormModal } from '../modals/AnnouncementFormModal';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Tabs } from '../ui/Tabs';
import { Edit, Trash2, Plus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { formatDate } from '@/utils/format';
import { AnnouncementType } from '@/types';
import type { Announcement } from '@/types';

export function AnnouncementsTable() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<AnnouncementType>(AnnouncementType.CURRENT);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [deleteAnnouncement, setDeleteAnnouncement] = useState<Announcement | null>(null);

  const { data: announcementsResponse, isLoading } = useQuery({
    queryKey: ['announcements', 'admin', activeTab],
    queryFn: () => announcementsApi.getAll({ type: activeTab }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => announcementsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setDeleteAnnouncement(null);
    },
  });

  const announcements = announcementsResponse?.data || [];

  const handleAdd = () => {
    setSelectedAnnouncement(null);
    setIsFormOpen(true);
  };

  const handleEdit = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsFormOpen(true);
  };

  const handleDelete = (announcement: Announcement) => {
    setDeleteAnnouncement(announcement);
  };

  const tabs = [
    { id: AnnouncementType.CURRENT, label: 'Aktuelno' },
    { id: AnnouncementType.URGENT, label: 'Hitno', icon: <AlertCircle className="w-4 h-4" /> },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Objave</h2>
        <button onClick={handleAdd} className="btn-primary">
          <Plus className="w-4 h-4" />
          Dodaj objavu
        </button>
      </div>

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as AnnouncementType)}
      />

      <div className="mt-6">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Učitavanje...</div>
        ) : announcements.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Nema objava. Dodajte prvu objavu.
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Naslov
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Datum objave
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Ističe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Akcije
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {announcements.map((announcement) => (
                    <tr key={announcement.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {announcement.title}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(announcement.publishedAt)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {announcement.expiresAt ? formatDate(announcement.expiresAt) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {announcement.visible ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            <Eye className="w-3 h-3" />
                            Vidljivo
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                            <EyeOff className="w-3 h-3" />
                            Sakriveno
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(announcement)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AnnouncementFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        announcement={selectedAnnouncement}
        type={activeTab}
      />

      <ConfirmDialog
        isOpen={!!deleteAnnouncement}
        onClose={() => setDeleteAnnouncement(null)}
        onConfirm={() =>
          deleteAnnouncement && deleteMutation.mutate(deleteAnnouncement.id)
        }
        title="Obriši objavu"
        message={`Da li ste sigurni da želite da obrišete "${deleteAnnouncement?.title}"?`}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}