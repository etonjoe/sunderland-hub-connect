
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  accepted_at: string | null;
  rejected_at: string | null;
  enrolled_at: string | null;
}

const InvitationsTracking = () => {
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error('Failed to load invitations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsDeletingId(id);
      
      // Delete the user account first if it exists
      const { data: invitationData, error: fetchError } = await supabase
        .from('invitations')
        .select('email')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching invitation details:', fetchError);
      } else if (invitationData?.email) {
        // Find and delete the user account with matching email
        const { data: userData, error: userFetchError } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', invitationData.email)
          .maybeSingle();
        
        if (!userFetchError && userData?.id) {
          // If user exists, delete the user account
          const { error: userDeleteError } = await supabase.auth.admin.deleteUser(userData.id);
          if (userDeleteError) {
            console.error('Error deleting user account:', userDeleteError);
          }
        }
      }
      
      // Delete the invitation record
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update local state to remove the deleted invitation
      setInvitations(invitations.filter(inv => inv.id !== id));
      toast.success('Invitation deleted successfully');
    } catch (error) {
      console.error('Error deleting invitation:', error);
      toast.error('Failed to delete invitation');
    } finally {
      setIsDeletingId(null);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'outline';  // Changed from 'success' to 'outline'
      case 'rejected': return 'destructive';
      case 'enrolled': return 'default';
      default: return 'secondary';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitations Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invited On</TableHead>
              <TableHead>Accepted</TableHead>
              <TableHead>Rejected</TableHead>
              <TableHead>Enrolled</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.length === 0 && !isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6">
                  No invitations found
                </TableCell>
              </TableRow>
            ) : (
              invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>{invitation.role}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(invitation.status)}>
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(invitation.created_at)}</TableCell>
                  <TableCell>{formatDate(invitation.accepted_at)}</TableCell>
                  <TableCell>{formatDate(invitation.rejected_at)}</TableCell>
                  <TableCell>{formatDate(invitation.enrolled_at)}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(invitation.id)}
                      disabled={isDeletingId === invitation.id || invitation.status !== 'pending'}
                    >
                      {isDeletingId === invitation.id ? (
                        <span className="animate-pulse">Deleting...</span>
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default InvitationsTracking;
