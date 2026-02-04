// Custom Error sınıfı
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 404 Not Found handler
export const notFoundHandler = (req, res, next) => {
  const error = new AppError(`Endpoint bulunamadı: ${req.originalUrl}`, 404);
  next(error);
};

// Global error handler
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  console.error('❌ Error:', {
    message: err.message,
    statusCode: err.statusCode,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      status: 'fail',
      error: 'Dosya boyutu çok büyük. Maksimum 10MB yüklenebilir.',
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      status: 'fail',
      error: 'Beklenmeyen dosya alanı.',
    });
  }

  // Multer file filter error
  if (err.message && err.message.includes('Desteklenmeyen dosya formatı')) {
    return res.status(400).json({
      success: false,
      status: 'fail',
      error: err.message,
    });
  }

  // MongoDB errors
  if (err.name === 'MongoServerError') {
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        status: 'fail',
        error: 'Bu kayıt zaten mevcut.',
      });
    }
  }

  // MongoDB connection error
  if (err.name === 'MongoNetworkError') {
    return res.status(503).json({
      success: false,
      status: 'error',
      error: 'Veritabanı bağlantısı kurulamadı.',
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      status: 'fail',
      error: err.message,
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      status: 'fail',
      error: 'Geçersiz token.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      status: 'fail',
      error: 'Token süresi dolmuş.',
    });
  }

  // Cloudinary errors
  if (err.message && err.message.includes('cloudinary')) {
    return res.status(500).json({
      success: false,
      status: 'error',
      error: 'Görsel yükleme servisi hatası.',
    });
  }

  // Development vs Production response
  if (process.env.NODE_ENV === 'development') {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err.message,
      stack: err.stack,
    });
  }

  // Production - operational error (known error)
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      error: err.message,
    });
  }

  // Production - programming or unknown error
  return res.status(500).json({
    success: false,
    status: 'error',
    error: 'Beklenmeyen bir hata oluştu.',
  });
};

// Async handler wrapper - try/catch gerektirmez
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
