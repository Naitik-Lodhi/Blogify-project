// services/authService.ts

import type { User } from "../types/user";

const USERS_KEY = "users";
const SESSION_KEY = "loggedInUser";  // unified with AuthContext storage key

export const getUsers = (): User[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUsers = (users: User[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const signup = (user: Omit<User, "id" | "createdAt">): string | null => {
  const users = getUsers();
  const existing = users.find((u) => u.email === user.email);
  if (existing) return "User already exists";

  const newUser: User = {
    ...user,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);
  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  return null;
};

export const login = (email: string, password: string): string | null => {
  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return "Invalid credentials";
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return null;
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(SESSION_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};
