export interface AdminProfile {
  id: string;
  email: string;
  name: string;
  bio: string;
  photo_url: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  image_url: string;
  read_time: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  year: string;
  category: string;
  description: string;
  technologies: string[];
  github_url: string;
  live_url: string;
  image_url: string;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DigitalProduct {
  id: string;
  title: string;
  description: string;
  cover_image_url: string;
  rating: number;
  pages: number;
  downloads: number;
  price: string;
  purchase_url: string;
  created_at: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  purpose: string;
  status: 'confirmed' | 'cancelled';
  created_at: string;
}
