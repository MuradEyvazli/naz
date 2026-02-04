import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  ArrowLeft,
  LogOut,
  RefreshCw,
  Search,
  Calendar,
  Clock,
  FileText
} from 'lucide-react';
import { fetchAllPosts, deletePost, updatePost, getImageUrl, type BlogPost } from '@/lib/api';
import { removeToken } from '@/lib/auth';
import { BlogEditor } from './BlogEditor';

interface AdminDashboardProps {
  onBack: () => void;
  onLogout: () => void;
}

type ViewMode = 'list' | 'create' | 'edit';

export function AdminDashboard({ onBack, onLogout }: AdminDashboardProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadPosts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllPosts();
      setPosts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Yazılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleLogout = () => {
    removeToken();
    onLogout();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yazıyı silmek istediğinizden emin misiniz?')) return;

    setDeletingId(id);
    try {
      await deletePost(id);
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Silme işlemi başarısız');
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublished = async (post: BlogPost) => {
    try {
      const updated = await updatePost(post.id, { published: !post.published });
      setPosts(posts.map(p => p.id === post.id ? updated : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme başarısız');
    }
  };

  const handleToggleFeatured = async (post: BlogPost) => {
    try {
      const updated = await updatePost(post.id, { featured: !post.featured });
      setPosts(posts.map(p => p.id === post.id ? updated : p));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Güncelleme başarısız');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setViewMode('edit');
  };

  const handleEditorClose = () => {
    setViewMode('list');
    setEditingPost(null);
    loadPosts();
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Editor view
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <BlogEditor
        post={editingPost}
        onClose={handleEditorClose}
        onSuccess={handleEditorClose}
      />
    );
  }

  // Dashboard list view
  return (
    <div className="min-h-screen py-6 px-3 sm:py-8 sm:px-6 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-4 mb-6 sm:mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button
                onClick={onBack}
                className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-light text-white">Yönetim Paneli</h1>
                <p className="text-white/50 text-xs sm:text-sm hidden sm:block">Blog yazılarını yönetin</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={loadPosts}
                disabled={loading}
                className="p-2 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 ${loading ? 'animate-spin' : ''}`} />
              </motion.button>
              <motion.button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline text-sm">Çıkış</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8"
        >
          {[
            { label: 'Toplam', value: posts.length, icon: FileText, color: 'from-blue-500 to-cyan-500' },
            { label: 'Yayında', value: posts.filter(p => p.published).length, icon: Eye, color: 'from-green-500 to-emerald-500' },
            { label: 'Taslak', value: posts.filter(p => !p.published).length, icon: EyeOff, color: 'from-yellow-500 to-orange-500' },
            { label: 'Öne Çıkan', value: posts.filter(p => p.featured).length, icon: Star, color: 'from-purple-500 to-pink-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl p-3 sm:p-4"
            >
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-2 sm:mb-3`}>
                <stat.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="text-xl sm:text-2xl font-light text-white">{stat.value}</div>
              <div className="text-xs sm:text-sm text-white/50">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm flex items-center justify-between"
            >
              <span>{error}</span>
              <button onClick={() => setError('')}>✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4 sm:mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-white/40" />
            <input
              type="text"
              placeholder="Yazı ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-all text-sm sm:text-base"
            />
          </div>
          <motion.button
            onClick={() => setViewMode('create')}
            className="flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium text-sm sm:text-base"
            whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)' }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Yeni Yazı</span>
          </motion.button>
        </motion.div>

        {/* Posts List */}
        {loading ? (
          <div className="flex items-center justify-center py-16 sm:py-20">
            <motion.div
              className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-purple-500/30 border-t-purple-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        ) : filteredPosts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 sm:py-20"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white/30" />
            </div>
            <h3 className="text-lg sm:text-xl text-white/70 mb-2">
              {searchQuery ? 'Sonuç bulunamadı' : 'Henüz yazı yok'}
            </h3>
            <p className="text-white/40 text-sm mb-4 sm:mb-6">
              {searchQuery ? 'Farklı bir arama deneyin' : 'İlk blog yazınızı oluşturun'}
            </p>
            {!searchQuery && (
              <motion.button
                onClick={() => setViewMode('create')}
                className="px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white text-sm sm:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 inline mr-2" />
                İlk Yazını Ekle
              </motion.button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden hover:border-white/20 transition-all group"
              >
                <div className="flex flex-col sm:flex-row">
                  {/* Image */}
                  <div className="sm:w-40 md:w-48 h-32 sm:h-auto relative overflow-hidden">
                    <img
                      src={getImageUrl(post.image)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=No+Image';
                      }}
                    />
                    {!post.published && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="px-2 py-1 bg-yellow-500/80 text-black text-xs font-medium rounded-full">
                          Taslak
                        </span>
                      </div>
                    )}
                    {post.featured && (
                      <div className="absolute top-2 left-2">
                        <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-3 sm:p-4 md:p-6">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="px-2 py-0.5 sm:px-3 sm:py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-medium text-white mb-1 sm:mb-2 line-clamp-1">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-white/50 mb-2 sm:mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-3 sm:gap-4 text-xs text-white/40">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        {formatDate(post.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        {post.read_time}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex sm:flex-col items-center justify-end sm:justify-center gap-1 sm:gap-2 p-2 sm:p-4 border-t sm:border-t-0 sm:border-l border-white/10">
                    <motion.button
                      onClick={() => handleTogglePublished(post)}
                      className={`p-2 rounded-lg transition-all ${post.published ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40 hover:text-white'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={post.published ? 'Yayından Kaldır' : 'Yayınla'}
                    >
                      {post.published ? <Eye className="w-4 h-4 sm:w-5 sm:h-5" /> : <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </motion.button>
                    <motion.button
                      onClick={() => handleToggleFeatured(post)}
                      className={`p-2 rounded-lg transition-all ${post.featured ? 'bg-yellow-500/20 text-yellow-400' : 'bg-white/5 text-white/40 hover:text-white'}`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title={post.featured ? 'Öne Çıkarmayı Kaldır' : 'Öne Çıkar'}
                    >
                      <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${post.featured ? 'fill-current' : ''}`} />
                    </motion.button>
                    <motion.button
                      onClick={() => handleEdit(post)}
                      className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Düzenle"
                    >
                      <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDelete(post.id)}
                      disabled={deletingId === post.id}
                      className="p-2 rounded-lg bg-white/5 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Sil"
                    >
                      {deletingId === post.id ? (
                        <motion.div
                          className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-red-400/30 border-t-red-400 rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                      ) : (
                        <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
