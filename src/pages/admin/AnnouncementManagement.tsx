
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Bell, Plus, Pin, Eye, Pencil, Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types';

// Form schema for creating/editing an announcement
const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  isPinned: z.boolean().default(false)
});

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);

  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      isPinned: false
    }
  });

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching announcements:', error);
        toast.error('Failed to load announcements');
        return;
      }
      
      if (data) {
        const mappedData = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          authorId: item.author_id,
          authorName: 'Admin', // In a real app, join with profiles table
          createdAt: new Date(item.created_at),
          isPinned: item.is_pinned
        }));
        setAnnouncements(mappedData);
        setFilteredAnnouncements(mappedData);
      }
    } catch (error) {
      console.error('Error in fetchAnnouncements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAnnouncements(announcements);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = announcements.filter(announcement => 
        announcement.title.toLowerCase().includes(query) || 
        announcement.content.toLowerCase().includes(query)
      );
      setFilteredAnnouncements(filtered);
    }
  }, [searchQuery, announcements]);

  const handleCreateAnnouncement = () => {
    form.reset({
      title: '',
      content: '',
      isPinned: false
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    form.reset({
      title: announcement.title,
      content: announcement.content,
      isPinned: announcement.isPinned
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };

  const onSubmitCreate = async (values: z.infer<typeof announcementSchema>) => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([
          {
            title: values.title,
            content: values.content,
            is_pinned: values.isPinned,
            author_id: '1' // In a real app, use the current user's ID
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast.success('Announcement created successfully');
      fetchAnnouncements();
      setIsCreateDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEdit = async (values: z.infer<typeof announcementSchema>) => {
    if (!currentAnnouncement) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          title: values.title,
          content: values.content,
          is_pinned: values.isPinned
        })
        .eq('id', currentAnnouncement.id);
      
      if (error) throw error;
      
      toast.success('Announcement updated successfully');
      fetchAnnouncements();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!currentAnnouncement) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', currentAnnouncement.id);
      
      if (error) throw error;
      
      toast.success('Announcement deleted successfully');
      fetchAnnouncements();
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const truncateContent = (content: string, maxLength = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-family-orange" />
              Announcement Management
            </CardTitle>
            <CardDescription>
              Create and manage family announcements
            </CardDescription>
          </div>
          <Button 
            className="bg-family-green hover:bg-green-600"
            onClick={handleCreateAnnouncement}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4" />
            <p>Loading announcements...</p>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4" />
            <p>No announcements found matching your search.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAnnouncements.map((announcement) => (
                <TableRow key={announcement.id}>
                  <TableCell className="font-medium">{announcement.title}</TableCell>
                  <TableCell>{truncateContent(announcement.content)}</TableCell>
                  <TableCell>{formatDate(announcement.createdAt)}</TableCell>
                  <TableCell>
                    {announcement.isPinned ? (
                      <Badge className="bg-family-orange">
                        <Pin className="h-3 w-3 mr-1" />
                        Pinned
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Regular</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditAnnouncement(announcement)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-500"
                        onClick={() => handleDeleteAnnouncement(announcement)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {/* Create Announcement Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
            <DialogDescription>
              Create a new announcement to share with all users
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitCreate)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter announcement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter announcement content" 
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Pin Announcement</FormLabel>
                      <FormDescription>
                        Pinned announcements always appear at the top
                      </FormDescription>
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
              
              <DialogFooter className="mt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-family-green hover:bg-green-600"
                >
                  {isSubmitting ? 'Creating...' : 'Create Announcement'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Announcement Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Update the announcement details
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter announcement title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter announcement content" 
                        rows={5}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isPinned"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Pin Announcement</FormLabel>
                      <FormDescription>
                        Pinned announcements always appear at the top
                      </FormDescription>
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
              
              <DialogFooter className="mt-6">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Updating...' : 'Update Announcement'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="pt-4 pb-6">
            {currentAnnouncement && (
              <p className="font-medium">{currentAnnouncement.title}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default AnnouncementManagement;
