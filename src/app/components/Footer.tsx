import { motion } from 'motion/react';
import { Star, Mail, Twitter, Instagram, Facebook } from 'lucide-react';
import { useState } from 'react';
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: 'https://www.instagram.com/naz_dunyasi77' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Mail, label: 'E-posta', href: 'mailto:iletisim@naz.com' },
  ];

  const links = {
    explore: ['Tüm Yazılar', 'Öne Çıkanlar', 'Kategoriler', 'Arşiv'],
    about: ['Hikayem', 'Hizmetler', 'İletişim', 'Randevu'],
    resources: ['Bülten', 'SSS', 'Gizlilik Politikası', 'Kullanım Şartları'],
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-28a62268/newsletter/subscribe`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Bir hata oluştu');
      } else {
        setMessage(data.message);
        setEmail('');
      }
    } catch (err) {
      console.error('Newsletter subscription error:', err);
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative border-t border-white/10 py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter */}
        <motion.div
          className="border-t border-white/10 pt-8 sm:pt-12 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="max-w-md mx-auto lg:mx-0">
            <h3 className="text-white font-light text-lg sm:text-xl mb-2 sm:mb-3 tracking-wide">
              Bültene Abone Olun
            </h3>
            <p className="text-white/60 text-sm mb-3 sm:mb-4">
              Yeni yazıları ve özel içerikleri e-posta ile alın.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 mb-3">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="flex-1 px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 transition-colors disabled:opacity-50 text-sm sm:text-base"
              />
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-sm tracking-wider disabled:opacity-50"
                whileHover={{ scale: loading ? 1 : 1.05, boxShadow: loading ? 'none' : '0 0 30px rgba(168, 85, 247, 0.4)' }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
              >
                {loading ? 'Gönderiliyor...' : 'Abone Ol'}
              </motion.button>
            </form>
            {message && (
              <p className="text-green-400 text-sm">{message}</p>
            )}
            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}
          </div>
        </motion.div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-12 mb-8 sm:mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <motion.div
              className="flex items-center gap-3 mb-4 sm:mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl sm:text-2xl font-light tracking-[0.2em] text-white">
                NAZ
              </span>
            </motion.div>
            
            <p className="text-white/60 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
              Astroloji, psikoloji ve spiritüel danışmanlık ile iç dünyanızı keşfedin. 
              Hayatınızı dönüştürmek için birlikte çalışalım.
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3 sm:gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:border-purple-500/50 transition-colors"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-light mb-3 sm:mb-4 text-sm sm:text-base">Keşfet</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              {links.explore.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-light mb-3 sm:mb-4 text-sm sm:text-base">Hakkımda</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              {links.about.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-light mb-3 sm:mb-4 text-sm sm:text-base">Kaynaklar</h4>
            <ul className="space-y-2 text-sm sm:text-base">
              {links.resources.map((link, index) => (
                <li key={index}>
                  <a href="#" className="text-white/60 hover:text-white transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 text-xs sm:text-sm">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Naz. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Gizlilik Politikası
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Kullanım Şartları
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}