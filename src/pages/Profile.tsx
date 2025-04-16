
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditCard, User, Shield, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, isLoading, updateProfile, upgradeAccount } = useAuth();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    location: ''
  });
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name,
        email: user.email,
        bio: '',
        location: ''
      });
    }
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({
        name: profileData.name
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      await upgradeAccount();
    } finally {
      setIsUpgrading(false);
    }
  };
  
  if (isLoading) {
    return <div className="container py-10 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <div className="container py-10 animate-slide-in">
      <h1 className="text-3xl font-bold mb-8 flex items-center">
        Your Profile
        {user?.role === 'admin' && (
          <Badge variant="outline" className="ml-2 border-family-blue text-family-blue">
            Admin
          </Badge>
        )}
        {user?.isPremium && (
          <Badge className="ml-2 bg-family-orange">
            Premium
          </Badge>
        )}
      </h1>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
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
                  onClick={handleUpgrade}
                  disabled={isUpgrading}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  {isUpgrading ? 'Processing...' : 'Upgrade to Premium'}
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={profileData.name}
                        onChange={handleChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={profileData.email}
                        readOnly
                        disabled
                      />
                      <p className="text-sm text-muted-foreground">
                        Email cannot be changed
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleChange}
                        placeholder="Tell us about yourself"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        name="location"
                        value={profileData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="bg-family-blue hover:bg-blue-600"
                    >
                      {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription" className="mt-6">
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
                      onClick={handleUpgrade}
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
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
