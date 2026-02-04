import { motion } from 'motion/react';
import { Star, Menu, X, Phone } from 'lucide-react';
import { useState } from 'react';

// WhatsApp icon component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

interface NavigationProps {
  currentSection: string;
  onNavigate: (section: string) => void;
}

const PHONE_NUMBER = '+905075091377';
const WHATSAPP_LINK = `https://wa.me/905075091377`;
const PHONE_LINK = `tel:${PHONE_NUMBER}`;

export function Navigation({ currentSection, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Ana Sayfa' },
    { id: 'blog', label: 'Blog' },
    { id: 'about', label: 'Hakkımda' },
    { id: 'contact', label: 'İletişim' },
  ];

  const handleNavClick = (section: string) => {
    onNavigate(section);
    setMobileMenuOpen(false);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 sm:gap-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavClick('home')}
          >
            {/* Logo icon */}
            <div className="relative">
              <motion.div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(168, 85, 247, 0.4)',
                    '0 0 30px rgba(236, 72, 153, 0.6)',
                    '0 0 20px rgba(168, 85, 247, 0.4)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Star className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="white" />
              </motion.div>
            </div>

            {/* Logo text */}
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-light tracking-[0.2em] text-white">
                NAZ
              </span>
              <span className="text-[8px] sm:text-[10px] font-light tracking-[0.15em] text-purple-300 opacity-80 uppercase">
                Astroloji Koçluğu
              </span>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-sm tracking-wider transition-colors ${
                  currentSection === item.id
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {item.label}
                {currentSection === item.id && (
                  <motion.div
                    className="h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 mt-1"
                    layoutId="activeSection"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            ))}

            {/* Divider */}
            <div className="w-px h-6 bg-white/20" />

            {/* WhatsApp Button */}
            <motion.a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-full text-green-400 hover:text-green-300 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="WhatsApp ile iletişime geç"
            >
              <WhatsAppIcon className="w-5 h-5" />
              <span className="text-sm hidden lg:inline">WhatsApp</span>
            </motion.a>

            {/* Phone Button */}
            <motion.a
              href={PHONE_LINK}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-full text-purple-400 hover:text-purple-300 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Telefon ile ara"
            >
              <Phone className="w-5 h-5" />
              <span className="text-sm hidden lg:inline">Ara</span>
            </motion.a>
          </div>

          {/* Mobile - WhatsApp & Menu */}
          <div className="flex md:hidden items-center gap-2">
            {/* WhatsApp Button Mobile */}
            <motion.a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-green-500/20 border border-green-500/30 rounded-full text-green-400"
              whileTap={{ scale: 0.95 }}
            >
              <WhatsAppIcon className="w-5 h-5" />
            </motion.a>

            {/* Phone Button Mobile */}
            <motion.a
              href={PHONE_LINK}
              className="flex items-center justify-center w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400"
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5" />
            </motion.a>

            {/* Mobile Menu Button */}
            <motion.button
              className="text-white p-2"
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden pb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-4 py-2 rounded-lg transition-colors ${
                    currentSection === item.id
                      ? 'text-white bg-white/10'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.label}
                </motion.button>
              ))}

              {/* Mobile Contact Links */}
              <div className="flex gap-3 px-4 pt-3 border-t border-white/10">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400"
                >
                  <WhatsAppIcon className="w-5 h-5" />
                  <span className="text-sm">WhatsApp</span>
                </a>
                <a
                  href={PHONE_LINK}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl text-purple-400"
                >
                  <Phone className="w-5 h-5" />
                  <span className="text-sm">Ara</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
