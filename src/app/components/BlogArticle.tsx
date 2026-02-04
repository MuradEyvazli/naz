import { motion } from 'motion/react';
import { ArrowLeft, Calendar, Clock, Share2, BookmarkPlus, Maximize2 } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { ImageLightbox, useImageLightbox } from './ImageLightbox';
import { getImageUrl } from '@/lib/api';
import type { BlogPost } from './BlogGrid';

interface BlogArticleProps {
  post: BlogPost;
  onBack: () => void;
}

// Default content for posts without content
const defaultContent = `
<p class="text-xl">
  Kozmos her zaman insanlığı büyülemiş, bakışlarımızı yukarı çekmiş ve evrendeki yerimiz hakkında sayısız soru sormasına ilham vermiştir.
</p>

<p>
  Modern astronomi, bu kozmik fenomenlerin yapısı ve bileşimi hakkında nefes kesici detaylar ortaya çıkarmıştır. Gelişmiş teleskoplar ve uzay gözlemevleri sayesinde, milyarlarca yıldır gizli kalmış sırları ortaya çıkararak uzayın derinliklerine her zamankinden daha fazla bakabiliyoruz.
</p>

<h2 class="text-3xl font-light text-white mt-12 mb-6">Güzelliğin Arkasındaki Bilim</h2>

<p>
  Bu astronomik nesneleri özellikle büyüleyici kılan, görünümlerini şekillendiren fiziksel kuvvetlerin karmaşık etkileşimidir. Yerçekimi, radyasyon ve manyetik alanlar, Dünya'dan gözlemlediğimiz çarpıcı görsel gösterileri oluşturmak için birlikte çalışır.
</p>

<p>
  Astronomik görüntülerde gördüğümüz renkler sadece sanatsal tercihler değildir - farklı ışık dalga boylarını ve çeşitli kimyasal elementleri temsil ederler. Her renk tonu, gözlemlediğimiz gök cisminin sıcaklığı, bileşimi ve yaşı hakkında bir hikaye anlatır.
</p>

<h2 class="text-3xl font-light text-white mt-12 mb-6">Gece Gökyüzünü Gözlemlemek</h2>

<p>
  Amatör astronomlar için gece gökyüzü, keşif için sonsuz fırsatlar sunar. Profesyonel gözlemevleri en ayrıntılı görüntüleri yakalasa da, kendi teleskopunuzla veya hatta çıplak gözle bu göksel harikaları izlemenin büyülü bir tarafı vardır.
</p>

<p>
  En iyi gözlem koşulları, ışık kirliliğinden uzakta, açık ve aysız gecelerde gerçekleşir. Gece gökyüzündeki en muhteşem nesnelerin çoğu, nispeten mütevazı ekipmanlarla gözlemlenebilir ve bu da astronominin merak ve sabırla herkese açık bir hobi olmasını sağlar.
</p>
`;

export function BlogArticle({ post, onBack }: BlogArticleProps) {
  // Use post content if available, otherwise use default
  const content = post.content || defaultContent;
  const imageUrl = getImageUrl(post.image);

  // Lightbox hook
  const { isOpen, src, alt, openLightbox, closeLightbox } = useImageLightbox();

  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Bağlantı panoya kopyalandı!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  const handleImageClick = () => {
    openLightbox(imageUrl, post.title);
  };

  return (
    <>
      <motion.article
        className="relative min-h-screen py-24 px-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <motion.button
            className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-all"
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wider">YAZILARA DÖN</span>
          </motion.button>

          {/* Article header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-6 text-white/60 text-sm">
              <span className="px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full tracking-wider">
                {post.category}
              </span>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light mb-6 leading-tight bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              {post.title}
            </h1>

            <p className="text-lg sm:text-xl text-white/70 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-4 mt-8">
              <motion.button
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.15)' }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm tracking-wider">PAYLAŞ</span>
              </motion.button>

              <motion.button
                className="px-6 py-3 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-300 flex items-center gap-2"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(168, 85, 247, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                <BookmarkPlus className="w-4 h-4" />
                <span className="text-sm tracking-wider">KAYDET</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Featured image - Clickable */}
          <motion.div
            className="relative overflow-hidden rounded-3xl mb-16 h-[400px] sm:h-[500px] md:h-[600px] group cursor-pointer"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            onClick={handleImageClick}
          >
            <ImageWithFallback
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

            {/* Zoom hint overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
              <motion.div
                className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
              >
                <Maximize2 className="w-7 h-7 text-white" />
              </motion.div>
            </div>

            {/* Click hint */}
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full text-white/70 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Tam boyut görüntüle
            </div>
          </motion.div>

          {/* Article content */}
          <motion.div
            className="prose prose-invert prose-lg max-w-none"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {/* Content wrapper with readable background */}
            <div className="relative p-6 sm:p-8 md:p-10 rounded-2xl bg-gradient-to-b from-white/[0.03] to-white/[0.01] border border-white/[0.06] backdrop-blur-sm">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

              <div
                className="relative space-y-6 text-white/85 leading-relaxed text-base sm:text-lg [&_p]:text-white/85 [&_p]:leading-relaxed [&_h2]:text-white [&_h2]:text-2xl [&_h2]:sm:text-3xl [&_h2]:font-light [&_h2]:mt-10 [&_h2]:mb-5 [&_h3]:text-white [&_h3]:text-xl [&_h3]:font-light [&_blockquote]:border-l-4 [&_blockquote]:border-purple-500/50 [&_blockquote]:pl-6 [&_blockquote]:py-2 [&_blockquote]:my-6 [&_blockquote]:italic [&_blockquote]:text-purple-200/90 [&_blockquote]:bg-purple-500/5 [&_blockquote]:rounded-r-lg [&_strong]:text-white [&_strong]:font-medium [&_a]:text-purple-400 [&_a:hover]:text-purple-300 [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_li]:text-white/80"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>

            {/* Quote section */}
            <div className="mt-10 p-6 sm:p-8 bg-gradient-to-br from-purple-900/30 to-pink-900/20 border border-purple-500/20 rounded-2xl">
              <p className="text-base sm:text-lg italic text-purple-200">
                "Kozmos içimizdedir. Biz yıldız tozundan yapılmışız. Evrenin kendini tanımasının bir yoluyuz."
              </p>
              <p className="text-sm text-white/60 mt-4">— Carl Sagan</p>
            </div>
          </motion.div>
        </div>
      </motion.article>

      {/* Image Lightbox */}
      <ImageLightbox
        src={src}
        alt={alt}
        isOpen={isOpen}
        onClose={closeLightbox}
      />
    </>
  );
}
