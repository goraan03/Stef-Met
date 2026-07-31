import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="relative bg-dark-surface border-b border-white/5 overflow-hidden">
      <div className="absolute inset-0 grain-overlay opacity-30" />
      <div className="container section relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="accent-line mb-8" />
          <h1 className="heading-lg mb-6">{title}</h1>
          {description && (
            <p className="text-xl text-secondary max-w-2xl">
              {description}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}