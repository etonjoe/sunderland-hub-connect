
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Folder, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const ContentManagement = () => {
  const navigate = useNavigate();

  const handleCreateForumPost = async () => {
    try {
      navigate('/forum?action=new');
    } catch (error) {
      toast.error('Failed to create forum post');
    }
  };

  const handleManageResources = () => {
    navigate('/resources?action=manage');
  };

  const handleManageForum = () => {
    navigate('/forum?view=manage');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Management</CardTitle>
        <CardDescription>
          Manage forum posts, resources, and other content
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <FileText className="h-8 w-8 mb-2 text-family-blue" />
              <CardTitle className="text-lg">Forum Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Manage and moderate all forum posts and discussions.
              </p>
              <Button size="sm" className="w-full" onClick={handleManageForum}>
                Manage Forum Posts
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <Folder className="h-8 w-8 mb-2 text-family-green" />
              <CardTitle className="text-lg">Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Review and manage family resource materials and files.
              </p>
              <Button size="sm" className="w-full" onClick={handleManageResources}>
                Manage Resources
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <PlusCircle className="h-8 w-8 mb-2 text-family-orange" />
              <CardTitle className="text-lg">Add New Content</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Create new resources, forum categories, or other content.
              </p>
              <Button size="sm" className="w-full" onClick={handleCreateForumPost}>
                Create New Post
              </Button>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentManagement;
