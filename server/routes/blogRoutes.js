import { Router } from 'express';
import * as blogController from '../controllers/blogController.js';

const router = Router();

// Public blog routes
router.get('/posts', blogController.getPublishedPosts);
router.get('/posts/:id', blogController.getPostById);

export default router;
