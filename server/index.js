import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Config
dotenv.config();

// Database
import { connectDB } from './config/db.js';
import { initializeSettings } from './models/Settings.js';

// Routes
import blogRoutes from './routes/blogRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Middleware
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import {
  applySecurityMiddleware,
  corsOptions,
  requestSizeLimit,
  loginLimiter,
  uploadLimiter,
} from './middleware/security.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// Trust Proxy (Rate limiter için gerekli)
// ============================================
app.set('trust proxy', 1);

// ============================================
// CORS (Güvenlik middleware'lerinden önce)
// ============================================
app.use(cors(corsOptions));

// ============================================
// Body Parser (Size limit ile)
// ============================================
app.use(express.json({ limit: requestSizeLimit.json }));
app.use(express.urlencoded({ extended: true, limit: requestSizeLimit.urlencoded }));

// ============================================
// Güvenlik Middleware'leri
// ============================================
applySecurityMiddleware(app);

// ============================================
// Static Files (eski uploads için)
// ============================================
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// Request Logger
// ============================================
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString('tr-TR');
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================
// Routes
// ============================================

// Health check (rate limit yok)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    security: 'enabled',
  });
});

// ============================================
// HONEYPOT ROUTES - Saldırganları Yakala
// ============================================
const honeypotPaths = [
  '/admin',
  '/administrator',
  '/wp-admin',
  '/wp-login.php',
  '/login',
  '/dashboard',
  '/panel',
  '/cpanel',
  '/phpmyadmin',
  '/manager',
  '/api/login',
  '/api/auth',
  '/api/admin/auth',
  '/admin.php',
  '/user/login',
  '/backend',
];

honeypotPaths.forEach((path) => {
  app.all(path, (req, res) => {
    // Şüpheli aktiviteyi logla
    console.error('');
    console.error('🍯 ═══════════════════════════════════════════');
    console.error('🍯 HONEYPOT TETİKLENDİ - ŞÜPHELİ ERİŞİM!');
    console.error(`🍯 IP: ${req.ip}`);
    console.error(`🍯 Path: ${path}`);
    console.error(`🍯 Method: ${req.method}`);
    console.error(`🍯 User-Agent: ${req.get('User-Agent')}`);
    console.error(`🍯 Tarih: ${new Date().toISOString()}`);
    console.error('🍯 ═══════════════════════════════════════════');
    console.error('');

    // Yavaşlatma - bot'ları oyala
    setTimeout(() => {
      res.status(404).json({
        success: false,
        error: 'Not Found',
      });
    }, 3000); // 3 saniye beklet
  });
});

// Blog routes (public)
app.use('/api/blog', blogRoutes);

// Admin routes (protected) - GİZLİ YOL
// Not: Gerçek admin yolu /api/admin ama frontend gizli hash kullanıyor
app.use('/api/admin', adminRoutes);

// ============================================
// Error Handling
// ============================================

// 404 Not Found
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

// ============================================
// Start Server
// ============================================

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    // Initialize default settings
    await initializeSettings();

    // Start listening
    app.listen(PORT, () => {
      console.log('');
      console.log('🚀 ================================');
      console.log(`🚀 Server başlatıldı!`);
      console.log(`🚀 http://localhost:${PORT}`);
      console.log(`🚀 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 ================================');
      console.log('');
      console.log('🛡️  Güvenlik Özellikleri:');
      console.log('   ✓ Helmet (Security Headers)');
      console.log('   ✓ Rate Limiting');
      console.log('   ✓ CORS Protection');
      console.log('   ✓ XSS Protection');
      console.log('   ✓ MongoDB Injection Protection');
      console.log('   ✓ HPP Protection');
      console.log('   ✓ Suspicious Activity Detection');
      console.log('');
      console.log('📌 Endpoints:');
      console.log(`   GET  /api/health`);
      console.log(`   GET  /api/blog/posts`);
      console.log(`   GET  /api/blog/posts/:id`);
      console.log(`   POST /api/admin/login`);
      console.log(`   GET  /api/admin/posts`);
      console.log(`   POST /api/admin/posts`);
      console.log(`   PUT  /api/admin/posts/:id`);
      console.log(`   DELETE /api/admin/posts/:id`);
      console.log(`   POST /api/admin/upload`);
      console.log('');
      console.log('☁️  Cloudinary: Görsel yükleme aktif');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Server başlatılamadı:', error);
    process.exit(1);
  }
};

// ============================================
// Process Error Handlers
// ============================================

// Uncaught exception handler
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});

// Unhandled rejection handler
process.on('unhandledRejection', (err) => {
  console.error('❌ UNHANDLED REJECTION:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM alındı. Graceful shutdown başlatılıyor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT alındı. Graceful shutdown başlatılıyor...');
  process.exit(0);
});

startServer();
