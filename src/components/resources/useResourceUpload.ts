
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "sonner";
import { useAuth } from '@/contexts/AuthContext';
import { ResourceFormValues } from './schema';

export const useResourceUpload = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadResource = async (data: ResourceFormValues) => {
    if (!user) {
      toast.error('You must be logged in to upload resources');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    
    try {
      const file = data.file;
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);
      
      // Create resource record in database
      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          title: data.title,
          description: data.description,
          is_premium: data.isPremium,
          file_url: publicUrl,
          file_type: fileExt,
          author_id: user.id
        });
      
      if (dbError) throw dbError;
      
      toast.success('Resource uploaded successfully');
      if (onSuccess) onSuccess();
      return true;
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast.error('Failed to upload resource');
      return false;
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return {
    uploadResource,
    isSubmitting,
    uploadProgress
  };
};
