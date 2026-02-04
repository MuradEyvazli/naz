import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

// ============================================
// Helmet - HTTP Security Headers
// ============================================
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.cloudinary.com", "https://res.cloudinary.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Cloudinary için gerekli
  crossOriginResourcePolicy: { policy: "cross-origin" }, // Cloudinary için gerekli
});

// ============================================
// Rate Limiting - Brute Force Koruması
// ============================================

// Genel API rate limit
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 dakika
  max: 100, // Her IP için 15 dakikada max 100 istek
  message: {
    success: false,
    error: 'Çok fazla istek gönderdiniz. Lütfen 15 dakika sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Login için daha sıkı rate limit
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 5, // Her IP için saatte max 5 login denemesi
  message: {
    success: false,
    error: 'Çok fazla giriş denemesi. Lütfen 1 saat sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Başarılı girişleri sayma
});

// Upload için rate limit
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 saat
  max: 20, // Her IP için saatte max 20 upload
  message: {
    success: false,
    error: 'Çok fazla dosya yüklediniz. Lütfen 1 saat sonra tekrar deneyin.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ============================================
// MongoDB Injection Koruması
// ============================================
export const mongoSanitizeMiddleware = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️ MongoDB Injection girişimi engellendi: ${key} - IP: ${req.ip}`);
  },
});

// ============================================
// HPP - HTTP Parameter Pollution Koruması
// ============================================
export const hppMiddleware = hpp();

// ============================================
// XSS Koruması (Manuel)
// ============================================
const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

const sanitizeObject = (obj) => {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? escapeHtml(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const sanitized = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
  }
  return sanitized;
};

export const xssMiddleware = (req, res, next) => {
  if (req.body) {
    // Content alanını sanitize etme (HTML içerik olabilir)
    const contentBackup = req.body.content;
    req.body = sanitizeObject(req.body);
    // Content'i geri yükle (blog içeriği HTML olabilir)
    if (contentBackup !== undefined) {
      req.body.content = contentBackup;
    }
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

// ============================================
// IP Logging & Suspicious Activity Detection
// ============================================

// Sadece gerçek saldırı pattern'leri - false positive'leri azalt
const suspiciousPatterns = [
  // SQL Injection - sadece tehlikeli kombinasyonlar
  /(\%27|\')(\s)*(or|and|union|select|insert|update|delete|drop|truncate)(\s)+/i,
  /(\-\-|\%23)(\s)*(select|union|drop)/i,

  // XSS - script tag'leri
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/i,
  /on\w+\s*=\s*["'][^"']*["']/i, // onclick, onerror, etc.

  // MongoDB Injection - sadece JSON context'te
  /"\$(?:where|gt|lt|ne|regex|or|and)"\s*:/i,

  // Path traversal - sadece tehlikeli pattern
  /\.\.[\/\\]{2,}/g,

  // Command injection
  /;\s*(cat|ls|rm|wget|curl|bash|sh|nc)\s/i,
];

export const securityLogger = (req, res, next) => {
  // Admin ve blog content route'larını atla (HTML içerik olabilir)
  if (req.path.includes('/posts') && (req.method === 'POST' || req.method === 'PUT')) {
    return next();
  }

  const fullUrl = req.originalUrl || req.url;
  const body = JSON.stringify(req.body || {});
  const combined = fullUrl + body;

  // Şüpheli pattern kontrolü
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(combined)) {
      console.error(`🚨 ŞÜPHELİ AKTİVİTE TESPİT EDİLDİ!`);
      console.error(`   IP: ${req.ip}`);
      console.error(`   URL: ${fullUrl}`);
      console.error(`   Method: ${req.method}`);
      console.error(`   User-Agent: ${req.get('User-Agent')}`);
      console.error(`   Pattern: ${pattern}`);

      return res.status(403).json({
        success: false,
        error: 'Şüpheli aktivite tespit edildi. İstek reddedildi.',
      });
    }
  }

  next();
};

// ============================================
// CORS Yapılandırması
// ============================================
export const corsOptions = {
  origin: (origin, callback) => {
    // Allowed origins
    const allowedOrigins = [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000',
      'http://localhost:3001',
      // Production domain'leri buraya eklenecek
      // 'https://yourdomain.com',
    ];

    // Origin yoksa (Postman, curl, vb.) veya allowedOrigins'de varsa izin ver
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️ CORS ihlali: ${origin}`);
      callback(new Error('CORS policy violation'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining'],
  maxAge: 86400, // 24 saat preflight cache
};

// ============================================
// Request Size Limit
// ============================================
export const requestSizeLimit = {
  json: '10kb', // JSON body max 10KB
  urlencoded: '10kb', // URL encoded max 10KB
};

// ============================================
// Tüm Güvenlik Middleware'lerini Birleştir
// ============================================
export const applySecurityMiddleware = (app) => {
  // 1. Helmet - Security headers
  app.use(helmetMiddleware);

  // 2. Rate limiting (genel)
  app.use('/api/', generalLimiter);

  // 3. MongoDB injection koruması
  app.use(mongoSanitizeMiddleware);

  // 4. HPP koruması
  app.use(hppMiddleware);

  // 5. XSS koruması
  app.use(xssMiddleware);

  // 6. Güvenlik logger
  app.use(securityLogger);

  console.log('🛡️  Güvenlik middleware\'leri aktif');
};

export default {
  helmetMiddleware,
  generalLimiter,
  loginLimiter,
  uploadLimiter,
  mongoSanitizeMiddleware,
  hppMiddleware,
  xssMiddleware,
  securityLogger,
  corsOptions,
  requestSizeLimit,
  applySecurityMiddleware,
};
