import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from '@/components/Layout/Layout';
import { ScrollToTop } from '@/components/ScrollToTop';
import { HomePage } from '@/pages/HomePage';
import { ProductsPage } from '@/pages/ProductsPage';
import { ProductDetailPage } from '@/pages/ProductDetailPage';
import { AktuelnoPage } from '@/pages/AktuelnoPage';
import { HitnoPage } from '@/pages/HitnoPage';
import { AnnouncementDetailPage } from '@/pages/AnnouncementDetailPage';
import { ContactPage } from '@/pages/ContactPage';

// Admin
import { LoginPage } from '@/admin/pages/LoginPage';
import { DashboardPage } from '@/admin/pages/DashboardPage';
import { ProtectedRoute } from '@/admin/components/ProtectedRoute';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/proizvodi" element={<ProductsPage />} />
                  <Route path="/proizvodi/:slug" element={<ProductDetailPage />} />
                  <Route path="/aktuelno" element={<AktuelnoPage />} />
                  <Route path="/aktuelno/:slug" element={<AnnouncementDetailPage />} />
                  <Route path="/hitno" element={<HitnoPage />} />
                  <Route path="/hitno/:slug" element={<AnnouncementDetailPage />} />
                  <Route path="/kontakt" element={<ContactPage />} />
                </Routes>
              </Layout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;