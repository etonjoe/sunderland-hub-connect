
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
  mobileNumber?: string;
  whatsappNumber?: string;
  jobRole?: string;
  education?: string;
  religion?: string;
  address?: string;
  city?: string;
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

          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input
              id="mobileNumber"
              name="mobileNumber"
              value={profileData.mobileNumber || ''}
              onChange={onChange}
              placeholder="+1 (123) 456-7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              name="whatsappNumber"
              value={profileData.whatsappNumber || ''}
              onChange={onChange}
              placeholder="+1 (123) 456-7890"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobRole">Job Role</Label>
            <Input
              id="jobRole"
              name="jobRole"
              value={profileData.jobRole || ''}
              onChange={onChange}
              placeholder="Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="education">Education</Label>
            <Input
              id="education"
              name="education"
              value={profileData.education || ''}
              onChange={onChange}
              placeholder="Bachelor's in Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="religion">Religion</Label>
            <Input
              id="religion"
              name="religion"
              value={profileData.religion || ''}
              onChange={onChange}
              placeholder="Optional"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={profileData.address || ''}
              onChange={onChange}
              placeholder="123 Main St"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={profileData.city || ''}
              onChange={onChange}
              placeholder="New York"
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
