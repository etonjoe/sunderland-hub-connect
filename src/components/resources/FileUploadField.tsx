
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Upload } from "lucide-react";
import { UseFormReturn } from 'react-hook-form';
import { ResourceFormValues } from './schema';

interface FileUploadFieldProps {
  form: UseFormReturn<ResourceFormValues>;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({ form }) => {
  return (
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
  );
};
