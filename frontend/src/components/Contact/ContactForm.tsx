import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { messagesApi } from '@/api/endpoints';
import { contactSchema, type ContactFormValues } from '@/utils/validation';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function ContactForm() {
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const mutation = useMutation({
        mutationFn: messagesApi.create,
        onSuccess: () => {
            setSubmitStatus('success');
            reset();
            setTimeout(() => setSubmitStatus('idle'), 5000);
        },
        onError: () => {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 5000);
        },
    });

    const onSubmit = async (data: ContactFormValues) => {
        mutation.mutate(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Ime i prezime *
                </label>
                <input
                    {...register('name')}
                    type="text"
                    id="name"
                    className="input"
                    placeholder="Vaše ime"
                />
                {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                </label>
                <input
                    {...register('email')}
                    type="email"
                    id="email"
                    className="input"
                    placeholder="vas@email.com"
                />
                {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
            </div>

            {/* Phone */}
            <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                </label>
                <input
                    {...register('phone')}
                    type="tel"
                    id="phone"
                    className="input"
                    placeholder="+381 64 123 4567"
                />
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Poruka *
                </label>
                <textarea
                    {...register('message')}
                    id="message"
                    rows={5}
                    className="input resize-none"
                    placeholder="Vaša poruka..."
                />
                {errors.message && (
                    <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                )}
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                disabled={mutation.isPending}
                className="btn-primary w-full"
            >
                {mutation.isPending ? (
                    <>Šaljem...</>
                ) : (
                    <>
                        <Send className="w-4 h-4" />
                        Pošalji poruku
                    </>
                )}
            </button>

            {/* Success Message */}
            {submitStatus === 'success' && (
                <div className="flex items-center gap-2 p-4 bg-green-50 text-green-800 rounded-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <p>Poruka je uspešno poslata! Odgovorićemo uskoro.</p>
                </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
                <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <p>Došlo je do greške. Pokušajte ponovo.</p>
                </div>
            )}
        </form>
    );
}