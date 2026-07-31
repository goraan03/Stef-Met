import { motion } from 'framer-motion';
import { Award, Globe, Shield } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/utils/animations';

const features = [
  {
    icon: Award,
    title: '30 godina iskustva',
    description: 'Tri decenije stručnosti u prodaji industrijske opreme i međunarodnoj trgovini'
  },
  {
    icon: Shield,
    title: 'Garantovano kvalitet',
    description: 'Pažljivo odabrana oprema od pouzdanih proizvođača širom sveta'
  },
  {
    icon: Globe,
    title: 'Međunarodna mreža',
    description: 'Uspostavljena partnerska mreža u Evropi, Bliskom istoku i Severnoj Africi'
  },
];

export function WhyChooseSection() {
  return (
    <section className="section bg-dark-surface">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <div className="accent-line mx-auto mb-8" />
          <h2 className="heading-lg mb-6">Zašto izabrati Stef-Mat</h2>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-dark-card border border-white/10 mb-8 group-hover:border-primary transition-all duration-500">
                <feature.icon className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-secondary text-lg leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}