import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { productsApi } from '@/api/endpoints';
import { PageHeader } from '@/components/UI/PageHeader';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { ErrorMessage } from '@/components/UI/ErrorMessage';
import { EmptyState } from '@/components/UI/EmptyState';
import { ProductCard } from '@/components/Products/ProductCard';
import { CategoryFilter } from '@/components/Products/CategoryFilter';
import { staggerContainer, staggerItem } from '@/utils/animations';

export function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: productsResponse, isLoading, isError } = useQuery({
    queryKey: ['products', selectedCategory],
    queryFn: () =>
      productsApi.getAll({
        visible: true,
        ...(selectedCategory && { categoryId: selectedCategory }),
      }),
  });

  const products = productsResponse?.data || [];

  return (
    <div>
      <PageHeader
        title="Industrijska oprema"
        description="Profesionalna oprema za prehrambenu industriju"
      />

      <section className="section">
        <div className="container">
          <div className="mb-12">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>

          {isLoading ? (
            <LoadingSpinner />
          ) : isError ? (
            <ErrorMessage />
          ) : products.length === 0 ? (
            <EmptyState message="Nema dostupne opreme u ovoj kategoriji" />
          ) : (
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}