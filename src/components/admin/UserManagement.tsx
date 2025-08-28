import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus, Edit, Trash2, Shield, Headphones } from "lucide-react";
import {
  addUser,
  updateUser,
  deleteUser,
  toggleUserStatus as toggleUserStatusDB,
  fetchUsers,
} from "@/lib/supabase";

interface User {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: "admin" | "callcentre";
  status: "active" | "inactive";
  createdAt: string;
  lastLogin: string;
}

const addUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  employeeId: z
    .string()
    .min(3, { message: "Employee ID must be at least 3 characters" }),
  role: z.enum(["admin", "callcentre"], { message: "Please select a role" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

const editUserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  employeeId: z
    .string()
    .min(3, { message: "Employee ID must be at least 3 characters" }),
  role: z.enum(["admin", "callcentre"], { message: "Please select a role" }),
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters if provided",
    }),
});

type UserFormValues = z.infer<typeof addUserSchema>;

interface UserManagementProps {
  theme: "light" | "dark";
}

const UserManagement = ({ theme = "light" }: UserManagementProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Load users from database
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchUsers();
      if (data) {
        const formattedUsers = data.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          employeeId: user.employee_id,
          role: user.role,
          status: user.status,
          createdAt: user.created_at
            ? new Date(user.created_at).toISOString().split("T")[0]
            : "",
          lastLogin: user.last_login
            ? new Date(user.last_login).toISOString().split("T")[0]
            : "Never",
        }));
        setUsers(formattedUsers);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(editingUser ? editUserSchema : addUserSchema),
    defaultValues: {
      name: "",
      email: "",
      employeeId: "",
      role: "callcentre",
      password: "",
    },
  });

  const onSubmit = async (data: UserFormValues) => {
    try {
      if (editingUser) {
        // Update existing user - only include password if it's provided
        const updateData: any = {
          name: data.name,
          email: data.email,
          employeeId: data.employeeId,
          role: data.role,
        };

        // Only include password if it's not empty
        if (data.password && data.password.trim() !== "") {
          updateData.password = data.password;
        }

        const result = await updateUser(editingUser.id, updateData);

        if (result.success) {
          await loadUsers(); // Reload users from database
          setEditingUser(null);
        } else {
          console.error("Failed to update user:", result.error);
          Swal.fire({
            title: "Error!",
            text: "Failed to update user. Please try again.",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
          });
          return;
        }
      } else {
        // Add new user
        const newUser: User = {
          id: "", // Will be set by database
          name: data.name,
          email: data.email,
          employeeId: data.employeeId,
          role: data.role,
          status: "active",
          createdAt: new Date().toISOString(),
          lastLogin: "Never",
        };

        const result = await addUser({
          name: data.name,
          email: data.email,
          employeeId: data.employeeId,
          role: data.role,
          password: data.password,
        });

        if (result.success) {
          await loadUsers(); // Reload users from database
        } else {
          console.error("Failed to add user:", result.error);
          Swal.fire({
            title: "Error!",
            text: "Failed to add user. Please try again.",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
          });
          return;
        }
      }

      form.reset();
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error submitting user form:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    // Reset form with new schema resolver for editing
    form.reset({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      role: user.role,
      password: "", // Don't pre-fill password for security
    });
    setIsAddDialogOpen(true);
  };

  // Update form resolver when editing state changes
  React.useEffect(() => {
    const currentResolver = editingUser ? editUserSchema : addUserSchema;
    form.reset(form.getValues(), { resolver: zodResolver(currentResolver) });
  }, [editingUser, form]);

  const handleDelete = async (userId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      buttonsStyling: true,
      customClass: {
        confirmButton: "!bg-red-600 !text-white !border-red-600 hover:!bg-red-700",
        cancelButton: "!bg-gray-500 !text-white !border-gray-500 hover:!bg-gray-600"
      }
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteUser(userId);
        if (deleteResult.success) {
          await loadUsers(); // Reload users from database
          Swal.fire({
            title: "Deleted!",
            text: "User has been deleted.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          console.error("Failed to delete user:", deleteResult.error);
          Swal.fire({
            title: "Error!",
            text: "Failed to delete user. Please try again.",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire({
          title: "Error!",
          text: "An error occurred. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    }
  };

  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find((u) => u.id === userId);
      if (!user) return;

      const result = await toggleUserStatusDB(userId, user.status);
      if (result.success) {
        await loadUsers(); // Reload users from database
      } else {
        console.error("Failed to toggle user status:", result.error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update user status. Please try again.",
          icon: "error",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Error toggling user status:", error);
      Swal.fire({
        title: "Error!",
        text: "An error occurred. Please try again.",
        icon: "error",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  const getRoleIcon = (role: string) => {
    return role === "admin" ? (
      <Shield className="h-4 w-4" />
    ) : (
      <Headphones className="h-4 w-4" />
    );
  };

  const getRoleColor = (role: string) => {
    return role === "admin"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-green-100 text-green-800 border-green-200";
  };

  const getStatusColor = (status: string) => {
    return status === "active"
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Users
                </p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <div className="bg-blue-100 p-2 rounded-full">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Active Users
                </p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.status === "active").length}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-full">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Call Centre Staff
                </p>
                <p className="text-2xl font-bold">
                  {users.filter((u) => u.role === "callcentre").length}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-full">
                <Headphones className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className={theme === "dark" ? "bg-gray-800 border-gray-700" : ""}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>
                Manage system users and their access levels
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setEditingUser(null);
                    form.reset();
                  }}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "Edit User" : "Add New User"}
                  </DialogTitle>
                  <DialogDescription>
                    {editingUser
                      ? "Update user information and access level"
                      : "Create a new user account with appropriate access level"}
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="john@company.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="employeeId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employee ID</FormLabel>
                          <FormControl>
                            <Input placeholder="CC001" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Access Level</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select access level" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="admin">
                                Administrator
                              </SelectItem>
                              <SelectItem value="callcentre">
                                Call Centre Staff
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {editingUser
                              ? "New Password (leave blank to keep current)"
                              : "Password"}
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">
                        {editingUser ? "Update User" : "Create User"}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-muted-foreground">Loading users...</div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage
                            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                          />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {user.employeeId}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getRoleColor(user.role)}
                        variant="outline"
                      >
                        <div className="flex items-center space-x-1">
                          {getRoleIcon(user.role)}
                          <span>
                            {user.role === "admin"
                              ? "Administrator"
                              : "Call Centre"}
                          </span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getStatusColor(user.status)}
                        variant="outline"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{user.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(user.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
