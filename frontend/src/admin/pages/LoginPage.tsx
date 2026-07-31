import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/endpoints';
import { useAuthStore } from '../store/authStore';
import { Factory, AlertCircle } from 'lucide-react';

interface LoginFormValues {
  email: string;
  password: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (response) => {
      const { access_token, user } = response.data;
      setAuth(access_token, user);
      navigate('/admin');
    },
    onError: () => {
      setError('Pogrešan email ili lozinka');
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    setError('');
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Factory className="w-10 h-10 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Stef-Mat</h1>
          </div>
          <h2 className="text-xl text-gray-600">Admin prijava</h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email je obavezan',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Nevalidan email',
                  },
                })}
                type="email"
                className="input"
                placeholder="vas@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lozinka
              </label>
              <input
                {...register('password', { required: 'Lozinka je obavezna' })}
                type="password"
                className="input"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary w-full"
            >
              {mutation.isPending ? 'Prijavljivanje...' : 'Prijavi se'}
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}