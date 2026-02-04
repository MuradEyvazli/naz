// API Client for Blog and Admin endpoints
import { getToken } from './auth';

// API URL - production veya development
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Response types
export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  read_time: string;
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePostInput {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: string;
  read_time: string;
  featured?: boolean;
  published?: boolean;
}

export interface UpdatePostInput {
  title?: string;
  excerpt?: string;
  content?: string;
  image?: string;
  category?: string;
  read_time?: string;
  featured?: boolean;
  published?: boolean;
}

// Helper: Build headers
const getHeaders = (authenticated = false, isFormData = false): HeadersInit => {
  const headers: HeadersInit = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (authenticated) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

// Helper: Safe JSON parse
const safeJsonParse = async (response: Response): Promise<any> => {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    if (response.status === 404) {
      throw new Error('API endpoint bulunamadı. Backend server çalışıyor mu?');
    }
    throw new Error(`Sunucu hatası: ${response.status} ${response.statusText}`);
  }
};

// Helper: Get full image URL
export const getImageUrl = (imagePath: string): string => {
  if (!imagePath) return '';
  if (imagePath.startsWith('http')) return imagePath;
  if (imagePath.startsWith('/uploads')) {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
    const serverBase = apiBase.replace('/api', '');
    return `${serverBase}${imagePath}`;
  }
  return imagePath;
};

// ============================================
// Public Blog API
// ============================================

// Get all published posts
export const fetchPublishedPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${BASE_URL}/blog/posts`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Blog yazıları yüklenirken hata oluştu');
    }

    return data.posts || [];
  } catch (error) {
    console.error('fetchPublishedPosts error:', error);
    throw error;
  }
};

// Get single post by ID
export const fetchPostById = async (id: string): Promise<BlogPost> => {
  try {
    const response = await fetch(`${BASE_URL}/blog/posts/${id}`, {
      method: 'GET',
      headers: getHeaders(),
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Yazı yüklenirken hata oluştu');
    }

    return data.post;
  } catch (error) {
    console.error('fetchPostById error:', error);
    throw error;
  }
};

// ============================================
// Admin API
// ============================================

// Admin login
export const adminLogin = async (password: string): Promise<string> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ password }),
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Giriş yapılırken hata oluştu');
    }

    return data.token;
  } catch (error) {
    console.error('adminLogin error:', error);
    throw error;
  }
};

// Get all posts (admin)
export const fetchAllPosts = async (): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/posts`, {
      method: 'GET',
      headers: getHeaders(true),
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Yazılar yüklenirken hata oluştu');
    }

    return data.posts || [];
  } catch (error) {
    console.error('fetchAllPosts error:', error);
    throw error;
  }
};

// Create new post (admin) - with file upload support
export const createPost = async (input: CreatePostInput, imageFile?: File): Promise<BlogPost> => {
  try {
    let body: FormData | string;
    let headers = getHeaders(true, !!imageFile);

    if (imageFile) {
      // Use FormData for file upload
      const formData = new FormData();
      formData.append('title', input.title);
      formData.append('excerpt', input.excerpt);
      formData.append('content', input.content || '');
      formData.append('category', input.category);
      formData.append('read_time', input.read_time);
      formData.append('featured', String(input.featured || false));
      formData.append('published', String(input.published !== false));
      formData.append('image', imageFile);
      body = formData;
    } else {
      // Use JSON if no file
      body = JSON.stringify(input);
    }

    const response = await fetch(`${BASE_URL}/admin/posts`, {
      method: 'POST',
      headers,
      body,
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Yazı oluşturulurken hata oluştu');
    }

    return data.post;
  } catch (error) {
    console.error('createPost error:', error);
    throw error;
  }
};

// Update post (admin) - with file upload support
export const updatePost = async (id: string, input: UpdatePostInput, imageFile?: File): Promise<BlogPost> => {
  try {
    let body: FormData | string;
    let headers = getHeaders(true, !!imageFile);

    if (imageFile) {
      // Use FormData for file upload
      const formData = new FormData();
      Object.entries(input).forEach(([key, value]) => {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      });
      formData.append('image', imageFile);
      body = formData;
    } else {
      // Use JSON if no file
      body = JSON.stringify(input);
    }

    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'PUT',
      headers,
      body,
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Yazı güncellenirken hata oluştu');
    }

    return data.post;
  } catch (error) {
    console.error('updatePost error:', error);
    throw error;
  }
};

// Delete post (admin)
export const deletePost = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/admin/posts/${id}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Yazı silinirken hata oluştu');
    }
  } catch (error) {
    console.error('deletePost error:', error);
    throw error;
  }
};

// Upload image only
export const uploadImage = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${BASE_URL}/admin/upload`, {
      method: 'POST',
      headers: getHeaders(true, true),
      body: formData,
    });

    const data = await safeJsonParse(response);

    if (!response.ok) {
      throw new Error(data.error || 'Görsel yüklenirken hata oluştu');
    }

    return data.url;
  } catch (error) {
    console.error('uploadImage error:', error);
    throw error;
  }
};
