// Blog CRUD operations for Supabase
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const client = () => createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

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
  image: string;
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

// Get all published posts (public)
export const getPublishedPosts = async (): Promise<BlogPost[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
};

// Get single post by ID (public)
export const getPostById = async (id: string): Promise<BlogPost | null> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Get all posts including drafts (admin only)
export const getAllPosts = async (): Promise<BlogPost[]> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data ?? [];
};

// Create new post (admin only)
export const createPost = async (input: CreatePostInput): Promise<BlogPost> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("blogs")
    .insert({
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      image: input.image,
      category: input.category,
      read_time: input.read_time,
      featured: input.featured ?? false,
      published: input.published ?? true,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Update existing post (admin only)
export const updatePost = async (id: string, input: UpdatePostInput): Promise<BlogPost> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("blogs")
    .update({
      ...input,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Delete post (admin only)
export const deletePost = async (id: string): Promise<void> => {
  const supabase = client();
  const { error } = await supabase
    .from("blogs")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
};

// Get admin password from settings
export const getAdminPassword = async (): Promise<string> => {
  const supabase = client();
  const { data, error } = await supabase
    .from("admin_settings")
    .select("value")
    .eq("key", "admin_password")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }
  return data?.value ?? "admin123";
};

// Simple JWT-like token generation (base64 encoded with timestamp)
export const generateToken = (password: string): string => {
  const payload = {
    authenticated: true,
    timestamp: Date.now(),
    exp: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
  };
  return btoa(JSON.stringify(payload));
};

// Verify admin token
export const verifyToken = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token));
    if (!payload.authenticated || !payload.exp) {
      return false;
    }
    // Check expiration
    if (Date.now() > payload.exp) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};
