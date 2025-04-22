export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user';
  isPremium: boolean;
  createdAt: Date;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postsCount: number;
}

export interface ForumPost {
  id: string;
  categoryId?: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
}

export interface ForumComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}
