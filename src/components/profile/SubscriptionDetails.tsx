
import { Shield, AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { User } from "@/types";

interface SubscriptionDetailsProps {
  user: User;
  isUpgrading: boolean;
  onUpgrade: () => void;
}

const SubscriptionDetails = ({ user, isUpgrading, onUpgrade }: SubscriptionDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Details</CardTitle>
        <CardDescription>
          Manage your subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className={user?.isPremium ? 'bg-family-light-green' : 'bg-muted'}>
          <Shield className={`h-4 w-4 ${user?.isPremium ? 'text-family-green' : 'text-muted-foreground'}`} />
          <AlertTitle>
            {user?.isPremium 
              ? 'Premium Membership Active' 
              : 'Basic Membership'
            }
          </AlertTitle>
          <AlertDescription>
            {user?.isPremium 
              ? 'You have access to all premium features including the resources section and chat.' 
              : 'Upgrade to premium to access all features.'
            }
          </AlertDescription>
        </Alert>
        
        {!user?.isPremium && (
          <Alert variant="destructive" className="bg-family-light-orange border-family-orange">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Restricted Access</AlertTitle>
            <AlertDescription>
              You currently don't have access to premium features like the resources section and chat functionality.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Premium Benefits:</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access to all community resources</li>
            <li>Private chat with community members</li>
            <li>Group chat capabilities</li>
            <li>Priority support</li>
            <li>Early access to community events</li>
          </ul>
        </div>
        
        {!user?.isPremium && (
          <Button 
            className="w-full bg-family-orange hover:bg-orange-600"
            onClick={onUpgrade}
            disabled={isUpgrading}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            {isUpgrading ? 'Processing...' : 'Upgrade to Premium - $9.99/year'}
          </Button>
        )}
        
        {user?.isPremium && (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span>Subscription Plan:</span>
                <span className="font-semibold">Yearly Premium</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>Amount:</span>
                <span className="font-semibold">$9.99/year</span>
              </div>
              <div className="flex justify-between">
                <span>Renewal Date:</span>
                <span className="font-semibold">
                  {new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <Button variant="outline" className="w-full">
              Manage Payment Methods
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionDetails;
