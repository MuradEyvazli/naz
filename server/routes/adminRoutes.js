import { Router } from 'express';
import * as adminController from '../controllers/adminController.js';
import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import { loginLimiter, uploadLimiter } from '../middleware/security.js';

const router = Router();

// ============================================
// Public Routes
// ============================================

// Login - Özel rate limit ile korumalı (5 deneme/saat)
router.post('/login', loginLimiter, adminController.login);

// ============================================
// Protected Routes (Auth + Rate Limit)
// ============================================

// Posts - CRUD
router.get('/posts', authMiddleware, adminController.getAllPosts);
router.get('/posts/:id', authMiddleware, adminController.getPostById);
router.post('/posts', authMiddleware, uploadLimiter, upload.single('image'), adminController.createPost);
router.put('/posts/:id', authMiddleware, uploadLimiter, upload.single('image'), adminController.updatePost);
router.delete('/posts/:id', authMiddleware, adminController.deletePost);

// Image upload - Özel rate limit (20 upload/saat)
router.post('/upload', authMiddleware, uploadLimiter, upload.single('image'), adminController.uploadImage);

export default router;
