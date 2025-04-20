
import { useState } from "react";
import { User, UploadCloud } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { User as UserType } from "@/types";

interface AvatarUploadProps {
  user: UserType;
}

const AvatarUpload = ({ user }: AvatarUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);

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
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update profiles table with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: urlData.publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Update auth metadata with new avatar
      const { error: authError } = await supabase.auth.updateUser({
        data: { avatar_url: urlData.publicUrl }
      });

      if (authError) throw authError;
      
      toast.success('Avatar updated successfully');
      
      // Reload page to show new avatar
      window.location.reload();
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to update avatar');
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
        <UploadCloud size={16} />
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
