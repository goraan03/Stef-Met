import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/api/endpoints';
import { SettingFormModal } from '../modals/SettingFormModal';
import { Edit } from 'lucide-react';
import type { Setting } from '@/types';

export function SettingsTable() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);

  const { data: settingsResponse, isLoading } = useQuery({
    queryKey: ['settings', 'admin'],
    queryFn: () => settingsApi.getAll(),
  });

  const settings = Array.isArray(settingsResponse?.data) ? settingsResponse.data : [];

  const handleEdit = (setting: Setting) => {
    setSelectedSetting(setting);
    setIsFormOpen(true);
  };

  const settingGroups = {
    'Osnovne informacije': ['site_title', 'site_description'],
    'Kontakt': ['contact_email', 'contact_phone', 'contact_address', 'business_hours'],
    'Društvene mreže': ['social_facebook', 'social_instagram', 'social_linkedin'],
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Podešavanja</h2>

      {isLoading ? (
        <div className="text-center py-12 text-gray-500">Učitavanje...</div>
      ) : (
        <div className="space-y-8">
          {Object.entries(settingGroups).map(([groupName, keys]) => {
            const groupSettings = settings.filter((s: Setting) => keys.includes(s.key));
            if (groupSettings.length === 0) return null;

            return (
              <div key={groupName}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">{groupName}</h3>
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="divide-y divide-gray-200">
                    {groupSettings.map((setting: Setting) => (
                      <div
                        key={setting.id}
                        className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            {setting.key}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {setting.value}
                          </div>
                          {setting.description && (
                            <div className="text-xs text-gray-400 mt-1">
                              {setting.description}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleEdit(setting)}
                          className="ml-4 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Other Settings */}
          {settings.filter((s: Setting) => !Object.values(settingGroups).flat().includes(s.key))
            .length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ostalo</h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {settings
                    .filter((s: Setting) => !Object.values(settingGroups).flat().includes(s.key))
                    .map((setting: Setting) => (
                      <div
                        key={setting.id}
                        className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            {setting.key}
                          </div>
                          <div className="text-sm text-gray-500 line-clamp-2">
                            {setting.value}
                          </div>
                        </div>
                        <button
                          onClick={() => handleEdit(setting)}
                          className="ml-4 p-2 text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {selectedSetting && (
        <SettingFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          setting={selectedSetting}
        />
      )}
    </div>
  );
}