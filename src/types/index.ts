
export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isPremium?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  isPremium?: boolean;
  createdAt?: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  file_url: string;
  category: string;
  created_at: string;
  fileType?: string;
  authorId?: string;
  authorName?: string;
  createdAt?: Date;
  isPremium?: boolean;
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

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  isPinned: boolean;
}

export interface MembershipStat {
  id: string;
  period: string;
  totalUsers: number;
  premiumUsers: number;
  retentionRate: number;
  createdAt: Date;
}

export interface ActivityStat {
  id: string;
  period: string;
  forumPosts: number;
  chatMessages: number;
  resourceUploads: number;
  activeUsers: number;
  createdAt: Date;
}

export interface RevenueStat {
  id: string;
  period: string;
  amount: number;
  subscriptions: number;
  renewals: number;
  createdAt: Date;
}
