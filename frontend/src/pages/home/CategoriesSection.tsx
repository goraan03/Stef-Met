import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/utils/animations';
import { Link } from 'react-router-dom';
import { 
  Store, Utensils, Snowflake, Wheat, Database, Factory, Layers, ArrowRight
} from 'lucide-react';

const featuredCategories = [
  {
    icon: Store,
    title: 'Kompletne pekare',
    description: 'Profesionalne pećnice, mikseri i kompletne linije za proizvodnju.',
    image: '/images/categories/kompletne-pekare.png'
  },
  {
    icon: Utensils,
    title: 'Pekarska prateća oprema',
    description: 'Sva dodatna oprema i alati neophodni za modernu pekaru.',
    image: '/images/categories/pekarska-oprema.png'
  },
  {
    icon: Snowflake,
    title: 'Hladnjače - komore',
    description: 'Rashladni sistemi i komore za održavanje optimalne temperature.',
    image: '/images/categories/hladnjace-komore.png'
  },
  {
    icon: Wheat,
    title: 'Kompletni mlinovi',
    description: 'Kompletni mlinski sistemi sa svom pratećom opremom.',
    image: '/images/categories/kompletni-mlinovi.png'
  },
  {
    icon: Database,
    title: 'Silosi',
    description: 'Kapaciteti za skladištenje žitarica, brašna i stočne hrane.',
    image: '/images/categories/silosi.png'
  },
  {
    icon: Factory,
    title: 'Tunelske peći',
    description: 'Industrijske tunelske peći za hleb i kolače.',
    image: '/images/categories/tunelske-peci.png'
  },
  {
    icon: Layers,
    title: 'Kompletne linije',
    description: 'Proizvodne linije za pastu, kroasane i kolače.',
    image: '/images/categories/kompletne-linije.png'
  }
];

export function CategoriesSection() {
  return (
    <section className="section bg-dark-surface">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="accent-line mx-auto mb-8" />
          <h2 className="heading-lg mb-6">Istaknute kategorije</h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Najtraženija specijalizovana mašinerija i oprema.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.1, margin: "100px" }}
          className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 mb-16"
        >
          {featuredCategories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </motion.div>

        <div className="flex justify-center">
          <Link to="/proizvodi" className="btn-primary group">
            Prikaži sve kategorije i opremu
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ icon: Icon, title, description, image }: any) {
  return (
    <motion.div
      variants={staggerItem}
      className="card card-hover group cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card via-dark-card/50 to-transparent z-10" />
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 z-20">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-sm">
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-secondary text-sm leading-relaxed flex-1">
          {description}
        </p>
      </div>
    </motion.div>
  );
}