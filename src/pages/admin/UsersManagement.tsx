
import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsersManagementProps {
  users: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const UsersManagement = ({ users, searchTerm, onSearchChange }: UsersManagementProps) => {
  const { user: currentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleRoleUpdate = async (userId: string, currentRole: string) => {
    if (!currentUser || userId === currentUser.id) {
      toast.error("You cannot change your own role");
      return;
    }

    setIsUpdating(userId);
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`User role updated to ${newRole}`);
      // Refresh the page to show updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
        <CardDescription>
          Manage users, roles, and permissions
        </CardDescription>
        <div className="mt-2">
          <Input 
            placeholder="Search users..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Login</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === 'admin' ? 'outline' : 'secondary'}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.isPremium ? 'default' : 'secondary'} className={user.isPremium ? 'bg-family-orange' : ''}>
                    {user.isPremium ? 'Premium' : 'Basic'}
                  </Badge>
                </TableCell>
                <TableCell>{user.lastLogin}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleUpdate(user.id, user.role)}
                      disabled={isUpdating === user.id || user.id === currentUser?.id}
                    >
                      {isUpdating === user.id ? 'Updating...' : `Make ${user.role === 'admin' ? 'Member' : 'Admin'}`}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">Next</Button>
      </CardFooter>
    </Card>
  );
};

export default UsersManagement;
