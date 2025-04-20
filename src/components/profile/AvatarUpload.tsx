
import { useState } from "react";
import { User, UploadCloud } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User as UserType } from "@/types";
import { useAuth } from "@/contexts/AuthContext";

interface AvatarUploadProps {
  user: UserType;
}

const AvatarUpload = ({ user }: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { updateProfile } = useAuth();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    setIsUploading(true);
    try {
      // Create the avatars bucket if it doesn't exist yet
      try {
        const { error: getBucketError } = await supabase.storage.getBucket('avatars');
        if (getBucketError) {
          // Bucket doesn't exist, create it
          const { error: createBucketError } = await supabase.storage.createBucket('avatars', {
            public: true,
            fileSizeLimit: 2 * 1024 * 1024, // 2MB
          });
          
          if (createBucketError) throw createBucketError;
          console.log('Created avatars bucket');
        }
      } catch (bucketError) {
        console.error('Error checking/creating bucket:', bucketError);
        // Continue anyway, as the bucket might already exist
      }

      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData.publicUrl) {
        throw new Error('Failed to get public URL for the avatar');
      }

      console.log('Avatar uploaded successfully:', urlData.publicUrl);

      // Update user profile with new avatar URL
      const success = await updateProfile({ avatar: urlData.publicUrl });
      
      if (!success) {
        throw new Error('Failed to update profile with new avatar');
      }
      
      toast.success('Avatar updated successfully');
      
      // Reload page to show new avatar
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update avatar: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative w-24 h-24 mx-auto mb-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={user?.avatar} alt={user?.name} />
        <AvatarFallback className="bg-muted text-2xl">
          {user?.name?.charAt(0) || <User size={40} className="text-muted-foreground" />}
        </AvatarFallback>
      </Avatar>
      <label 
        htmlFor="avatar-upload" 
        className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer"
      >
        {isUploading ? (
          <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
        ) : (
          <UploadCloud size={16} />
        )}
        <input 
          id="avatar-upload" 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleAvatarUpload}
          disabled={isUploading}
        />
      </label>
    </div>
  );
};

export default AvatarUpload;
