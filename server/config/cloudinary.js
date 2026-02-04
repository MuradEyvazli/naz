import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ============================================
// Görsel Storage (Resimler için)
// ============================================
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'naz-astroloji/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [
      { width: 1200, height: 800, crop: 'limit', quality: 'auto' }
    ],
  },
});

// ============================================
// Video Storage (Videolar için)
// ============================================
const videoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'naz-astroloji/videos',
    resource_type: 'video',
    allowed_formats: ['mp4', 'webm', 'mov', 'avi', 'mkv'],
    transformation: [
      { width: 1280, height: 720, crop: 'limit', quality: 'auto' }
    ],
  },
});

// ============================================
// Medya Storage (Hem resim hem video)
// ============================================
const mediaStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const isVideo = file.mimetype.startsWith('video/');

    return {
      folder: isVideo ? 'naz-astroloji/videos' : 'naz-astroloji/images',
      resource_type: isVideo ? 'video' : 'image',
      allowed_formats: isVideo
        ? ['mp4', 'webm', 'mov', 'avi', 'mkv']
        : ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: isVideo
        ? [{ width: 1280, height: 720, crop: 'limit', quality: 'auto' }]
        : [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
    };
  },
});

// ============================================
// Multer Middleware'leri
// ============================================

// Sadece resim yüklemek için
export const uploadImage = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // Max 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya formatı. Sadece JPEG, PNG, GIF, WebP yüklenebilir.'), false);
    }
  },
});

// Sadece video yüklemek için
export const uploadVideo = multer({
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Max 100MB video için
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen video formatı. Sadece MP4, WebM, MOV, AVI, MKV yüklenebilir.'), false);
    }
  },
});

// Hem resim hem video yüklemek için (blog için ideal)
export const upload = multer({
  storage: mediaStorage,
  limits: {
    fileSize: 100 * 1024 * 1024, // Max 100MB (video için)
  },
  fileFilter: (req, file, cb) => {
    const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const videoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska'];
    const allowedTypes = [...imageTypes, ...videoTypes];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Desteklenmeyen dosya formatı. Resim (JPEG, PNG, GIF, WebP) veya Video (MP4, WebM, MOV, AVI, MKV) yükleyebilirsiniz.'), false);
    }
  },
});

// ============================================
// Yardımcı Fonksiyonlar
// ============================================

// Cloudinary'den medya silme (resim veya video)
export const deleteMedia = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return false;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType
    });
    return result.result === 'ok';
  } catch (error) {
    console.error('Cloudinary silme hatası:', error);
    return false;
  }
};

// Geriye uyumluluk için alias
export const deleteImage = async (publicId) => deleteMedia(publicId, 'image');
export const deleteVideo = async (publicId) => deleteMedia(publicId, 'video');

// URL'den public ID ve resource type çıkarma
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes('cloudinary')) return null;

  try {
    // URL formatı: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.ext
    // veya: https://res.cloudinary.com/cloud_name/video/upload/v123/folder/filename.ext
    const parts = url.split('/');
    const uploadIndex = parts.indexOf('upload');
    if (uploadIndex === -1) return null;

    // upload'dan sonraki kısımları al (v123/folder/filename)
    const pathParts = parts.slice(uploadIndex + 1);
    // Version numarasını atla (v123 gibi)
    const withoutVersion = pathParts.filter(p => !p.startsWith('v') || isNaN(p.slice(1)));
    // Uzantıyı kaldır
    const lastPart = withoutVersion[withoutVersion.length - 1];
    withoutVersion[withoutVersion.length - 1] = lastPart.split('.')[0];

    return withoutVersion.join('/');
  } catch {
    return null;
  }
};

// URL'den resource type belirleme
export const getResourceTypeFromUrl = (url) => {
  if (!url) return 'image';
  if (url.includes('/video/')) return 'video';
  return 'image';
};

// URL'den medya silme (otomatik resource type)
export const deleteMediaByUrl = async (url) => {
  const publicId = getPublicIdFromUrl(url);
  const resourceType = getResourceTypeFromUrl(url);

  if (publicId) {
    return deleteMedia(publicId, resourceType);
  }
  return false;
};

export default cloudinary;
