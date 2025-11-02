import { mockUsers } from "@/constants/mockUsers";
import type { User } from "@/types";

export const userService = {
  getUsers: async (): Promise<{ data: User[]; total: number }> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const users = mockUsers;

    return {
      data: users,
      total: users.length,
    };
  },

  getUserById: async (id: string): Promise<User | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return mockUsers.find((user) => user.id === id);
  },

  createUser: async (
    user: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newUser: User = {
      ...user,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockUsers.push(newUser);
    return newUser;
  },

  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockUsers.findIndex((user) => user.id === id);
    if (index === -1) {
      throw new Error("User not found");
    }
    const updatedUser = {
      ...mockUsers[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    mockUsers[index] = updatedUser;
    return updatedUser;
  },

  deleteUser: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = mockUsers.findIndex((user) => user.id === id);
    if (index !== -1) {
      mockUsers.splice(index, 1);
    }
  },
};
