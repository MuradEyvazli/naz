import { motion } from 'motion/react';
import { useState } from 'react';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  service: string;
  text: string;
  rating: number;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Ayşe K.',
    service: 'Astroloji Danışmanlığı',
    text: 'Naz Hanım ile yaptığım astroloji seansı hayatıma bambaşka bir bakış açısı kazandırdı. Doğum haritam hakkında öğrendiklerim, kendimi daha iyi tanımamı sağladı.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Mehmet Y.',
    service: 'Yaşam Koçluğu',
    text: 'Kariyer değişikliği yaparken çok zorlanıyordum. Aldığım koçluk seansları sayesinde hedeflerimi netleştirdim ve hayallerimin peşinden gitme cesareti buldum.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Zeynep A.',
    service: 'Spiritüel Koçluk',
    text: 'İç huzuru arıyordum ve Naz Hanım bana bu yolculukta rehberlik etti. Meditasyon pratikleri ve spiritüel farkındalık çalışmaları hayatımı değiştirdi.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Can D.',
    service: 'Psikolojik Danışmanlık',
    text: 'Zor bir dönemden geçerken aldığım destek paha biçilemezdi. Profesyonel ve empatik yaklaşımı sayesinde kendimi güvende hissettim.',
    rating: 5,
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto relative">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400/80 text-sm tracking-[0.2em] uppercase mb-3 block">
            Danışan Yorumları
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-white">
            Mutlu Danışanlarımız
          </h2>
        </motion.div>

        {/* Testimonial card */}
        <div className="relative">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4 }}
            className="relative max-w-3xl mx-auto"
          >
            <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.06] to-white/[0.02] border border-white/[0.08] backdrop-blur-sm">
              {/* Quote icon */}
              <div className="absolute -top-4 left-8 sm:left-12">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-white" fill="white" />
                </div>
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6 justify-center sm:justify-start">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                  />
                ))}
              </div>

              {/* Text */}
              <p className="text-white/80 text-lg sm:text-xl leading-relaxed mb-8 text-center sm:text-left">
                "{testimonials[activeIndex].text}"
              </p>

              {/* Author */}
              <div className="flex items-center justify-center sm:justify-start gap-4">
                {/* Avatar placeholder */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center">
                  <span className="text-white font-medium">
                    {testimonials[activeIndex].name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {testimonials[activeIndex].name}
                  </p>
                  <p className="text-purple-300/70 text-sm">
                    {testimonials[activeIndex].service}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation arrows */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? 'w-6 bg-purple-500'
                      : 'bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>

            <motion.button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-white/60 hover:text-white hover:bg-white/[0.1] transition-all duration-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
