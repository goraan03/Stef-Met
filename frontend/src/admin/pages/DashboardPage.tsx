import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Tabs } from '../components/ui/Tabs';
import { ProductsTable } from '../components/tables/ProductsTable';
import { AnnouncementsTable } from '../components/tables/AnnouncementsTable';
import { SettingsTable } from '../components/tables/SettingsTable';
import { Factory, LogOut, Package, Bell, Settings } from 'lucide-react';

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('products');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'products', label: 'Oprema', icon: <Package className="w-4 h-4" /> },
    { id: 'announcements', label: 'Objave', icon: <Bell className="w-4 h-4" /> },
    { id: 'settings', label: 'Podešavanja', icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Factory className="w-6 h-6 text-primary-600" />
              <div>
                <h1 className="font-bold text-lg text-gray-900">Stef-Mat Admin</h1>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.email}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
          </div>

          <div className="p-6">
            {activeTab === 'products' && <ProductsTable />}
            {activeTab === 'announcements' && <AnnouncementsTable />}
            {activeTab === 'settings' && <SettingsTable />}
          </div>
        </div>
      </div>
    </div>
  );
}