
import { User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard } from "lucide-react";
import { User as UserType } from "@/types";

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
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={40} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg">{user?.name}</h3>
          <p className="text-muted-foreground">{user?.email}</p>
        </div>
        
        <Separator />
        
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
      </CardContent>
      {!user?.isPremium && (
        <CardFooter>
          <Button 
            className="w-full bg-family-orange hover:bg-orange-600"
            onClick={onUpgrade}
            disabled={isUpgrading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isUpgrading ? 'Processing...' : 'Upgrade to Premium'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default AccountOverview;
