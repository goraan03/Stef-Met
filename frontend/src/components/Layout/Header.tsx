import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import stefMatLogo from '/stef-mat-logo.png';

const navigation = [
  { name: 'Početna', path: '/' },
  { name: 'Proizvodi', path: '/proizvodi' },
  { name: 'Aktuelno', path: '/aktuelno' },
  { name: 'Hitno', path: '/hitno' },
  { name: 'Kontakt', path: '/kontakt' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 50);
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isHomePage = location.pathname === '/';

  return (
    // 1. Dodali smo React Fragment kako bi Header i Meni bili na istom nivou
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hidden && !mobileMenuOpen ? -100 : 0 }} // Ne krijemo header ako je meni otvoren
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 transition-all duration-300 ${
          // 2. Dižemo z-index headera iznad menija kad je otvoren
          mobileMenuOpen ? 'z-[9999]' : 'z-[70]'
        } ${
          scrolled || !isHomePage || mobileMenuOpen // 3. Forisramo pozadinu kad je otvoren meni
            ? 'bg-dark-surface/95 backdrop-blur-xl border-b border-white/5'
            : 'bg-transparent'
        }`}
      >
        <nav className="container">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="relative z-10">
              <img src={stefMatLogo} alt="Stef-Mat" className="h-12 w-auto" />
            </Link>

            <div className="hidden lg:flex items-center gap-12">
              {navigation.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative font-medium transition-colors group ${
                    isActive(item.path) ? 'text-white' : 'text-[#90949A] hover:text-white'
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-[-8px] left-0 h-[2px] bg-primary transition-all duration-300 ${
                      isActive(item.path) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </Link>
              ))}
              <Link
                to="/admin/login"
                className="px-6 py-2.5 border border-white/20 hover:border-primary hover:text-primary transition-all duration-300 font-medium"
              >
                Admin
              </Link>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white hover:text-primary transition-colors relative z-10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* 4. Meni je sada potpuno nezavisan od ograničenja koje postavlja blur na headeru */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            // 5. Meni ima manji z-index (9998) u odnosu na aktivni header (9999)
            className="fixed inset-0 z-[9998] lg:hidden bg-dark-bg/90 backdrop-blur-2xl"
            onClick={() => setMobileMenuOpen(false)}
          >
            {/* 6. Dodat pt-24 (padding top) da linkovi ne bi išli ispod samog headera */}
            <div className="flex min-h-screen items-start justify-center px-6 pt-24 pb-12">
              <div className="flex flex-col items-center gap-8 text-center w-full max-w-sm pt-8">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-3 text-3xl font-bold transition-colors ${
                        isActive(item.path) ? 'text-primary' : 'text-white hover:text-primary'
                      }`}
                    >
                      {item.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navigation.length * 0.1 }}
                  className="pt-4"
                >
                  <Link
                    to="/admin/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-8 py-3 border-2 border-white/20 hover:border-primary text-lg font-semibold transition-all"
                  >
                    Prijava za admina
                  </Link>
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}