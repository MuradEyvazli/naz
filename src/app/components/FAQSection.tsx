import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: 'Astroloji danışmanlığı nasıl işliyor?',
    answer: 'Astroloji danışmanlığında doğum tarihi, saati ve yerinizi kullanarak kişisel doğum haritanızı çıkarıyorum. Bu harita üzerinden karakteriniz, güçlü yönleriniz, potansiyeliniz ve yaşam yolculuğunuz hakkında detaylı bilgiler paylaşıyorum. Seanslar online veya yüz yüze gerçekleştirilebilir.',
  },
  {
    question: 'Bir seans ne kadar sürüyor?',
    answer: 'Standart danışmanlık seansları 60 dakika sürmektedir. İlk görüşmelerde veya kapsamlı doğum haritası analizlerinde bu süre 90 dakikaya kadar uzayabilir. Süre, seçtiğiniz hizmet türüne göre değişiklik gösterebilir.',
  },
  {
    question: 'Online görüşme yapabiliyor muyuz?',
    answer: 'Evet, tüm danışmanlık hizmetlerimi online olarak da sunuyorum. Zoom, Google Meet veya WhatsApp görüntülü görüşme üzerinden seanslarımızı gerçekleştirebiliriz. Online seanslar yüz yüze seanslarla aynı kalitede ve etkide olmaktadır.',
  },
  {
    question: 'Hangi konularda destek alabiliyorum?',
    answer: 'Kariyer ve iş hayatı, ilişkiler ve aşk hayatı, kişisel gelişim, yaşam amacı keşfi, stres ve kaygı yönetimi, önemli kararlar öncesi rehberlik gibi birçok konuda destek alabilirsiniz. İhtiyacınıza göre astroloji, psikoloji veya koçluk yaklaşımlarından uygun olanı birlikte belirleriz.',
  },
  {
    question: 'Randevu nasıl alabilirim?',
    answer: 'İletişim sayfasındaki formu doldurarak veya doğrudan WhatsApp üzerinden benimle iletişime geçebilirsiniz. Size en kısa sürede dönüş yaparak uygun randevu saatlerini paylaşırım. Randevular genellikle 1-2 hafta içinde planlanabilmektedir.',
  },
  {
    question: 'Ücretlendirme nasıl yapılıyor?',
    answer: 'Ücretler hizmet türüne ve seans süresine göre değişmektedir. İlk görüşme için özel bir tanışma ücreti uygulanmaktadır. Detaylı fiyat bilgisi için benimle iletişime geçebilirsiniz. Paket seçenekleri ile daha uygun fiyatlardan yararlanabilirsiniz.',
  },
];

function FAQItem({ faq, isOpen, onClick }: { faq: FAQ; isOpen: boolean; onClick: () => void }) {
  return (
    <motion.div
      className="border-b border-white/[0.06] last:border-b-0"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <button
        onClick={onClick}
        className="w-full py-5 sm:py-6 flex items-start justify-between gap-4 text-left group"
      >
        <span className="text-white/90 text-base sm:text-lg group-hover:text-white transition-colors duration-300">
          {faq.question}
        </span>
        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-white/[0.05] flex items-center justify-center text-purple-400 group-hover:bg-purple-500/20 transition-all duration-300">
          {isOpen ? (
            <Minus className="w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-white/60 text-sm sm:text-base leading-relaxed pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative py-20 sm:py-28 px-4 overflow-hidden">
      <div className="max-w-3xl mx-auto relative">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-purple-400/80 text-sm tracking-[0.2em] uppercase mb-3 block">
            Sıkça Sorulan Sorular
          </span>
          <h2 className="text-3xl sm:text-4xl font-light text-white mb-4">
            Merak Edilenler
          </h2>
          <p className="text-white/50 max-w-lg mx-auto">
            Danışanlarımın en çok sorduğu sorular ve yanıtları
          </p>
        </motion.div>

        {/* FAQ list */}
        <motion.div
          className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 sm:p-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
            />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.p
          className="text-center mt-8 text-white/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Başka sorularınız mı var?{' '}
          <a href="#contact" className="text-purple-400 hover:text-purple-300 transition-colors">
            İletişime geçin
          </a>
        </motion.p>
      </div>
    </section>
  );
}
