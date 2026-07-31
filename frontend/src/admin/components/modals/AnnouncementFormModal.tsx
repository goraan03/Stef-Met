import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { announcementsApi, uploadsApi } from '@/api/endpoints';
import { Modal } from '../ui/Modal';
import { AlertCircle, Upload, X, Loader2, ImageOff } from 'lucide-react';
import { AnnouncementType } from '@/types';
import type { Announcement } from '@/types';
import { getImageUrl } from '@/utils/format';

const announcementSchema = z.object({
  type: z.enum([AnnouncementType.CURRENT, AnnouncementType.URGENT]),
  title: z.string().min(2, 'Naslov mora imati najmanje 2 karaktera'),
  excerpt: z.string().optional(),
  content: z.string().min(10, 'Sadržaj mora imati najmanje 10 karaktera'),
  visible: z.boolean(),
  publishedAt: z.string().optional(),
  expiresAt: z.string().optional(),
});

type AnnouncementFormValues = z.infer<typeof announcementSchema>;

const toIsoDateString = (value?: string) => {
  if (!value) return undefined;

  const normalized = value.trim();
  if (!normalized) return undefined;

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
};

interface AnnouncementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement?: Announcement | null;
  type: AnnouncementType;
}

export function AnnouncementFormModal({
  isOpen,
  onClose,
  announcement,
  type,
}: AnnouncementFormModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!announcement;

  // Image state (single imageUrl field on announcement)
  const [imageUrl, setImageUrl] = useState<string>('');
  const [manualUrl, setManualUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imgPreviewError, setImgPreviewError] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AnnouncementFormValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      type,
      title: '',
      excerpt: '',
      content: '',
      visible: true,
      publishedAt: new Date().toISOString().slice(0, 16),
      expiresAt: '',
    },
  });

  useEffect(() => {
    if (announcement) {
      reset({
        type: announcement.type,
        title: announcement.title,
        excerpt: announcement.excerpt || '',
        content: announcement.content,
        visible: announcement.visible,
        publishedAt: announcement.publishedAt
          ? new Date(announcement.publishedAt).toISOString().slice(0, 16)
          : '',
        expiresAt: announcement.expiresAt
          ? new Date(announcement.expiresAt).toISOString().slice(0, 16)
          : '',
      });
      setImageUrl(announcement.imageUrl || '');
    } else {
      reset({
        type,
        title: '',
        excerpt: '',
        content: '',
        visible: true,
        publishedAt: new Date().toISOString().slice(0, 16),
        expiresAt: '',
      });
      setImageUrl('');
    }
    setManualUrl('');
    setUploadError(null);
    setImgPreviewError(false);
  }, [announcement, type, reset]);

  const mutation = useMutation({
    mutationFn: async (data: AnnouncementFormValues) => {
      const payload: Partial<Announcement> = {
        ...data,
        type: data.type as AnnouncementType,
        imageUrl: imageUrl || undefined,
        excerpt: data.excerpt?.trim() || undefined,
        publishedAt: toIsoDateString(data.publishedAt),
        expiresAt: toIsoDateString(data.expiresAt),
      };

      if (isEdit && announcement) {
        return announcementsApi.update(announcement.id, payload);
      }
      return announcementsApi.create(payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['announcements'] });
      onClose();
      reset();
    },
    onError: (error) => {
      console.error('Failed to save announcement:', error);
    },
  });

  const onSubmit = (data: AnnouncementFormValues) => {
    mutation.mutate(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setImgPreviewError(false);

    try {
      const file = files[0];
      const response = await uploadsApi.upload(file);
      if (response?.data?.url) {
        setImageUrl(response.data.url);
      } else {
        setUploadError('Došlo je do greške prilikom čuvanja fajla.');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errMsg = error.response?.data?.message || 'Greška prilikom otpremanja slike.';
      setUploadError(errMsg);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddManualUrl = () => {
    const url = manualUrl.trim();
    if (url) {
      setImageUrl(url);
      setManualUrl('');
      setImgPreviewError(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Izmeni objavu' : `Dodaj ${type === 'URGENT' ? 'hitnu' : 'aktuelnu'} objavu`}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Naslov *
          </label>
          <input {...register('title')} type="text" className="input" />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kratak opis
          </label>
          <textarea
            {...register('excerpt')}
            rows={2}
            className="input resize-none"
            placeholder="Kratak opis koji će biti prikazan u listi..."
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sadržaj *
          </label>
          <textarea
            {...register('content')}
            rows={6}
            className="input resize-none"
            placeholder="Kompletan sadržaj objave..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slika obaveštenja
          </label>

          {/* Image Preview */}
          {imageUrl && !imgPreviewError ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-gray-200 bg-gray-50 mb-3 group">
              <img
                src={getImageUrl(imageUrl)}
                alt="Preview slike"
                onError={() => setImgPreviewError(true)}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => { setImageUrl(''); setImgPreviewError(false); }}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-90 transition-opacity"
                title="Ukloni sliku"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : imageUrl && imgPreviewError ? (
            <div className="w-full aspect-video rounded-lg border border-gray-200 bg-gray-50 mb-3 flex flex-col items-center justify-center gap-2 text-gray-400">
              <ImageOff className="w-10 h-10" />
              <span className="text-xs">Slika nije dostupna</span>
              <button type="button" onClick={() => setImageUrl('')} className="text-xs text-red-500 hover:underline">
                Ukloni
              </button>
            </div>
          ) : null}

          {/* Upload controls */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-3 items-center">
              <label className={`flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 cursor-pointer font-medium transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{isUploading ? 'Otpremanje...' : 'Izaberi sliku sa računara'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>
            </div>

            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}

            {/* Manual URL input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="input text-sm flex-1"
                placeholder="Ili unesite direktan URL slike..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddManualUrl();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddManualUrl}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all text-sm"
              >
                Postavi
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Published At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Datum objave
            </label>
            <input
              {...register('publishedAt')}
              type="datetime-local"
              className="input"
            />
          </div>

          {/* Expires At */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ističe (opciono)
            </label>
            <input
              {...register('expiresAt')}
              type="datetime-local"
              className="input"
            />
          </div>
        </div>

        {/* Visible */}
        <div className="flex items-center gap-3">
          <input
            {...register('visible')}
            type="checkbox"
            id="announcement-visible"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label
            htmlFor="announcement-visible"
            className="text-sm font-medium text-gray-700"
          >
            Vidljivo na sajtu
          </label>
        </div>

        {/* Error */}
        {mutation.isError && (
          <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-lg">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">Došlo je do greške. Pokušajte ponovo.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <button type="button" onClick={onClose} className="btn-secondary">
            Otkaži
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="btn-primary"
          >
            {mutation.isPending
              ? 'Čuvanje...'
              : isEdit
              ? 'Sačuvaj izmene'
              : 'Dodaj objavu'}
          </button>
        </div>
      </form>
    </Modal>
  );
}