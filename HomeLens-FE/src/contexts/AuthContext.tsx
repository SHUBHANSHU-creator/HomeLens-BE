import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<{ isNewUser: boolean }>;
  completeProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState<string>('');

  const login = async (phone: string) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setPendingPhone(phone);
    setIsLoading(false);
  };

  const verifyOtp = async (otp: string): Promise<{ isNewUser: boolean }> => {
    setIsLoading(true);
    // Simulate OTP verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user exists (mock logic - in real app, this comes from backend)
    const existingUser = localStorage.getItem(`user_${pendingPhone}`);
    
    if (existingUser) {
      setUser(JSON.parse(existingUser));
      setIsLoading(false);
      return { isNewUser: false };
    }
    
    setIsLoading(false);
    return { isNewUser: true };
  };

  const completeProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser: User = {
      id: `user_${Date.now()}`,
      phone: pendingPhone,
      username: data.username,
      email: data.email,
      age: data.age,
      gender: data.gender,
      isVerified: false,
      createdAt: new Date(),
    };
    
    localStorage.setItem(`user_${pendingPhone}`, JSON.stringify(newUser));
    setUser(newUser);
    setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setPendingPhone('');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      verifyOtp,
      completeProfile,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
