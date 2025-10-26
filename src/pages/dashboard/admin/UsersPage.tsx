import React, { useState, useEffect } from 'react';
import { Plus, Search, UserPlus, Pencil, Trash2, User, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { UserRole } from '@/types';
import { toast } from 'sonner';
const UsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - replace with API calls
  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Mock data
        const mockUsers: User[] = [
          { id: '1', name: 'John Doe', email: 'john@example.com', role: 'teacher' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'secretary' },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddUser = () => {
    setCurrentUser({ role: 'teacher' });
    setIsDialogOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser({ ...user });
    setIsDialogOpen(true);
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // TODO: Replace with actual API call
        // await api.deleteUser(userId);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
        toast('Failed to delete user');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser?.name || !currentUser?.email || !currentUser?.role) {
      toast('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      if (currentUser.id) {
        // Update existing user
        // TODO: Replace with actual API call
        // const updatedUser = await api.updateUser(currentUser.id, currentUser);
        setUsers(users.map((u) => (u.id === currentUser.id ? { ...u, ...currentUser } as User : u)));
        toast('User updated successfully');
      } else {
        // Add new user
        // TODO: Replace with actual API call
        // const newUser = await api.addUser(currentUser);
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          ...currentUser as Omit<User, 'id'>,
        };
        setUsers([...users, newUser]);
        toast('User added successfully');
      }
      setIsDialogOpen(false);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
      toast(`Failed to ${currentUser.id ? 'update' : 'add'} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'teacher':
        return 'bg-blue-100 text-blue-800';
      case 'secretary':
        return 'bg-green-100 text-green-800';
      case 'principal':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage teachers and secretaries in your organization
          </p>
        </div>
        <Button onClick={handleAddUser}>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="rounded-md border">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Loading users...
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  {searchTerm ? 'No users found' : 'No users available'}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span>{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge className={getRoleBadgeVariant(user.role)}>
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentUser?.id ? 'Edit User' : 'Add New User'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={currentUser?.name || ''}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, name: e.target.value } as User)
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className="pl-8"
                    value={currentUser?.email || ''}
                    onChange={(e) =>
                      setCurrentUser({ ...currentUser, email: e.target.value } as User)
                    }
                    required
                  />
                </div>
              </div>
              {!currentUser?.id && (
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-8"
                      onChange={(e) =>
                        setCurrentUser({ ...currentUser, password: e.target.value } as any)
                      }
                      required={!currentUser?.id}
                    />
                  </div>
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select
                  value={currentUser?.role}
                  onValueChange={(value: UserRole) =>
                    setCurrentUser({ ...currentUser, role: value } as User)
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="secretary">Secretary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setCurrentUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersPage;
