import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import * as blog from "./blog_store.tsx";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-28a62268/health", (c) => {
  return c.json({ status: "ok" });
});

// Subscribe to newsletter endpoint
app.post("/make-server-28a62268/newsletter/subscribe", async (c) => {
  try {
    const body = await c.req.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return c.json({ error: 'Geçerli bir e-posta adresi giriniz' }, 400);
    }

    // Check if email already exists
    const existingSubscribers = await kv.getByPrefix('newsletter:');
    const emailExists = existingSubscribers.some(sub => sub.value === email);

    if (emailExists) {
      return c.json({ error: 'Bu e-posta adresi zaten kayıtlı' }, 400);
    }

    // Save email to KV store
    const timestamp = new Date().toISOString();
    const key = `newsletter:${timestamp}:${email}`;
    await kv.set(key, email);

    console.log(`Newsletter subscription added: ${email}`);
    return c.json({ 
      success: true, 
      message: 'Bültene başarıyla abone oldunuz!' 
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return c.json({ 
      error: 'Bir hata oluştu. Lütfen tekrar deneyin.' 
    }, 500);
  }
});

// Contact form endpoint
app.post("/make-server-28a62268/contact/submit", async (c) => {
  try {
    const body = await c.req.json();
    const { name, email, phone, message } = body;

    if (!name || !email || !message) {
      return c.json({ error: 'Lütfen tüm gerekli alanları doldurun' }, 400);
    }

    if (!email.includes('@')) {
      return c.json({ error: 'Geçerli bir e-posta adresi giriniz' }, 400);
    }

    // Save contact form to KV store
    const timestamp = new Date().toISOString();
    const key = `contact:${timestamp}`;
    const contactData = {
      name,
      email,
      phone: phone || '',
      message,
      timestamp,
    };

    await kv.set(key, JSON.stringify(contactData));

    console.log(`Contact form submitted by: ${email}`);
    return c.json({
      success: true,
      message: 'Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağım.'
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    return c.json({
      error: 'Bir hata oluştu. Lütfen tekrar deneyin.'
    }, 500);
  }
});

// ============================================
// Blog API - Public Endpoints
// ============================================

// Get all published blog posts
app.get("/make-server-28a62268/blog/posts", async (c) => {
  try {
    const posts = await blog.getPublishedPosts();
    return c.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    return c.json({ error: 'Blog yazıları yüklenirken hata oluştu' }, 500);
  }
});

// Get single blog post by ID
app.get("/make-server-28a62268/blog/posts/:id", async (c) => {
  try {
    const id = c.req.param("id");
    const post = await blog.getPostById(id);

    if (!post) {
      return c.json({ error: 'Yazı bulunamadı' }, 404);
    }

    // Only return published posts for public API
    if (!post.published) {
      return c.json({ error: 'Yazı bulunamadı' }, 404);
    }

    return c.json({ success: true, post });
  } catch (error) {
    console.error('Error fetching post:', error);
    return c.json({ error: 'Yazı yüklenirken hata oluştu' }, 500);
  }
});

// ============================================
// Admin API - Protected Endpoints
// ============================================

// Helper: Verify admin authorization
const verifyAdmin = (c: any): boolean => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.substring(7);
  return blog.verifyToken(token);
};

// Admin login
app.post("/make-server-28a62268/admin/login", async (c) => {
  try {
    const body = await c.req.json();
    const { password } = body;

    if (!password) {
      return c.json({ error: 'Şifre gerekli' }, 400);
    }

    const adminPassword = await blog.getAdminPassword();

    if (password !== adminPassword) {
      return c.json({ error: 'Geçersiz şifre' }, 401);
    }

    const token = blog.generateToken(password);
    return c.json({
      success: true,
      message: 'Giriş başarılı',
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return c.json({ error: 'Giriş yapılırken hata oluştu' }, 500);
  }
});

// Get all posts (including drafts) - Admin only
app.get("/make-server-28a62268/admin/posts", async (c) => {
  if (!verifyAdmin(c)) {
    return c.json({ error: 'Yetkisiz erişim' }, 401);
  }

  try {
    const posts = await blog.getAllPosts();
    return c.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching admin posts:', error);
    return c.json({ error: 'Yazılar yüklenirken hata oluştu' }, 500);
  }
});

// Create new post - Admin only
app.post("/make-server-28a62268/admin/posts", async (c) => {
  if (!verifyAdmin(c)) {
    return c.json({ error: 'Yetkisiz erişim' }, 401);
  }

  try {
    const body = await c.req.json();
    const { title, excerpt, content, image, category, read_time, featured, published } = body;

    if (!title || !excerpt || !content || !image || !category || !read_time) {
      return c.json({ error: 'Tüm alanları doldurun' }, 400);
    }

    const post = await blog.createPost({
      title,
      excerpt,
      content,
      image,
      category,
      read_time,
      featured: featured ?? false,
      published: published ?? true,
    });

    console.log(`New blog post created: ${title}`);
    return c.json({ success: true, message: 'Yazı oluşturuldu', post });
  } catch (error) {
    console.error('Error creating post:', error);
    return c.json({ error: 'Yazı oluşturulurken hata oluştu' }, 500);
  }
});

// Update post - Admin only
app.put("/make-server-28a62268/admin/posts/:id", async (c) => {
  if (!verifyAdmin(c)) {
    return c.json({ error: 'Yetkisiz erişim' }, 401);
  }

  try {
    const id = c.req.param("id");
    const body = await c.req.json();

    // Check if post exists
    const existingPost = await blog.getPostById(id);
    if (!existingPost) {
      return c.json({ error: 'Yazı bulunamadı' }, 404);
    }

    const post = await blog.updatePost(id, body);

    console.log(`Blog post updated: ${post.title}`);
    return c.json({ success: true, message: 'Yazı güncellendi', post });
  } catch (error) {
    console.error('Error updating post:', error);
    return c.json({ error: 'Yazı güncellenirken hata oluştu' }, 500);
  }
});

// Delete post - Admin only
app.delete("/make-server-28a62268/admin/posts/:id", async (c) => {
  if (!verifyAdmin(c)) {
    return c.json({ error: 'Yetkisiz erişim' }, 401);
  }

  try {
    const id = c.req.param("id");

    // Check if post exists
    const existingPost = await blog.getPostById(id);
    if (!existingPost) {
      return c.json({ error: 'Yazı bulunamadı' }, 404);
    }

    await blog.deletePost(id);

    console.log(`Blog post deleted: ${id}`);
    return c.json({ success: true, message: 'Yazı silindi' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return c.json({ error: 'Yazı silinirken hata oluştu' }, 500);
  }
});

Deno.serve(app.fetch);