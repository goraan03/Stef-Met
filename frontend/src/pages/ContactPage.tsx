import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/api/endpoints';
import { PageHeader } from '@/components/UI/PageHeader';
import { ContactForm } from '@/components/Contact/ContactForm';
import { Mail, Phone, MapPin, Clock, Globe } from 'lucide-react';

export function ContactPage() {
    const { data: settingsResponse } = useQuery({
        queryKey: ['settings', 'public'],
        queryFn: settingsApi.getPublic,
    });

    const settings = settingsResponse?.data || [];
    const getValue = (key: string) => settings.find((s) => s.key === key)?.value || '';

    return (
        <div>
            <PageHeader
                title="Kontakt"
                description="Pošaljite nam upit ili nas kontaktirajte za više informacija o našoj opremi"
            />

            <section className="section">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Contact Info */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Kontakt informacije
                            </h2>

                            <div className="space-y-6 mb-8">
                                {getValue('contact_email') && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                                            <a
                                                href={`mailto:${getValue('contact_email')}`}
                                                className="text-primary-600 hover:text-primary-700"
                                            >
                                                {getValue('contact_email')}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {getValue('contact_phone') && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Phone className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Telefon</h3>
                                            <a
                                                href={`tel:${getValue('contact_phone')}`}
                                                className="text-primary-600 hover:text-primary-700"
                                            >
                                                {getValue('contact_phone')}
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {getValue('contact_address') && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Adresa</h3>
                                            <p className="text-gray-600">{getValue('contact_address')}</p>
                                        </div>
                                    </div>
                                )}

                                {getValue('business_hours') && (
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 mb-1">Radno vreme</h3>
                                            <p className="text-gray-600 whitespace-pre-line">
                                                {getValue('business_hours')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="bg-primary-50 border border-primary-100 rounded-xl p-6">
                                <div className="flex items-start gap-3 mb-3">
                                    <Globe className="w-5 h-5 text-primary-600 mt-0.5" />
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Stef-Mat</h3>
                                        <p className="text-sm text-gray-600 mb-2">
                                            Italijanska kompanija osnovana 1994. godine
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600">
                                    Specijalizovani smo za import, export i prodaju industrijske opreme
                                    za prehrambenu industriju. Naša oprema se koristi u više od 15 zemalja
                                    širom sveta.
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="card p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                Pošaljite nam upit
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Popunite formu i kontaktiraćemo vas u najkraćem mogućem roku
                            </p>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}