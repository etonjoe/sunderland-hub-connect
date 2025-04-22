
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/contexts/AuthContext';
import { Announcement } from '@/types';
import { Bell, Pin, Search, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Form schema for creating an announcement
const announcementSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  isPinned: z.boolean().default(false)
});

// Sample data
const ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'Annual Family Reunion',
    content: 'Our annual family reunion is scheduled for July 15-17 at Sunderland Park. Save the date!',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date('2023-05-10'),
    isPinned: true
  },
  {
    id: '2',
    title: 'New Family History Documents',
    content: 'Several new family history documents have been added to the Resources section. Check them out!',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date('2023-05-15'),
    isPinned: true
  },
  {
    id: '3',
    title: 'Memorial Service for Uncle Robert',
    content: 'The memorial service for Uncle Robert will be held on June 5th at 2:00 PM at St. Mary\'s Church.',
    authorId: '3',
    authorName: 'Premium User',
    createdAt: new Date('2023-05-12'),
    isPinned: false
  },
  {
    id: '4',
    title: 'Family Newsletter Submissions',
    content: 'Please submit your updates for the quarterly family newsletter by the end of this month.',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date('2023-05-08'),
    isPinned: false
  },
  {
    id: '5',
    title: 'Website Update',
    content: 'We\'ve updated the SunderlandFamily Hub with new features! Check out the Resources and Chat features.',
    authorId: '1',
    authorName: 'Admin User',
    createdAt: new Date('2023-05-05'),
    isPinned: false
  }
];

const Announcements = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [announcements, setAnnouncements] = useState<Announcement[]>(ANNOUNCEMENTS);
  
  const isAdmin = user?.role === 'admin';
  
  const form = useForm<z.infer<typeof announcementSchema>>({
    resolver: zodResolver(announcementSchema),
    defaultValues: {
      title: '',
      content: '',
      isPinned: false
    }
  });

  useEffect(() => {
    // First show pinned announcements, then sort by date
    const sorted = [...announcements].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    if (searchQuery.trim() === '') {
      setFilteredAnnouncements(sorted);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredAnnouncements(sorted.filter(announcement => 
        announcement.title.toLowerCase().includes(query) || 
        announcement.content.toLowerCase().includes(query) ||
        announcement.authorName.toLowerCase().includes(query)
      ));
    }
  }, [searchQuery, announcements]);
  
  const fetchAnnouncements = async () => {
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
      
      if (data && data.length > 0) {
        const mappedData = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          authorId: item.author_id,
          authorName: 'Admin', // You would typically join with profiles table to get actual names
          createdAt: new Date(item.created_at),
          isPinned: item.is_pinned
        }));
        setAnnouncements(mappedData);
      }
    } catch (error) {
      console.error('Error in fetchAnnouncements:', error);
      toast.error('Failed to load announcements');
    }
  };
  
  useEffect(() => {
    // Try to fetch from Supabase, but fallback to sample data if not available
    fetchAnnouncements();
  }, []);
  
  const onSubmit = async (values: z.infer<typeof announcementSchema>) => {
    if (!user) {
      toast.error('You must be logged in to create an announcement');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([
          {
            title: values.title,
            content: values.content,
            is_pinned: values.isPinned,
            author_id: user.id
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      // Add the new announcement to the local state
      const newAnnouncement: Announcement = {
        id: data?.[0]?.id || `temp-${Date.now()}`,
        title: values.title,
        content: values.content,
        authorId: user.id,
        authorName: user.name || 'Unknown',
        createdAt: new Date(),
        isPinned: values.isPinned
      };
      
      setAnnouncements(prev => [newAnnouncement, ...prev]);
      
      toast.success('Announcement created successfully');
      form.reset();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div className="flex items-center">
          <Bell className="h-8 w-8 mr-3 text-family-orange" />
          <h1 className="text-3xl font-bold">Announcements</h1>
        </div>
        
        {isAdmin && (
          <Button 
            className="mt-4 sm:mt-0 bg-family-green hover:bg-green-600"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Announcement
          </Button>
        )}
      </div>
      
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search announcements..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="space-y-6">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements found matching your search.</p>
          </div>
        ) : (
          filteredAnnouncements.map(announcement => (
            <Card 
              key={announcement.id} 
              className={`overflow-hidden transition-all ${
                announcement.isPinned ? 'border-family-orange shadow-md' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <CardTitle className="text-xl font-semibold flex items-center">
                      {announcement.title}
                      {announcement.isPinned && (
                        <Badge className="ml-2 bg-family-orange">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Posted by {announcement.authorName} on {formatDate(announcement.createdAt)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4">
                <div className="prose max-w-none">
                  <p>{announcement.content}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        checked={field.value}
                        onChange={field.onChange}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </FormControl>
                    <FormLabel className="m-0">
                      Pin announcement to the top
                    </FormLabel>
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
    </div>
  );
};

export default Announcements;
