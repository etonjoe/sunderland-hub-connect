
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Announcement } from '@/types';
import { AnnouncementTable } from '@/components/admin/announcements/AnnouncementTable';
import { AnnouncementDialogs } from '@/components/admin/announcements/AnnouncementDialogs';

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

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const mappedData = data.map(item => ({
          id: item.id,
          title: item.title,
          content: item.content,
          authorId: item.author_id,
          authorName: 'Admin',
          createdAt: new Date(item.created_at),
          isPinned: item.is_pinned
        }));
        setAnnouncements(mappedData);
        setFilteredAnnouncements(mappedData);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
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
    setCurrentAnnouncement(null);
    setIsCreateDialogOpen(true);
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAnnouncement = (announcement: Announcement) => {
    setCurrentAnnouncement(announcement);
    setIsDeleteDialogOpen(true);
  };

  const onSubmitCreate = async (values: any) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('announcements')
        .insert([
          {
            title: values.title,
            content: values.content,
            is_pinned: values.isPinned,
            author_id: '1'
          }
        ]);
      
      if (error) throw error;
      
      toast.success('Announcement created successfully');
      fetchAnnouncements();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmitEdit = async (values: any) => {
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
          <AnnouncementTable
            announcements={filteredAnnouncements}
            onEdit={handleEditAnnouncement}
            onDelete={handleDeleteAnnouncement}
          />
        )}
      </CardContent>

      <AnnouncementDialogs
        isCreateDialogOpen={isCreateDialogOpen}
        setIsCreateDialogOpen={setIsCreateDialogOpen}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        currentAnnouncement={currentAnnouncement}
        isSubmitting={isSubmitting}
        onCreateSubmit={onSubmitCreate}
        onEditSubmit={onSubmitEdit}
        onDeleteConfirm={confirmDelete}
      />
    </Card>
  );
};

export default AnnouncementManagement;
