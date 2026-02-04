// Token oluştur (24 saat geçerli)
export const generateToken = () => {
  const payload = {
    authenticated: true,
    timestamp: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 saat
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
};

// Token doğrula
export const verifyToken = (token) => {
  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString());

    if (!payload.authenticated || !payload.exp) {
      return false;
    }

    if (Date.now() > payload.exp) {
      return false;
    }

    return true;
  } catch {
    return false;
  }
};

// Auth middleware
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Yetkisiz erişim. Token gerekli.'
    });
  }

  const token = authHeader.substring(7);

  if (!verifyToken(token)) {
    return res.status(401).json({
      success: false,
      error: 'Geçersiz veya süresi dolmuş token.'
    });
  }

  next();
};
