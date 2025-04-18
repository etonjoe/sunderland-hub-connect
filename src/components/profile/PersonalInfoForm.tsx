
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  location: string;
}

interface PersonalInfoFormProps {
  profileData: ProfileData;
  isUpdating: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const PersonalInfoForm = ({ profileData, isUpdating, onChange, onSubmit }: PersonalInfoFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={profileData.name}
              onChange={onChange}
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
              onChange={onChange}
              placeholder="Tell us about yourself"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              name="location"
              value={profileData.location}
              onChange={onChange}
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
  );
};

export default PersonalInfoForm;
