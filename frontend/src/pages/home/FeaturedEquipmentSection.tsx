import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/endpoints';
import { ProductCard } from '@/components/Products/ProductCard';
import { LoadingSpinner } from '@/components/UI/LoadingSpinner';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/utils/animations';

export function FeaturedEquipmentSection() {
  const { data: productsResponse, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsApi.getAll({ visible: true }),
  });

  const products = productsResponse?.data.slice(0, 6) || [];

  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-16"
        >
          <div>
            <div className="accent-line mb-8" />
            <h2 className="heading-lg mb-4">Istaknuta oprema</h2>
            <p className="text-xl text-secondary">
              Istražite našu trenutnu ponudu
            </p>
          </div>
          <Link
            to="/proizvodi"
            className="hidden md:flex items-center gap-2 text-primary hover:gap-4 transition-all group"
          >
            <span className="font-semibold">Pogledaj sve</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>

        {isLoading ? (
          <LoadingSpinner />
        ) : (
          <>
            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {products.map((product) => (
                <motion.div key={product.id} variants={staggerItem}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>

            <div className="mt-12 text-center md:hidden">
              <Link to="/proizvodi" className="btn-primary">
                Pogledaj svu opremu
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}