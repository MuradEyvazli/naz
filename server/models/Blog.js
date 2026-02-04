import { ObjectId } from 'mongodb';
import { getDB } from '../config/db.js';

const COLLECTION = 'blogs';

// Blog Schema yapısı
export const BlogSchema = {
  title: String,        // Başlık
  excerpt: String,      // Kısa özet
  content: String,      // İçerik (HTML)
  image: String,        // Görsel URL veya dosya yolu
  category: String,     // Kategori
  read_time: String,    // Okuma süresi
  featured: Boolean,    // Öne çıkan mı?
  published: Boolean,   // Yayında mı?
  created_at: Date,     // Oluşturulma tarihi
  updated_at: Date,     // Güncellenme tarihi
};

// Tüm yayınlanmış yazıları getir
export const getPublishedBlogs = async () => {
  const db = getDB();
  const blogs = await db.collection(COLLECTION)
    .find({ published: true })
    .sort({ created_at: -1 })
    .toArray();

  return blogs.map(transformBlog);
};

// Tüm yazıları getir (admin)
export const getAllBlogs = async () => {
  const db = getDB();
  const blogs = await db.collection(COLLECTION)
    .find({})
    .sort({ created_at: -1 })
    .toArray();

  return blogs.map(transformBlog);
};

// ID ile tek yazı getir
export const getBlogById = async (id) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    return null;
  }

  const blog = await db.collection(COLLECTION).findOne({ _id: new ObjectId(id) });
  return blog ? transformBlog(blog) : null;
};

// Yeni yazı oluştur
export const createBlog = async (data) => {
  const db = getDB();

  const newBlog = {
    title: data.title,
    excerpt: data.excerpt,
    content: data.content || '',
    image: data.image,
    category: data.category,
    read_time: data.read_time,
    featured: data.featured || false,
    published: data.published !== false,
    created_at: new Date(),
    updated_at: new Date(),
  };

  const result = await db.collection(COLLECTION).insertOne(newBlog);

  return {
    ...newBlog,
    id: result.insertedId.toString(),
  };
};

// Yazı güncelle
export const updateBlog = async (id, data) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    return null;
  }

  const updates = {
    ...data,
    updated_at: new Date(),
  };

  // _id ve id alanlarını kaldır
  delete updates.id;
  delete updates._id;

  const result = await db.collection(COLLECTION).findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: updates },
    { returnDocument: 'after' }
  );

  return result ? transformBlog(result) : null;
};

// Yazı sil
export const deleteBlog = async (id) => {
  const db = getDB();

  if (!ObjectId.isValid(id)) {
    return false;
  }

  const result = await db.collection(COLLECTION).deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
};

// MongoDB _id'yi id'ye dönüştür
const transformBlog = (blog) => ({
  id: blog._id.toString(),
  title: blog.title,
  excerpt: blog.excerpt,
  content: blog.content,
  image: blog.image,
  category: blog.category,
  read_time: blog.read_time,
  featured: blog.featured,
  published: blog.published,
  created_at: blog.created_at,
  updated_at: blog.updated_at,
});
