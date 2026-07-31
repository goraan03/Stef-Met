import { motion } from 'framer-motion';
import { useCounter } from '@/utils/counter';

const stats = [
  { value: 1994, label: 'Osnovani', suffix: '' },
  { value: 2000, label: 'Zadovoljnih kupaca', suffix: '+' },
  { value: 20, label: 'Zemalja izvoza', suffix: '+' },
  { value: 30, label: 'Godina iskustva', suffix: '+' },
];

export function StatsSection() {
  return (
    <section className="section bg-dark-surface">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatCard({ value, label, suffix, index }: { value: number; label: string; suffix: string; index: number }) {
  const { count, ref } = useCounter(value);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="text-center"
    >
      <div className="heading-lg text-primary mb-3">
        {count}{suffix}
      </div>
      <div className="text-secondary uppercase tracking-wider text-sm">
        {label}
      </div>
    </motion.div>
  );
}