import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/utils/animations';
import { 
  Store, Coffee, Wheat, IceCream, Utensils, ChefHat, 
  Tractor, Droplets, Wind, Database, Snowflake, Heart, 
  Leaf, TreePine, Recycle, Factory, ShoppingCart, Box
} from 'lucide-react';

const categories = [
  {
    icon: Store,
    title: 'Pekare',
    description: 'Profesionalne pećnice, mikseri i kompletne linije za proizvodnju hleba i peciva.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2942'
  },
  {
    icon: Coffee,
    title: 'Poslastičarnice',
    description: 'Savremena oprema za pripremu i izlaganje poslastičarskih proizvoda.',
    image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?q=80&w=2940'
  },
  {
    icon: Wheat,
    title: 'Mlinove',
    description: 'Kompletni mlinski sistemi i tehnologija za preradu svih vrsta žitarica.',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=2940'
  },
  {
    icon: IceCream,
    title: 'Sladolede',
    description: 'Mašine za proizvodnju, mešanje i čuvanje svih vrsta sladoleda.',
    image: 'https://images.unsplash.com/photo-1570197781417-0a523771fb5e?q=80&w=2940'
  },
  {
    icon: Factory,
    title: 'Kasapnice',
    description: 'Profesionalna oprema za obradu, sečenje i čuvanje mesa.',
    image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?q=80&w=2940'
  },
  {
    icon: Utensils,
    title: 'Restorane',
    description: 'Kompletna industrijska kuhinjska oprema prilagođena ugostiteljskim objektima.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?q=80&w=2940'
  },
  {
    icon: Heart,
    title: 'Kolače',
    description: 'Linije za proizvodnju keksa, kolača i sitnih konditorskih proizvoda.',
    image: 'https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?q=80&w=2940'
  },
  {
    icon: ChefHat,
    title: 'Testenine',
    description: 'Sistemi za mešanje, sečenje i sušenje svih vrsta testenina.',
    image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=2940'
  },
  {
    icon: Tractor,
    title: 'Stočnu Hranu',
    description: 'Mašinerija za peletiranje i preradu hrane za životinje.',
    image: 'https://images.unsplash.com/photo-1592982537447-6f233c6767ce?q=80&w=2940'
  },
  {
    icon: Droplets,
    title: 'Linije za Tečne Proizvode',
    description: 'Sistemi za obradu, filtriranje i pakovanje tečnosti.',
    image: 'https://images.unsplash.com/photo-1611078810243-d8c1c5b058c4?q=80&w=2940'
  },
  {
    icon: Wind,
    title: 'Sušare za Žito i Voće',
    description: 'Industrijske sušare velikog kapaciteta za poljoprivredne proizvode.',
    image: 'https://images.unsplash.com/photo-1595856424599-4d24177d46c8?q=80&w=2940'
  },
  {
    icon: Database,
    title: 'Cisterne - Silosi',
    description: 'Kapaciteti za bezbedno skladištenje sirovina i gotovih proizvoda.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2940'
  },
  {
    icon: Snowflake,
    title: 'Hladnjače - Komore',
    description: 'Rashladni sistemi i komore za održavanje optimalne temperature.',
    image: 'https://images.unsplash.com/photo-1585338447937-7082f8fc763d?q=80&w=2940'
  },
  {
    icon: Heart,
    title: 'Bombone',
    description: 'Specijalizovana oprema za izradu i pakovanje tvrdih i mekih bombona.',
    image: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?q=80&w=2940'
  },
  {
    icon: Leaf,
    title: 'Zrnaste Proizvode',
    description: 'Oprema za selekciju, čišćenje i obradu zrnastih kultura.',
    image: 'https://images.unsplash.com/photo-1532054944983-0570b6d2146e?q=80&w=2940'
  },
  {
    icon: TreePine,
    title: 'Drvo',
    description: 'Mašine i alati za primarnu i sekundarnu obradu drveta.',
    image: 'https://images.unsplash.com/photo-1610408544865-c331405e3a89?q=80&w=2940'
  },
  {
    icon: Recycle,
    title: 'Plastiku',
    description: 'Linije za brizganje, ekstruziju i reciklažu plastičnih masa.',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=2940'
  },
  {
    icon: Factory,
    title: 'Asfaltne Baze',
    description: 'Mehanizacija i postrojenja za proizvodnju asfalta.',
    image: 'https://images.unsplash.com/photo-1541888087425-d81bb19240f5?q=80&w=2940'
  },
  {
    icon: Droplets,
    title: 'Perionice',
    description: 'Industrijski sistemi za pranje vozila, tepiha i opreme.',
    image: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?q=80&w=2940'
  },
  {
    icon: ShoppingCart,
    title: 'Marketi',
    description: 'Inventar, police i rashladne vitrine za maloprodajne objekte.',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2940'
  },
  {
    icon: Box,
    title: 'Materijali',
    description: 'Različiti repromaterijali neophodni za industrijsku proizvodnju.',
    image: 'https://images.unsplash.com/photo-1587293852726-59cd15a77464?q=80&w=2940'
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
          className="text-center mb-20"
        >
          <div className="accent-line mx-auto mb-8" />
          <h2 className="heading-lg mb-6">Kategorije opreme</h2>
          <p className="text-xl text-secondary max-w-2xl mx-auto">
            Specijalizovana mašinerija za širok spektar industrijskih grana.
          </p>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </motion.div>
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