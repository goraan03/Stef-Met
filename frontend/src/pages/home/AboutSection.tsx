import { motion } from 'framer-motion';
import { slideInLeft, slideInRight } from '@/utils/animations';

export function AboutSection() {
  return (
    <section className="section">
      <div className="container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div {...slideInLeft} viewport={{ once: true }}>
            <div className="accent-line mb-8" />
            <h2 className="heading-md mb-6">
              Industrijska izvrsnost<br />preko granica
            </h2>
            <div className="space-y-6 text-lg text-secondary leading-relaxed">
              <p>
                Od 1994. godine, Stef-Mat je pouzdan partner u oblasti industrijske opreme za prehrambenu industriju.
                Bazirani smo u Italiji i specijalizovani smo za uvoz, izvoz i brokerske usluge visokokvalitetne opreme.
              </p>
              <p>
                U našem portfoliju nalaze se oprema za pekare, poslastičarnice, mlinove i kompletne industrijske linije za proizvodnju hrane.
                Usluge pružamo više od 2.000 zadovoljnih kupaca u 20+ zemalja.
              </p>
              <p>
                Od Austrije i Nemačke do Bliskog istoka i Severne Afrike, naša oprema posluje u različitim tržištima,
                pružajući pouzdanost i performanse tamo gde su najpotrebnije.
              </p>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div 
            {...slideInRight} 
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] bg-dark-card border border-white/10 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2940"
                alt="Industrial Equipment"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 border-4 border-primary" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}