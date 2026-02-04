import * as Blog from '../models/Blog.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// GET /api/blog/posts - Yayınlanmış yazıları getir
export const getPublishedPosts = asyncHandler(async (req, res) => {
  const posts = await Blog.getPublishedBlogs();

  res.json({
    success: true,
    count: posts.length,
    posts
  });
});

// GET /api/blog/posts/:id - Tek yazı getir
export const getPostById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const post = await Blog.getBlogById(id);

  if (!post) {
    throw new AppError('Yazı bulunamadı', 404);
  }

  // Yayınlanmamış yazıları public API'den gizle
  if (!post.published) {
    throw new AppError('Yazı bulunamadı', 404);
  }

  res.json({
    success: true,
    post
  });
});
