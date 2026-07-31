import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/api/endpoints';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import stefMatLogo from '/stef-mat-logo.png';

export function Footer() {
  const { data: settingsResponse } = useQuery({
    queryKey: ['settings', 'public'],
    queryFn: settingsApi.getPublic,
  });

  const settings = settingsResponse?.data || [];
  const getValue = (key: string) => settings.find((s) => s.key === key)?.value || '';

  return (
    <footer className="bg-dark-surface border-t border-white/5">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img 
              src={stefMatLogo} 
              alt="Stef-Mat" 
              className="h-12 w-auto mb-6"
            />
            <p className="text-secondary max-w-md leading-relaxed">
              {getValue('site_description') ||
                'Profesionalna industrijska oprema za prehrambenu industriju od 1994. godine. Uvoz, izvoz i prodaja opreme za pekare, poslastičarnice i mlinove.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-6 text-lg">Brzi linkovi</h3>
            <ul className="space-y-3">
              {['Proizvodi', 'Aktuelno', 'Hitno', 'Kontakt'].map((item) => (
                <li key={item}>
                  <Link
                    to={`/${item === 'Proizvodi' ? 'proizvodi' : item === 'Aktuelno' ? 'aktuelno' : item === 'Hitno' ? 'hitno' : 'kontakt'}`}
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-6 text-lg">Kontakt</h3>
            <ul className="space-y-4">
              {getValue('contact_email') && (
                <li className="flex items-start gap-3 text-secondary">
                  <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <a
                    href={`mailto:${getValue('contact_email')}`}
                    className="hover:text-primary transition-colors"
                  >
                    {getValue('contact_email')}
                  </a>
                </li>
              )}
              {getValue('contact_phone') && (
                <li className="flex items-start gap-3 text-secondary">
                  <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <a
                    href={`tel:${getValue('contact_phone')}`}
                    className="hover:text-primary transition-colors"
                  >
                    {getValue('contact_phone')}
                  </a>
                </li>
              )}
              {getValue('contact_address') && (
                <li className="flex items-start gap-3 text-secondary">
                  <MapPin className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{getValue('contact_address')}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary text-sm">
            © {new Date().getFullYear()} Stef-Mat. All rights reserved.
          </p>
          <p className="text-secondary text-sm">
            Pouzdana industrijska oprema od 1994. godine
          </p>
        </div>
      </div>
    </footer>
  );
}