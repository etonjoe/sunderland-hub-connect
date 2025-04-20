
import { User as UserType } from "@/types";

interface UserInfoProps {
  user: UserType;
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Account Type:</span>
        <span className="font-semibold">
          {user?.isPremium ? 'Premium' : 'Basic'}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Member Since:</span>
        <span className="font-semibold">
          {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
        </span>
      </div>
      <div className="flex justify-between">
        <span>Role:</span>
        <span className="font-semibold">{user?.role}</span>
      </div>
    </div>
  );
};

export default UserInfo;
