
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from '@/contexts/AuthContext';
import PaymentMethods from '@/components/PaymentMethods';
import AccountOverview from '@/components/profile/AccountOverview';
import PersonalInfoForm from '@/components/profile/PersonalInfoForm';
import SubscriptionDetails from '@/components/profile/SubscriptionDetails';

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
          <AccountOverview 
            user={user} 
            isUpgrading={isUpgrading}
            onUpgrade={handleUpgrade}
          />
        </div>
        
        <div className="md:col-span-2">
          <Tabs defaultValue="personal">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="personal">Personal Info</TabsTrigger>
              <TabsTrigger value="subscription">Subscription</TabsTrigger>
              <TabsTrigger value="payment">Payment Methods</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="mt-6">
              <PersonalInfoForm
                profileData={profileData}
                isUpdating={isUpdating}
                onChange={handleChange}
                onSubmit={handleProfileUpdate}
              />
            </TabsContent>
            
            <TabsContent value="subscription" className="mt-6">
              <SubscriptionDetails
                user={user}
                isUpgrading={isUpgrading}
                onUpgrade={handleUpgrade}
              />
            </TabsContent>
            
            <TabsContent value="payment" className="mt-6">
              <PaymentMethods />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
