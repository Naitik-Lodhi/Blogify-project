// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = (user: User) => {
    setUser(user);
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("loggedInUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    if (import.meta.env.DEV) {
      throw new Error("useAuth must be used within AuthProvider");
    } else {
      console.error("useAuth called outside AuthProvider");
      return { user: null, login: () => {}, logout: () => {} };
    }
  }

  return context;
};
