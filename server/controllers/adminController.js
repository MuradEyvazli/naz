import * as Blog from '../models/Blog.js';
import * as Settings from '../models/Settings.js';
import { generateToken } from '../middleware/auth.js';
import { deleteMediaByUrl } from '../config/cloudinary.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// POST /api/admin/login - Admin girişi
export const login = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    throw new AppError('Şifre gerekli', 400);
  }

  const adminPassword = await Settings.getAdminPassword();

  if (password !== adminPassword) {
    throw new AppError('Geçersiz şifre', 401);
  }

  const token = generateToken();

  res.json({
    success: true,
    message: 'Giriş başarılı',
    token
  });
});

// GET /api/admin/posts - Tüm yazıları getir
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Blog.getAllBlogs();

  res.json({
    success: true,
    count: posts.length,
    posts
  });
});

// GET /api/admin/posts/:id - Tek yazı getir (admin)
export const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Blog.getBlogById(id);

  if (!post) {
    throw new AppError('Yazı bulunamadı', 404);
  }

  res.json({
    success: true,
    post
  });
});

// POST /api/admin/posts - Yeni yazı oluştur
export const createPost = asyncHandler(async (req, res) => {
  const { title, excerpt, content, image, category, read_time, featured, published } = req.body;

  // Validation
  if (!title || !excerpt || !category || !read_time) {
    throw new AppError('Başlık, özet, kategori ve okuma süresi gerekli', 400);
  }

  // Eğer dosya yüklendiyse (Cloudinary URL), image olarak kullan
  let imageUrl = image;
  if (req.file) {
    // Cloudinary otomatik URL döndürür
    imageUrl = req.file.path;
  }

  if (!imageUrl) {
    throw new AppError('Görsel gerekli', 400);
  }

  const post = await Blog.createBlog({
    title,
    excerpt,
    content: content || '',
    image: imageUrl,
    category,
    read_time,
    featured: featured === 'true' || featured === true,
    published: published !== 'false' && published !== false,
  });

  console.log(`✅ Yeni yazı oluşturuldu: ${title}`);

  res.status(201).json({
    success: true,
    message: 'Yazı oluşturuldu',
    post
  });
});

// PUT /api/admin/posts/:id - Yazı güncelle
export const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  // Eğer yeni dosya yüklendiyse
  if (req.file) {
    // Eski medyayı Cloudinary'den sil
    const oldPost = await Blog.getBlogById(id);
    if (oldPost && oldPost.image && oldPost.image.includes('cloudinary')) {
      await deleteMediaByUrl(oldPost.image);
      console.log(`🗑️ Eski medya silindi: ${oldPost.image}`);
    }
    // Yeni Cloudinary URL'ini kullan
    updates.image = req.file.path;
  }

  // Boolean dönüşümleri
  if (updates.featured !== undefined) {
    updates.featured = updates.featured === 'true' || updates.featured === true;
  }
  if (updates.published !== undefined) {
    updates.published = updates.published === 'true' || updates.published === true;
  }

  const post = await Blog.updateBlog(id, updates);

  if (!post) {
    throw new AppError('Yazı bulunamadı', 404);
  }

  console.log(`✅ Yazı güncellendi: ${post.title}`);

  res.json({
    success: true,
    message: 'Yazı güncellendi',
    post
  });
});

// DELETE /api/admin/posts/:id - Yazı sil
export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Önce yazıyı bul (görseli silmek için)
  const post = await Blog.getBlogById(id);

  if (!post) {
    throw new AppError('Yazı bulunamadı', 404);
  }

  // Cloudinary'deki medyayı sil (resim veya video)
  if (post.image && post.image.includes('cloudinary')) {
    await deleteMediaByUrl(post.image);
    console.log(`🗑️ Medya silindi: ${post.image}`);
  }

  const deleted = await Blog.deleteBlog(id);

  if (!deleted) {
    throw new AppError('Yazı silinemedi', 500);
  }

  console.log(`🗑️ Yazı silindi: ${post.title}`);

  res.json({
    success: true,
    message: 'Yazı silindi'
  });
});

// POST /api/admin/upload - Medya yükle (resim veya video)
export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('Dosya yüklenmedi', 400);
  }

  // Cloudinary otomatik olarak URL döndürür
  const mediaUrl = req.file.path;
  const isVideo = req.file.mimetype?.startsWith('video/') || mediaUrl.includes('/video/');

  console.log(`${isVideo ? '🎬' : '📷'} Medya yüklendi: ${mediaUrl}`);

  res.json({
    success: true,
    message: isVideo ? 'Video yüklendi' : 'Görsel yüklendi',
    url: mediaUrl,
    public_id: req.file.filename,
    type: isVideo ? 'video' : 'image'
  });
});

// Geriye uyumluluk için alias
export const uploadImage = uploadMedia;
