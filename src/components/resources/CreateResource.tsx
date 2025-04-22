
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Plus, Upload } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const resourceSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isPremium: z.boolean().default(false),
  file: z.any()
    .refine(file => file?.length === 1, "Please select a file")
    .transform(file => file[0]),
});

const CreateResource = ({ onResourceCreated }) => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      isPremium: false,
      file: undefined,
    },
  });

  const onSubmit = async (data) => {
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
      
      // Track upload progress manually
      let uploadProgress = 0;
      const fileSize = file.size;
      
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
      form.reset();
      setOpen(false);
      if (onResourceCreated) onResourceCreated();
    } catch (error) {
      console.error('Error uploading resource:', error);
      toast.error('Failed to upload resource');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-family-green hover:bg-green-600">
          <Plus className="mr-2 h-4 w-4" />
          Upload Resource
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload New Resource</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter resource title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe what this resource is about..." 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="file"
              render={({ field: { value, onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                      <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-1">Click to select or drag and drop</p>
                      <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, JPG, PNG</p>
                      <Input
                        {...fieldProps}
                        id="file-upload"
                        type="file"
                        className="hidden"
                        onChange={(e) => onChange(e.target.files)}
                      />
                      {value && value[0] && (
                        <p className="mt-2 text-sm font-medium">{value[0].name}</p>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPremium"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Premium Resource</FormLabel>
                    <FormDescription>Mark this resource as premium (only accessible to premium members)</FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-family-green h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
            
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Uploading...' : 'Upload Resource'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateResource;
