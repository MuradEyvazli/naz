// Cloudinary upload middleware
// Artık config/cloudinary.js'den export ediliyor
// Bu dosya geriye uyumluluk için tutuluyor

export { upload, deleteImage, getPublicIdFromUrl } from '../config/cloudinary.js';

// Alias for backwards compatibility
export const deleteFile = async (imageUrl) => {
  const { deleteImage, getPublicIdFromUrl } = await import('../config/cloudinary.js');
  const publicId = getPublicIdFromUrl(imageUrl);
  if (publicId) {
    return deleteImage(publicId);
  }
  return false;
};
