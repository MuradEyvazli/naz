import { motion } from 'motion/react';
import { Heart, Sparkles, Moon, Sun } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (section: string) => void;
}

export function HeroSection({ onNavigate }: HeroSectionProps) {
  const services = [
    {
      icon: Moon,
      label: 'Astroloji',
      description: 'Yıldızların rehberliği'
    },
    {
      icon: Heart,
      label: 'Psikoloji',
      description: 'İç dünyanızı anlayın'
    },
    {
      icon: Sparkles,
      label: 'Spiritüel Koçluk',
      description: 'Ruhsal farkındalık'
    },
    {
      icon: Sun,
      label: 'Yaşam Koçluğu',
      description: 'Hayatınızı dönüştürün'
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 md:pt-20">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Main Title */}
          <motion.h1
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-light mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Kendinizi Benimle Keşfedin
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-white/80 mb-6 sm:mb-8 tracking-wider px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Astroloji • Psikoloji • Spiritüel Danışmanlık
          </motion.p>

          {/* Description */}
          <motion.p
            className="text-sm sm:text-base md:text-lg text-white/60 max-w-2xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            İç dünyanızı keşfedin, hayatınızı dönüştürün. Astroloji, psikoloji ve
            spiritüel rehberlik ile kendinize doğru bir yolculuğa çıkın.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <motion.button
              onClick={() => onNavigate('contact')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm sm:text-base tracking-wider"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              İLETİŞİME GEÇİN
            </motion.button>

            <motion.button
              onClick={() => onNavigate('blog')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm sm:text-base tracking-wider"
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
              whileTap={{ scale: 0.95 }}
            >
              BLOGLARI OKUYUN
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Services Section - Redesigned */}
        <motion.div
          className="mt-20 sm:mt-28 md:mt-32"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          {/* Section divider */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent to-purple-500/50" />
            <span className="text-purple-300/60 text-xs tracking-[0.3em] uppercase">Hizmetlerim</span>
            <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto px-4">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.label}
                  className="group relative"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 + index * 0.15 }}
                >
                  <motion.div
                    className="relative p-5 sm:p-6 rounded-2xl bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-sm border border-white/[0.08] hover:border-purple-500/30 transition-all duration-500 cursor-pointer overflow-hidden"
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/0 to-purple-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/5 transition-all duration-500 rounded-2xl" />

                    {/* Icon */}
                    <div className="relative mb-4">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 mx-auto rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/10 flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-pink-500/20 transition-all duration-500">
                        <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-purple-300 group-hover:text-purple-200 transition-colors duration-300" strokeWidth={1.5} />
                      </div>
                    </div>

                    {/* Label */}
                    <h3 className="relative text-white/90 text-sm sm:text-base font-medium mb-1 group-hover:text-white transition-colors duration-300">
                      {service.label}
                    </h3>

                    {/* Description */}
                    <p className="relative text-white/40 text-xs sm:text-sm group-hover:text-white/60 transition-colors duration-300">
                      {service.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1.5, duration: 0.5 },
            y: { repeat: Infinity, duration: 2, ease: 'easeInOut' }
          }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/50 rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
