import type { User } from "@/types/user";

export const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "teacher",
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "secretary",
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z",
  },
  {
    id: "4",
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "teacher",
    createdAt: "2023-01-04T00:00:00Z",
    updatedAt: "2023-01-04T00:00:00Z",
  },
  {
    id: "5",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "principal",
    createdAt: "2023-01-05T00:00:00Z",
    updatedAt: "2023-01-05T00:00:00Z",
  },
];
