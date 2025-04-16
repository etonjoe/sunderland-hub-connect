
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from 'lucide-react';

const ContentManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>
          Manage forum posts, resources, and other content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-20 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4" />
          <p>Content management features coming soon!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
