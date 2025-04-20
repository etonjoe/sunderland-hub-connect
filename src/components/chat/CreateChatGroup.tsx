
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CreateChatGroupProps {
  onGroupCreated: () => void;
}

const CreateChatGroup = ({ onGroupCreated }: CreateChatGroupProps) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Group name is required');
      return;
    }
    
    if (!user) {
      toast.error('You need to be logged in to create a group');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Insert the new chat group
      const { data: groupData, error: groupError } = await supabase
        .from('chat_groups')
        .insert({
          name,
          description,
          created_by: user.id
        })
        .select('id')
        .single();
      
      if (groupError) throw groupError;
      
      // Add the creator as a member
      const { error: memberError } = await supabase
        .from('chat_group_members')
        .insert({
          group_id: groupData.id,
          user_id: user.id,
          role: 'admin' // Group creator is an admin
        });
      
      if (memberError) throw memberError;
      
      toast.success('Chat group created successfully');
      setName('');
      setDescription('');
      onGroupCreated();
      setOpen(false);
    } catch (error) {
      console.error('Error creating chat group:', error);
      toast.error('Failed to create chat group');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <Plus className="mr-2 h-4 w-4" />
          Create New Group
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a New Chat Group</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label htmlFor="group-name" className="text-sm font-medium">Group Name</label>
            <Input
              id="group-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Family Reunion Planning"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="group-description" className="text-sm font-medium">Description</label>
            <Textarea
              id="group-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A group for planning our next family reunion"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Group'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatGroup;
