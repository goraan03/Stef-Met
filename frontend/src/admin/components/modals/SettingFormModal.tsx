import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '@/api/endpoints';
import { Modal } from '../ui/Modal';
import { AlertCircle } from 'lucide-react';
import type { Setting } from '@/types';

interface SettingFormValues {
  value: string;
  description: string;
}

interface SettingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  setting: Setting;
}

export function SettingFormModal({ isOpen, onClose, setting }: SettingFormModalProps) {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm<SettingFormValues>({
    defaultValues: {
      value: '',
      description: '',
    },
  });

  useEffect(() => {
    if (setting) {
      reset({
        value: setting.value,
        description: setting.description || '',
      });
    }
  }, [setting, reset]);

  const mutation = useMutation({
    mutationFn: (data: SettingFormValues) => {
      return settingsApi.update(setting.key, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      onClose();
    },
  });

  const onSubmit = (data: SettingFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Izmeni podešavanje" size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Key (Read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ključ
          </label>
          <input
            type="text"
            value={setting.key}
            disabled
            className="input bg-gray-50 text-gray-500"
          />
        </div>

        {/* Value */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vrednost *
          </label>
          <textarea
            {...register('value', { required: true })}
            rows={4}
            className="input resize-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opis
          </label>
          <input {...register('description')} type="text" className="input" />
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
            {mutation.isPending ? 'Čuvanje...' : 'Sačuvaj'}
          </button>
        </div>
      </form>
    </Modal>
  );
}