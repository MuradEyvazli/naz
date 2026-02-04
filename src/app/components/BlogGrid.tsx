import { motion } from 'motion/react';
import { useState } from 'react';
import { Calendar, Clock, ArrowRight, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './ui/ImageWithFallback';
import { getImageUrl } from '@/lib/api';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  featured?: boolean;
  content?: string;
}

interface BlogGridProps {
  posts: BlogPost[];
  onPostClick: (post: BlogPost) => void;
  loading?: boolean;
  error?: string;
}

const POSTS_PER_PAGE = 6;

function LoadingSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Featured posts skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white/5 h-64" />
        ))}
      </div>

      {/* Grid skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i}>
            <div className="rounded-2xl bg-white/5 h-56 mb-4" />
            <div className="px-2 space-y-3">
              <div className="flex gap-3">
                <div className="h-6 w-20 rounded-full bg-white/5" />
                <div className="h-6 w-24 rounded bg-white/5" />
              </div>
              <div className="h-7 w-full rounded bg-white/5" />
              <div className="h-12 w-full rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
        <Calendar className="w-10 h-10 text-purple-400" />
      </div>
      <h3 className="text-2xl font-light text-white mb-2">Henüz yazı yok</h3>
      <p className="text-white/60">
        Yakında yeni içerikler eklenecek. Takipte kalın!
      </p>
    </motion.div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-20"
    >
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertCircle className="w-10 h-10 text-red-400" />
      </div>
      <h3 className="text-2xl font-light text-white mb-2">Bir sorun oluştu</h3>
      <p className="text-white/60">{message}</p>
    </motion.div>
  );
}

// Öne Çıkan Post Kartı
function FeaturedCard({ post, onPostClick, index }: { post: BlogPost; onPostClick: (post: BlogPost) => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => onPostClick(post)}
    >
      <div className="relative overflow-hidden rounded-2xl h-64 sm:h-72">
        <ImageWithFallback
          src={getImageUrl(post.image)}
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Featured badge */}
        <div className="absolute top-4 left-4 px-3 py-1 bg-purple-500/90 backdrop-blur-sm rounded-full">
          <span className="text-xs tracking-wider text-white">ÖNE ÇIKAN</span>
        </div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <div className="flex items-center gap-2 mb-2 text-white/70 text-xs">
            <span className="px-2 py-0.5 bg-white/10 backdrop-blur-sm rounded-full">
              {post.category}
            </span>
            <span>{post.date}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-light text-white leading-tight line-clamp-2">
            {post.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

// Normal Post Kartı
function PostCard({ post, onPostClick, index }: { post: BlogPost; onPostClick: (post: BlogPost) => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group cursor-pointer"
      onClick={() => onPostClick(post)}
    >
      <div className="relative overflow-hidden rounded-2xl mb-4 h-56">
        <ImageWithFallback
          src={getImageUrl(post.image)}
          alt={post.title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <motion.div
          className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.1 }}
        >
          <ArrowRight className="w-4 h-4 text-white" />
        </motion.div>
      </div>

      <div className="px-1">
        <div className="flex items-center gap-3 mb-2 text-sm text-white/60">
          <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 rounded-full tracking-wider text-xs">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs">
            <Calendar className="w-3 h-3" />
            {post.date}
          </span>
        </div>

        <h3 className="text-xl font-light mb-2 text-white group-hover:text-purple-300 transition-colors leading-tight line-clamp-2">
          {post.title}
        </h3>

        <p className="text-white/50 text-sm leading-relaxed mb-3 line-clamp-2">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 text-purple-400 text-xs">
          <Clock className="w-3 h-3" />
          <span>{post.readTime}</span>
        </div>
      </div>
    </motion.div>
  );
}

// Pagination Component
function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      {/* Previous button */}
      <motion.button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        whileHover={{ scale: currentPage === 1 ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Page numbers */}
      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <motion.button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all ${
              currentPage === page
                ? 'bg-purple-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {page}
          </motion.button>
        ))}
      </div>

      {/* Next button */}
      <motion.button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        whileHover={{ scale: currentPage === totalPages ? 1 : 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
}

export function BlogGrid({ posts, onPostClick, loading = false, error }: BlogGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Öne çıkan postları ayır (max 3)
  const featuredPosts = posts.filter(post => post.featured).slice(0, 3);

  // Diğer postlar (öne çıkanlar hariç)
  const regularPosts = posts.filter(post => !post.featured);

  // Pagination hesapla
  const totalPages = Math.ceil(regularPosts.length / POSTS_PER_PAGE);
  const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
  const paginatedPosts = regularPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 sm:py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <motion.div
          className="text-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-light mb-4 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
            Blog Yazıları
          </h2>
          <p className="text-white/60 text-base sm:text-lg tracking-wide">
            Astroloji ve spiritüel gelişim üzerine yazılar
          </p>
        </motion.div>

        {/* Loading state */}
        {loading && <LoadingSkeleton />}

        {/* Error state */}
        {!loading && error && <ErrorState message={error} />}

        {/* Empty state */}
        {!loading && !error && posts.length === 0 && <EmptyState />}

        {/* Content */}
        {!loading && !error && posts.length > 0 && (
          <>
            {/* Featured posts - 3 kart yan yana */}
            {featuredPosts.length > 0 && (
              <div className="mb-16">
                <h3 className="text-xl text-white/80 mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-purple-500" />
                  Öne Çıkanlar
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredPosts.map((post, index) => (
                    <FeaturedCard
                      key={post.id}
                      post={post}
                      onPostClick={onPostClick}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Regular posts grid */}
            {regularPosts.length > 0 && (
              <>
                <h3 className="text-xl text-white/80 mb-6 flex items-center gap-2">
                  <span className="w-8 h-px bg-purple-500" />
                  Tüm Yazılar
                  <span className="text-sm text-white/40 ml-2">({regularPosts.length} yazı)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {paginatedPosts.map((post, index) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onPostClick={onPostClick}
                      index={index}
                    />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </>
        )}
      </div>
    </section>
  );
}
