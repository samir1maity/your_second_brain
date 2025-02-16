"use client";

import { userLogin } from "@/Api/user";
import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";

type User = {
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null | undefined;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    // Check if user is logged in (e.g., by checking localStorage or a token)
    const storedUser = localStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null)
  }, []);

  const login = async (email: string, password: string) => {
    const userlogin = await userLogin(email, password);
    localStorage.setItem("user", JSON.stringify(userlogin));
    setUser(userlogin);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {user !== undefined && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
