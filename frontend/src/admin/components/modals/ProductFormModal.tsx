import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi, categoriesApi, uploadsApi } from '@/api/endpoints';
import { Modal } from '../ui/Modal';
import { AlertCircle, Upload, X, Loader2 } from 'lucide-react';
import type { Product } from '@/types';
import { getImageUrl } from '@/utils/format';

const productSchema = z.object({
  name: z.string().min(2, 'Naziv mora imati najmanje 2 karaktera'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Kategorija je obavezna'),
  images: z.string().optional(),
  visible: z.boolean(),
  order: z.number().min(0),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
}

export function ProductFormModal({ isOpen, onClose, product }: ProductFormModalProps) {
  const queryClient = useQueryClient();
  const isEdit = !!product;
  
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
    enabled: isOpen,
  });

  const categories = categoriesResponse?.data || [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      images: '',
      visible: true,
      order: 0,
    },
  });

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description || '',
        categoryId: product.categoryId,
        images: '',
        visible: product.visible,
        order: product.order,
      });
      setImages(product.images || []);
    } else {
      reset({
        name: '',
        description: '',
        categoryId: '',
        images: '',
        visible: true,
        order: 0,
      });
      setImages([]);
    }
    setUploadError(null);
  }, [product, reset]);

  const mutation = useMutation({
    mutationFn: (data: ProductFormValues) => {
      const payload = {
        ...data,
        images: images,
      };

      if (isEdit && product) {
        return productsApi.update(product.id, payload);
      }
      return productsApi.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      onClose();
      reset();
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    mutation.mutate(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const file = files[0];
      const response = await uploadsApi.upload(file);
      if (response?.data?.url) {
        setImages((prev) => [...prev, response.data.url]);
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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Izmeni opremu' : 'Dodaj opremu'}
      size="lg"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Naziv *
          </label>
          <input {...register('name')} type="text" className="input" />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategorija *
          </label>
          <select {...register('categoryId')} className="input">
            <option value="">Izaberi kategoriju</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opis
          </label>
          <textarea
            {...register('description')}
            rows={4}
            className="input resize-none"
            placeholder="Detaljan opis opreme..."
          />
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slike proizvoda
          </label>
          
          {/* Gallery Preview */}
          {images.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50 group">
                  <img
                    src={getImageUrl(img)}
                    alt={`Preview ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 opacity-90 transition-opacity"
                    title="Ukloni sliku"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic mb-4">Nema dodatih slika.</p>
          )}

          {/* Upload and URL input options */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4 items-center">
              <label className={`flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 cursor-pointer font-medium transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>Izaberi sliku sa računara</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={isUploading}
                />
              </label>

              {isUploading && (
                <span className="text-sm text-gray-600 flex items-center gap-1.5">
                  Otpremanje slike...
                </span>
              )}
            </div>

            {uploadError && (
              <p className="text-sm text-red-600">{uploadError}</p>
            )}

            {/* Manual Link Input */}
            <div className="flex gap-2">
              <input
                type="text"
                id="manual-url-input"
                className="input text-sm flex-1"
                placeholder="Ili unesite direktan URL slike (npr. https://example.com/slika.jpg)"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    const input = e.currentTarget;
                    const url = input.value.trim();
                    if (url) {
                      setImages(prev => [...prev, url]);
                      input.value = '';
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('manual-url-input') as HTMLInputElement;
                  const url = input?.value.trim();
                  if (url) {
                    setImages(prev => [...prev, url]);
                    input.value = '';
                  }
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all text-sm"
              >
                Dodaj link
              </button>
            </div>
          </div>
        </div>

        {/* Order */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Redosled
          </label>
          <input
            {...register('order', { valueAsNumber: true })}
            type="number"
            min="0"
            className="input"
          />
        </div>

        {/* Visible */}
        <div className="flex items-center gap-3">
          <input
            {...register('visible')}
            type="checkbox"
            id="visible"
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
          />
          <label htmlFor="visible" className="text-sm font-medium text-gray-700">
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
              : 'Dodaj opremu'}
          </button>
        </div>
      </form>
    </Modal>
  );
}