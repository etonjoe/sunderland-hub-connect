
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'admin';
  isPremium: boolean;
  createdAt: Date;
}

export interface Profile {
  id: string;
  userId: string;
  bio: string;
  location: string;
  phoneNumber?: string;
}

export interface ForumPost {
  id: string;
  categoryId: string;
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
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumCategory {
  id: string;
  name: string;
  description: string;
  postsCount: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
  isPremium: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId?: string;
  groupId?: string;
  timestamp: Date;
  read: boolean;
}

export interface ChatGroup {
  id: string;
  name: string;
  avatar?: string;
  memberIds: string[];
  createdAt: Date;
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

export interface Subscription {
  id: string;
  userId: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'canceled';
  amount: number;
}

// New interfaces for analytics
export interface MembershipStat {
  period: string;
  totalUsers: number;
  premiumUsers: number;
  retentionRate: number;
}

export interface ActivityStat {
  period: string;
  forumPosts: number;
  resourceUploads: number;
  chatMessages: number;
  activeUsers: number;
}

export interface RevenueStat {
  period: string;
  amount: number;
  subscriptions: number;
  renewals: number;
}
