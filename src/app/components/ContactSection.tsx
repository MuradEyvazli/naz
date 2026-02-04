import { motion } from 'motion/react';
import { Instagram, Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import { useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const contactInfo = [
    {
      icon: Instagram,
      title: 'Instagram',
      value: '@naz_dunyasi77',
      link: 'https://www.instagram.com/naz_dunyasi77',
      color: 'from-pink-500 to-purple-500',
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: '+90 507 509 1377',
      link: 'tel:+905075091377',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: Mail,
      title: 'E-posta',
      value: 'iletisim@naz.com',
      link: 'mailto:iletisim@naz.com',
      color: 'from-orange-500 to-pink-500',
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      value: 'Hafta içi 09:00 - 18:00',
      link: null,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28a62268/contact/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Bir hata oluştu');
      } else {
        setSuccessMessage(data.message);
        setFormData({ name: '', email: '', phone: '', message: '' });
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setErrorMessage('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
            İletişime Geçin
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed px-4">
            Sorularınız için benimle iletişime geçebilir, seanslarınızı planlayabilir 
            veya hizmetlerim hakkında detaylı bilgi alabilirsiniz.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16 lg:mb-20">
          {/* Contact Info Cards */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              const content = (
                <motion.div
                  className="group relative p-4 sm:p-6 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl hover:border-purple-500/30 transition-all duration-500"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${info.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white/60 text-xs sm:text-sm mb-1">{info.title}</h3>
                      <p className="text-white text-base sm:text-lg group-hover:text-purple-300 transition-colors break-words">
                        {info.value}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );

              return info.link ? (
                <a key={index} href={info.link} target="_blank" rel="noopener noreferrer">
                  {content}
                </a>
              ) : (
                <div key={index}>{content}</div>
              );
            })}

            {/* Additional info */}
            <motion.div
              className="p-6 sm:p-8 bg-gradient-to-br from-purple-900/20 to-pink-900/20 border border-purple-500/20 rounded-xl sm:rounded-2xl"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3 className="text-lg sm:text-xl font-light text-white mb-4">Neden Benimle Çalışmalısınız?</h3>
              <ul className="space-y-3 text-sm sm:text-base text-white/70">
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✦</span>
                  <span>Kişiye özel astroloji analizi</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✦</span>
                  <span>Profesyonel psikolojik destek</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✦</span>
                  <span>Spiritüel gelişim rehberliği</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-400 mt-1">✦</span>
                  <span>Yaşam ve aile koçluğu</span>
                </li>
              </ul>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            className="p-6 sm:p-8 bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-xl sm:text-2xl font-light text-white mb-4 sm:mb-6">Mesaj Gönderin</h3>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <label htmlFor="name" className="block text-white/70 text-sm mb-2">
                  Adınız Soyadınız
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors text-sm sm:text-base"
                  placeholder="Adınızı yazın"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white/70 text-sm mb-2">
                  E-posta Adresiniz
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors text-sm sm:text-base"
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-white/70 text-sm mb-2">
                  Telefon Numaranız
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors text-sm sm:text-base"
                  placeholder="+90 5XX XXX XX XX"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white/70 text-sm mb-2">
                  Mesajınız
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors resize-none text-sm sm:text-base"
                  placeholder="Mesajınızı buraya yazın..."
                  required
                />
              </div>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-xs sm:text-sm"
                >
                  {errorMessage}
                </motion.div>
              )}

              {successMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 sm:p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-300 text-xs sm:text-sm"
                >
                  {successMessage}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white flex items-center justify-center gap-2 disabled:opacity-50 text-sm sm:text-base"
                whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 0 40px rgba(168, 85, 247, 0.4)' }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
              >
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="tracking-wider">
                  {loading ? 'GÖNDERİLİYOR...' : 'MESAJ GÖNDER'}
                </span>
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          className="relative p-8 sm:p-12 bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/30 rounded-2xl sm:rounded-3xl overflow-hidden text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl sm:text-3xl font-light text-white mb-3 sm:mb-4">Yolculuğunuz Bugün Başlasın</h3>
          <p className="text-base sm:text-lg text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            İç dünyanızı keşfetmeye ve hayatınızda pozitif değişimler yaratmaya hazır mısınız? 
            Benimle iletişime geçin ve birlikte çalışalım.
          </p>
          <motion.a
            href="https://www.instagram.com/naz_dunyasi77"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white text-sm sm:text-base"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="tracking-wider">INSTAGRAM'DA TAKİP EDİN</span>
          </motion.a>

          {/* Decorative elements */}
          <motion.div
            className="absolute -top-10 -right-10 w-32 h-32 sm:w-40 sm:h-40 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}