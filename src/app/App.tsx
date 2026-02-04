import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StarfieldBackground } from './components/StarfieldBackground';
import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FAQSection } from './components/FAQSection';
import { BlogGrid, type BlogPost } from './components/BlogGrid';
import { BlogArticle } from './components/BlogArticle';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminLogin, AdminDashboard } from './admin';
import { fetchPublishedPosts, fetchPostById, type BlogPost as ApiBlogPost } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth';

// Demo blog posts (API hazır olmadığında kullanılır)
const demoBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Ay Tutulması ve Duygusal Dönüşüm',
    excerpt: 'Ay tutulmaları, duygusal temizlenme ve yeniden doğuş için güçlü kozmik fırsatlar sunar. Bu özel dönemlerde nasıl dönüşeceğinizi keşfedin.',
    image: 'https://images.unsplash.com/photo-1693834289771-fe5f57cc2c27?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMGVjbGlwc2UlMjBjb3JvbmF8ZW58MXx8fHwxNzcwMTUzNDIzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'ASTROLOJİ',
    date: '1 Şubat 2026',
    readTime: '8 dakika okuma',
    featured: true,
  },
  {
    id: '2',
    title: 'Retrogradlar: Geriye Dönüş mü Yoksa İleriye Sıçrayış mı?',
    excerpt: 'Retrograd dönemler kaotik görünse de, aslında iç gözlem ve yeniden değerlendirme için mükemmel fırsatlardır.',
    image: 'https://images.unsplash.com/photo-1625736410948-a984d181b8e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGlyYWwlMjBnYWxheHklMjBhc3Ryb25vbXl8ZW58MXx8fHwxNzcwMTUzNDIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'ASTROLOJİ',
    date: '28 Ocak 2026',
    readTime: '6 dakika okuma',
  },
  {
    id: '3',
    title: 'Ay Burçları ve İç Dünyanız',
    excerpt: 'Ay burcunuz, duygusal tepkilerinizi ve iç dünyınızı yönetir. Kendi ay burcunuzu tanıyarak kendinizi daha iyi anlayabilirsiniz.',
    image: 'https://images.unsplash.com/photo-1648458128705-0f230ff8a71b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFuZXQlMjBzdXJmYWNlJTIwbW9vbnxlbnwxfHx8fDE3NzAxNTM0MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'ASTROLOJİ',
    date: '25 Ocak 2026',
    readTime: '5 dakika okuma',
  },
  {
    id: '4',
    title: 'Çakraların Dengesi ve Enerji Akışı',
    excerpt: 'Çakralarınızı dengelemek, fiziksel ve ruhsal sağlığınız için hayati önem taşır. Her çakranın anlamını ve nasıl dengeleneceğini öğrenin.',
    image: 'https://images.unsplash.com/photo-1444253324313-0dce942d572c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdXJvcmElMjBib3JlYWxpcyUyMHN0YXJzfGVufDF8fHx8MTc3MDE1MzQyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'SPİRİTÜEL',
    date: '20 Ocak 2026',
    readTime: '7 dakika okuma',
  },
  {
    id: '5',
    title: 'Manifestasyon: Düşüncelerinizle Gerçekliği Yaratmak',
    excerpt: 'Düşünceleriniz ve niyetlerinizle hayallerinizi gerçeğe dönüştürmenin gücünü keşfedin.',
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZWJ1bGElMjBzcGFjZSUyMGRlZXAlMjBmaWVsZHxlbnwxfHx8fDE3NzAxMTU3Mjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'SPİRİTÜEL',
    date: '15 Ocak 2026',
    readTime: '6 dakika okuma',
  },
  {
    id: '6',
    title: 'İlişkilerde Astrolojik Uyumluluk',
    excerpt: 'Partnerinizle astrolojik uyumunuzu anlamak, ilişkinizi daha sağlıklı yönetmenize yardımcı olur.',
    image: 'https://images.unsplash.com/photo-1720675009618-a38716724700?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWxreSUyMHdheSUyMG5pZ2h0JTIwc2t5fGVufDF8fHx8MTc3MDE1MzQyM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    category: 'İLİŞKİLER',
    date: '10 Ocak 2026',
    readTime: '9 dakika okuma',
  },
];

// Transform API post to UI format
const transformPost = (apiPost: ApiBlogPost): BlogPost => ({
  id: apiPost.id,
  title: apiPost.title,
  excerpt: apiPost.excerpt,
  image: apiPost.image,
  category: apiPost.category,
  date: new Date(apiPost.created_at).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }),
  readTime: apiPost.read_time,
  featured: apiPost.featured,
  content: apiPost.content,
});

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'blog' | 'about' | 'contact' | 'admin'>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [usingDemoData, setUsingDemoData] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Gizli admin rotası - tahmin edilemez
  const ADMIN_SECRET_PATH = '#/nz-ctrl-x9k2m';

  // Check URL hash for admin route on mount
  useEffect(() => {
    const checkRoute = () => {
      if (window.location.hash === ADMIN_SECRET_PATH) {
        setCurrentView('admin');
        setIsAdminAuthenticated(isAuthenticated());
      }
    };

    checkRoute();
    window.addEventListener('hashchange', checkRoute);
    return () => window.removeEventListener('hashchange', checkRoute);
  }, []);

  // Load blog posts
  useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const posts = await fetchPublishedPosts();
        setBlogPosts(posts.map(transformPost));
        setUsingDemoData(false);
      } catch (err) {
        console.warn('API kullanılamıyor, demo veriler yükleniyor:', err);
        // API hazır değilse demo verileri kullan
        setBlogPosts(demoBlogPosts);
        setUsingDemoData(true);
        setError(''); // Demo veri ile hata gösterme
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  const handleScrollToContent = () => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePostClick = async (post: BlogPost) => {
    // If using demo data or we have content, use it directly
    if (usingDemoData || post.content) {
      setSelectedPost(post);
    } else {
      try {
        const fullPost = await fetchPostById(post.id);
        setSelectedPost(transformPost(fullPost));
      } catch {
        // Fallback to the post we have
        setSelectedPost(post);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToBlog = () => {
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: 'home' | 'blog' | 'about' | 'contact' | 'admin') => {
    setCurrentView(view);
    setSelectedPost(null);

    // Update URL hash for admin (gizli yol)
    if (view === 'admin') {
      window.location.hash = ADMIN_SECRET_PATH;
      setIsAdminAuthenticated(isAuthenticated());
    } else {
      window.location.hash = '';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
  };

  // Admin view
  if (currentView === 'admin') {
    return (
      <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
        <StarfieldBackground />

        <AnimatePresence mode="wait">
          {isAdminAuthenticated ? (
            <AdminDashboard
              key="dashboard"
              onBack={() => handleNavigate('home')}
              onLogout={handleAdminLogout}
            />
          ) : (
            <AdminLogin
              key="login"
              onLoginSuccess={handleAdminLoginSuccess}
              onBack={() => handleNavigate('home')}
            />
          )}
        </AnimatePresence>

        {/* Gradient overlays */}
        <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-black via-transparent to-transparent pointer-events-none z-0" />
        <div className="fixed bottom-0 left-0 w-full h-96 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated starfield background */}
      <StarfieldBackground />

      {/* Navigation */}
      <Navigation currentView={currentView} onNavigate={handleNavigate} />

      {/* Main content */}
      <AnimatePresence mode="wait">
        {selectedPost ? (
          <BlogArticle key="article" post={selectedPost} onBack={handleBackToBlog} />
        ) : (
          <motion.div
            key={currentView}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {currentView === 'home' && (
              <>
                <HeroSection onNavigate={handleNavigate} />
                <div ref={contentRef}>
                  <BlogGrid
                    posts={blogPosts}
                    onPostClick={handlePostClick}
                    loading={loading}
                    error={error}
                  />
                </div>
                <TestimonialsSection />
                <FAQSection />
              </>
            )}

            {currentView === 'blog' && (
              <div className="pt-24">
                <BlogGrid
                  posts={blogPosts}
                  onPostClick={handlePostClick}
                  loading={loading}
                  error={error}
                />
              </div>
            )}

            {currentView === 'about' && (
              <div className="pt-24">
                <AboutSection onNavigate={handleNavigate} />
              </div>
            )}

            {currentView === 'contact' && (
              <div className="pt-24">
                <ContactSection />
              </div>
            )}

            <Footer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlays for depth */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-black via-transparent to-transparent pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-full h-96 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none z-0" />
    </div>
  );
}
