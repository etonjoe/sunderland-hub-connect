export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isPremium?: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_url: string;
  category: string;
  created_at: string;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  categoryId?: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
  likesCount: number;
  commentsCount: number;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postsCount: number;
}

export interface ForumComment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatGroup {
  id: string;
  name: string;
  description?: string;
  memberIds: string[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  groupId: string;
  timestamp: Date;
  read: boolean;
  reply_to_id?: string;
}
