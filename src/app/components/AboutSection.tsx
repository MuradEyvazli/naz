import { motion } from 'motion/react';
import { Heart, Sparkles, Moon, Sun } from 'lucide-react';

import { ImageWithFallback } from './ui/ImageWithFallback';

interface AboutSectionProps {
  onNavigate: (section: string) => void;
}

export function AboutSection({ onNavigate }: AboutSectionProps) {
  const services = [
    {
      icon: Moon,
      title: 'Astroloji Danışmanlığı',
      description: 'Doğum haritanız üzerinden kişilik analizi, gelecek yorumları ve yıldızların rehberliği',
    },
    {
      icon: Heart,
      title: 'Psikoloji & Terapi',
      description: 'Duygusal sağlığınız ve iç huzurunuz için profesyonel psikolojik destek',
    },
    {
      icon: Sparkles,
      title: 'Spiritüel Koçluk',
      description: 'Ruhsal gelişim ve bilinç genişletme yolculuğunuzda rehberlik',
    },
    {
      icon: Sun,
      title: 'Yaşam & Aile Koçluğu',
      description: 'Hayatınızda denge ve uyum için kişisel ve aile danışmanlığı',
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mb-4 sm:mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Hakkımda
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            İç dünyanızı keşfetmenize rehberlik ediyorum.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            className="relative order-1 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Elements */}
              <motion.div
                className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-24 h-24 sm:w-32 sm:h-32 bg-purple-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              <motion.div
                className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-24 h-24 sm:w-32 sm:h-32 bg-pink-500/20 rounded-full blur-3xl"
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.6, 0.3, 0.6],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Photo Frame */}
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm p-2 sm:p-3">
                <ImageWithFallback
                  src="/src/assets/naz-profile.png"
                  alt="Naz - Astroloji ve Spiritüel Koç"
                  className="w-full h-auto rounded-xl sm:rounded-2xl"
                />
              </div>

              {/* Floating Badge */}
              <motion.div
                className="absolute -bottom-4 sm:-bottom-6 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs sm:text-sm tracking-wider shadow-lg shadow-purple-500/50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Profesyonel Koç & Danışman
              </motion.div>
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            className="order-2 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <div className="space-y-4 sm:space-y-6 text-white/80 text-sm sm:text-base leading-relaxed">
              <p>
                Merhaba, ben <span className="text-white font-medium">Naz</span>. Astroloji, psikoloji ve spiritüel 
                danışmanlık alanlarında uzmanlaşmış bir koç olarak, insanların iç dünyalarını 
                keşfetmelerine ve hayatlarında pozitif değişimler yaratmalarına yardımcı oluyorum.
              </p>

              <p>
                Yıldızların dilini çözmek, ruhun derinliklerine inmek ve bireylerin kendi 
                potansiyellerini keşfetmelerine rehberlik etmek benim tutkum. Her danışanımın 
                eşsiz bir yolculuğu olduğuna inanıyor ve bu yolculukta yanlarında olmaktan 
                gurur duyuyorum.
              </p>

              {/* Services Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 sm:pt-6">
                {services.map((service, index) => {
                  const Icon = service.icon;
                  return (
                    <motion.div
                      key={index}
                      className="flex items-start gap-3 p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl hover:border-purple-500/30 transition-all"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                      </div>
                      <div>
                        <h3 className="text-white text-sm sm:text-base mb-1">{service.title}</h3>
                        <p className="text-white/60 text-xs sm:text-sm">{service.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA */}
              <motion.div
                className="pt-4 sm:pt-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <motion.button
                  onClick={() => onNavigate('contact')}
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm sm:text-base tracking-wider"
                  whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  BİRLİKTE ÇALIŞALIM
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}