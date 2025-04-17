
import { User, MembershipStat, ActivityStat, RevenueStat } from './index';

// Export User as UserType and also re-export the other types
export type UserType = User;
export type { MembershipStat, ActivityStat, RevenueStat };

// Add any admin-specific types here in the future
