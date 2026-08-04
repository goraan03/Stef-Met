import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Factory, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { getImageUrl } from '@/utils/format';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = getImageUrl(product.images[0]);

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/proizvodi/${product.slug}`} className="card card-hover block group overflow-hidden">
        <div className="relative aspect-[4/3] bg-dark-bg overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Factory className="w-16 h-16 text-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/20 to-transparent opacity-60" />
          
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary text-white text-xs font-semibold uppercase tracking-wider">
              {product.category.name}
            </span>
          </div>
        </div>
        
        <div className="p-6">
          <h3 className="font-bold text-xl mb-3 text-white group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          {product.description && (
            <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
            <span>Pogledaj detalje</span>
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}