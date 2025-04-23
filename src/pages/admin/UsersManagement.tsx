import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const createUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  role: z.enum(['user', 'admin', 'moderator']),
  sendInvite: z.boolean().default(true)
});

const inviteUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['user', 'admin', 'moderator']),
  message: z.string().optional()
});

const UsersManagement = ({ users, searchTerm, onSearchChange, onUserAdded }) => {
  const { user: currentUser } = useAuth();
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [isSendingInvite, setIsSendingInvite] = useState(false);

  const createUserForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      name: '',
      role: 'user',
      sendInvite: true
    },
  });

  const inviteUserForm = useForm({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: 'user',
      message: ''
    },
  });

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
      window.location.reload();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update user role');
    } finally {
      setIsUpdating(null);
    }
  };

  const onCreateUser = async (data) => {
    setIsCreatingUser(true);
    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: `Temp${Math.floor(100000 + Math.random() * 900000)}!`,
        options: {
          data: {
            name: data.name,
            role: data.role
          }
        }
      });

      if (signUpError) throw signUpError;

      if (data.sendInvite) {
        try {
          const { error: emailError } = await supabase.functions.invoke('send-invitation', {
            body: {
              email: data.email,
              name: data.name,
              role: data.role,
              inviter: currentUser?.name || 'Admin'
            }
          });
          
          if (emailError) {
            console.warn('Email invitation could not be sent:', emailError);
            toast.warning('User created, but invitation email could not be sent');
          } else {
            toast.success('User created successfully. An invitation has been sent.');
          }
        } catch (emailErr) {
          console.warn('Email sending error:', emailErr);
          toast.warning('User created, but invitation email could not be sent');
        }
      } else {
        toast.success('User created successfully.');
      }
      
      setIsCreateDialogOpen(false);
      createUserForm.reset();
      onUserAdded();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user: ' + error.message);
    } finally {
      setIsCreatingUser(false);
    }
  };

  const onInviteUser = async (data) => {
    setIsSendingInvite(true);
    try {
      const { error: invitationError } = await supabase
        .from('invitations')
        .insert({
          email: data.email,
          role: data.role,
          invited_by: currentUser?.id,
          status: 'pending'
        });

      if (invitationError) throw invitationError;

      const tempPassword = `Temp${Math.floor(100000 + Math.random() * 900000)}!`;
      
      const { data: userData, error: createError } = await supabase.auth.signUp({
        email: data.email,
        password: tempPassword,
        options: {
          data: {
            role: data.role,
            invited_by: currentUser?.id
          }
        }
      });

      if (createError) throw createError;
      
      try {
        const { error: emailError } = await supabase.functions.invoke('send-invitation', {
          body: {
            email: data.email,
            role: data.role,
            inviter: currentUser?.name || 'Admin',
            message: data.message,
            temporaryPassword: tempPassword
          }
        });
        
        if (emailError) {
          console.warn('Email invitation could not be sent:', emailError);
          toast.warning('User invited, but email could not be sent. They will need to use password reset.');
        } else {
          toast.success(`Invitation sent to ${data.email} for ${data.role} role`);
        }
      } catch (emailErr) {
        console.warn('Email sending error:', emailErr);
        toast.warning('User invited, but email could not be sent. They will need to use password reset.');
      }
      
      setIsInviteDialogOpen(false);
      inviteUserForm.reset();
      onUserAdded();
    } catch (error) {
      console.error('Error inviting user:', error);
      toast.error('Failed to invite user: ' + error.message);
    } finally {
      setIsSendingInvite(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage users, roles, and permissions</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsInviteDialogOpen(true)}
            >
              Invite User
            </Button>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              Create User
            </Button>
          </div>
        </div>
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
                  <Badge variant={user.isPremium ? 'default' : 'secondary'} 
                    className={user.isPremium ? 'bg-family-orange' : ''}>
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
      
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>Add a new user to the system</DialogDescription>
          </DialogHeader>
          <Form {...createUserForm}>
            <form onSubmit={createUserForm.handleSubmit(onCreateUser)} className="space-y-4">
              <FormField
                control={createUserForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={createUserForm.control}
                name="sendInvite"
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
                    <div>
                      <FormLabel className="m-0">Send invitation email</FormLabel>
                      <FormDescription className="text-xs">
                        The user will receive an email with login instructions
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isCreatingUser}>
                  {isCreatingUser ? 'Creating...' : 'Create User'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>Send an invitation to join the platform</DialogDescription>
          </DialogHeader>
          <Form {...inviteUserForm}>
            <form onSubmit={inviteUserForm.handleSubmit(onInviteUser)} className="space-y-4">
              <FormField
                control={inviteUserForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={inviteUserForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This determines what permissions the user will have in the system
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={inviteUserForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Message (Optional)</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Add a personal message to the invitation"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      This message will be included in the invitation email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSendingInvite}>
                  {isSendingInvite ? 'Sending...' : 'Send Invitation'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">Next</Button>
      </CardFooter>
    </Card>
  );
};

export default UsersManagement;
