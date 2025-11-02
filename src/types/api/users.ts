import type { User } from "../domain";

export interface CreateUserResponse {
  user: User;
  password: string;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
}