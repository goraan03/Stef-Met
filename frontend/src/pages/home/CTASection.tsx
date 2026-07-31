import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function CTASection() {
  return (
    <section className="section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <div className="bg-dark-surface border border-white/5 p-12 md:p-20 ml-8">
            <div className="max-w-3xl">
              <h2 className="heading-md mb-6">
                Spremni da unapredite proizvodnju?
              </h2>
              <p className="text-xl text-secondary mb-10 leading-relaxed">
                Kontaktirajte naš tim i razgovarajte o vašim potrebama za opremom.
                Prilagođavamo rešenja za poslovanja svih veličina.
              </p>
              <Link
                to="/kontakt"
                className="btn-primary text-lg inline-flex items-center gap-3 group"
              >
                Kontaktirajte nas
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}