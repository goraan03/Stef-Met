import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-bg/50 to-dark-bg z-10" />
        <div 
          className="w-full h-full bg-cover bg-center grain-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1565008576549-57569a49371d?q=80&w=2940')",
          }}
        />
      </motion.div>

      {/* Content */}
      <motion.div 
        style={{ opacity }}
        className="container relative z-20 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="accent-line mx-auto mb-8"
          />
          
          <h1 className="heading-xl mb-8 text-balance">
            POUZDANA INDUSTRIJSKA<br />OPREMA OD 1994.
          </h1>
          
          <p className="text-xl md:text-2xl text-secondary max-w-3xl mx-auto mb-12 leading-relaxed">
            Profesionalna oprema za pekare, poslastičarnice i prehrambenu industriju.
            Međunarodni kvalitet. Dokazano iskustvo.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/proizvodi" className="btn-primary text-lg">
              Pogledaj opremu
            </Link>
            <Link to="/kontakt" className="btn-secondary text-lg">
              Kontaktiraj nas
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="flex flex-col items-center gap-2 text-secondary"
        >
          <span className="text-sm uppercase tracking-wider">Skroluj</span>
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.div>
    </section>
  );
}