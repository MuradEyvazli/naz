import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Save, Upload, X, Eye, EyeOff, Star, Image as ImageIcon, Trash2 } from 'lucide-react';
import { createPost, updatePost, getImageUrl, type BlogPost, type CreatePostInput } from '@/lib/api';

interface BlogEditorProps {
  post: BlogPost | null;
  onClose: () => void;
  onSuccess: () => void;
}

const CATEGORIES = ['ASTROLOJİ', 'SPİRİTÜEL', 'İLİŞKİLER', 'KİŞİSEL GELİŞİM', 'TAROT'];

export function BlogEditor({ post, onClose, onSuccess }: BlogEditorProps) {
  const isEditing = !!post;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<CreatePostInput>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: CATEGORIES[0],
    read_time: '5 dakika okuma',
    featured: false,
    published: true,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category,
        read_time: post.read_time,
        featured: post.featured,
        published: post.published,
      });
      setImagePreview(getImageUrl(post.image));
    }
  }, [post]);

  const handleChange = (field: keyof CreatePostInput, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Sadece resim dosyaları yüklenebilir');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Dosya boyutu 5MB\'dan küçük olmalı');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setFormData(prev => ({ ...prev, image: '' }));
  };

  const validateForm = (): string | null => {
    if (!formData.title.trim()) return 'Başlık gerekli';
    if (!formData.excerpt.trim()) return 'Özet gerekli';
    if (!formData.category.trim()) return 'Kategori gerekli';
    if (!formData.read_time.trim()) return 'Okuma süresi gerekli';
    if (!imageFile && !formData.image) return 'Görsel gerekli';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isEditing && post) {
        await updatePost(post.id, formData, imageFile || undefined);
      } else {
        await createPost(formData, imageFile || undefined);
      }
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'İşlem başarısız');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-6 px-3 sm:py-8 sm:px-6 relative z-10">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8"
        >
          <motion.button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          <h1 className="text-xl sm:text-2xl font-light text-white">
            {isEditing ? 'Yazıyı Düzenle' : 'Yeni Yazı'}
          </h1>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm flex items-center justify-between"
          >
            <span>{error}</span>
            <button onClick={() => setError('')}>
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2 space-y-4 sm:space-y-6"
            >
              {/* Image Upload */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Kapak Görseli
                </h2>

                {imagePreview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img
                      src={imagePreview}
                      alt="Önizleme"
                      className="w-full h-48 sm:h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <motion.button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/80 text-white hover:bg-red-500 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-3 right-3 px-4 py-2 rounded-lg bg-white/20 backdrop-blur-sm text-white text-sm hover:bg-white/30 transition-colors"
                    >
                      Değiştir
                    </button>
                  </div>
                ) : (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                    }`}
                  >
                    <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 text-white/40" />
                    <p className="text-white/60 mb-2 text-sm sm:text-base">
                      Görsel yüklemek için tıklayın veya sürükleyin
                    </p>
                    <p className="text-white/40 text-xs sm:text-sm">
                      PNG, JPG, GIF, WebP (Max 5MB)
                    </p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </div>

              {/* Content Fields */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">İçerik</h2>

                {/* Title */}
                <div className="mb-4">
                  <label className="block text-sm text-white/70 mb-2">Başlık</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Yazı başlığı"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-all text-sm sm:text-base"
                  />
                </div>

                {/* Excerpt */}
                <div className="mb-4">
                  <label className="block text-sm text-white/70 mb-2">Özet</label>
                  <textarea
                    value={formData.excerpt}
                    onChange={(e) => handleChange('excerpt', e.target.value)}
                    placeholder="Kısa açıklama"
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-all resize-none text-sm sm:text-base"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm text-white/70 mb-2">İçerik</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => handleChange('content', e.target.value)}
                    placeholder="Yazı içeriği (HTML desteklenir)"
                    rows={10}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-all resize-y font-mono text-xs sm:text-sm"
                  />
                  <p className="text-xs text-white/40 mt-2">
                    HTML: &lt;p&gt;, &lt;h2&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;blockquote&gt;
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 sm:space-y-6"
            >
              {/* Publish Settings */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">Yayın Ayarları</h2>

                {/* Published Toggle */}
                <div className="flex items-center justify-between mb-3 sm:mb-4 p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    {formData.published ? (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    ) : (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                    )}
                    <span className="text-white/70 text-sm sm:text-base">Yayında</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('published', !formData.published)}
                    className={`w-11 h-6 rounded-full transition-all ${formData.published ? 'bg-green-500' : 'bg-white/20'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${formData.published ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center justify-between mb-4 sm:mb-6 p-3 bg-white/5 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Star className={`w-4 h-4 sm:w-5 sm:h-5 ${formData.featured ? 'text-yellow-400 fill-yellow-400' : 'text-white/40'}`} />
                    <span className="text-white/70 text-sm sm:text-base">Öne Çıkar</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleChange('featured', !formData.featured)}
                    className={`w-11 h-6 rounded-full transition-all ${formData.featured ? 'bg-yellow-500' : 'bg-white/20'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${formData.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 sm:py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-medium disabled:opacity-50 text-sm sm:text-base"
                  whileHover={{ scale: 1.02, boxShadow: '0 10px 40px rgba(168, 85, 247, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white/30 border-t-white rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    />
                  ) : (
                    <>
                      <Save className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{isEditing ? 'Güncelle' : 'Kaydet'}</span>
                    </>
                  )}
                </motion.button>
              </div>

              {/* Details */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6">Detaylar</h2>

                {/* Category */}
                <div className="mb-4">
                  <label className="block text-sm text-white/70 mb-2">Kategori</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 transition-all text-sm sm:text-base"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat} className="bg-gray-900">{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Read Time */}
                <div>
                  <label className="block text-sm text-white/70 mb-2">Okuma Süresi</label>
                  <input
                    type="text"
                    value={formData.read_time}
                    onChange={(e) => handleChange('read_time', e.target.value)}
                    placeholder="5 dakika okuma"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-purple-500/50 transition-all text-sm sm:text-base"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </form>
      </div>
    </div>
  );
}
