
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User as UserType } from "@/types";
import AvatarUpload from "./AvatarUpload";
import UserInfo from "./UserInfo";

interface AccountOverviewProps {
  user: UserType;
  isUpgrading: boolean;
  onUpgrade: () => void;
}

const AccountOverview = ({ user, isUpgrading, onUpgrade }: AccountOverviewProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Account Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center my-4">
          <AvatarUpload user={user} />
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        
        <Separator />
        
        <UserInfo user={user} />
      </CardContent>
      {!user?.isPremium && (
        <CardFooter>
          <Button 
            className="w-full bg-family-orange hover:bg-orange-600"
            onClick={onUpgrade}
            disabled={isUpgrading}
          >
            <User className="mr-2 h-4 w-4" />
            {isUpgrading ? 'Processing...' : 'Upgrade to Premium'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AccountOverview;
