import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingPhone: string;
  otpSent: boolean;
  login: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<{ isNewUser: boolean }>;
  completeProfile: (data: Partial<User>) => Promise<void>;
  logout: () => void;
}

interface AuthTokens {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  mobileNumber: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_API_BASE_URL = 'http://localhost:8080/homelens';
const API_BASE_URL = (import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE_URL).replace(/\/$/, '');
const AUTH_STORAGE_KEY = 'homelens.auth';
const USER_STORAGE_KEY = 'homelens.user';
const DEVICE_STORAGE_KEY = 'homelens.deviceId';

const getDeviceId = () => {
  if (typeof localStorage === 'undefined') return 'web';
  const existing = localStorage.getItem(DEVICE_STORAGE_KEY);
  if (existing) return existing;
  const id = crypto.randomUUID();
  localStorage.setItem(DEVICE_STORAGE_KEY, id);
  return id;
};

const isExpired = (expiresAt?: string, bufferMs = 30000) => {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() - bufferMs <= Date.now();
};

const readStoredAuth = (): AuthTokens | null => {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthTokens;
  } catch {
    return null;
  }
};

const writeStoredAuth = (tokens: AuthTokens) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(tokens));
};

const clearStoredAuth = () => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const readStoredUser = (): User | null => {
  if (typeof localStorage === 'undefined') return null;
  const raw = localStorage.getItem(USER_STORAGE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as User;
    return {
      ...parsed,
      createdAt: parsed.createdAt ? new Date(parsed.createdAt) : new Date(),
    };
  } catch {
    return null;
  }
};

const writeStoredUser = (user: User) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
};

const clearStoredUser = () => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(USER_STORAGE_KEY);
};

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

const request = async <T,>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const message = await parseResponse(response);
    throw new Error(typeof message === 'string' ? message : 'Request failed');
  }

  return parseResponse(response) as Promise<T>;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pendingPhone, setPendingPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    const storedUser = readStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const sendOtp = async (phone: string) => {
    await request('/auth/otp/send', {
      method: 'POST',
      body: JSON.stringify({ mobileNumber: phone }),
    });
  };

  const refreshTokens = async (tokens: AuthTokens) => {
    const refreshed = await request<{
      accessToken: string;
      accessTokenExpiresAt: string;
      refreshToken: string;
      refreshTokenExpiresAt: string;
      isSignedIn: boolean;
    }>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({
        refreshToken: tokens.refreshToken,
        deviceId: getDeviceId(),
      }),
    });

    const updatedTokens: AuthTokens = {
      accessToken: refreshed.accessToken,
      accessTokenExpiresAt: refreshed.accessTokenExpiresAt,
      refreshToken: refreshed.refreshToken,
      refreshTokenExpiresAt: refreshed.refreshTokenExpiresAt,
      mobileNumber: tokens.mobileNumber,
    };

    writeStoredAuth(updatedTokens);
    return updatedTokens;
  };

  const ensureAccessToken = async () => {
    const stored = readStoredAuth();
    if (!stored) return null;
    if (!isExpired(stored.accessTokenExpiresAt)) {
      return stored.accessToken;
    }

    if (isExpired(stored.refreshTokenExpiresAt)) {
      clearStoredAuth();
      return null;
    }

    try {
      const refreshed = await refreshTokens(stored);
      return refreshed.accessToken;
    } catch {
      clearStoredAuth();
      clearStoredUser();
      setUser(null);
      if (stored.mobileNumber) {
        setPendingPhone(stored.mobileNumber);
        try {
          await sendOtp(stored.mobileNumber);
          setOtpSent(true);
        } catch {
          setOtpSent(false);
        }
      }
      return null;
    }
  };

  const login = async (phone: string) => {
    setIsLoading(true);
    try {
      await sendOtp(phone);
      setPendingPhone(phone);
      setOtpSent(true);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otp: string): Promise<{ isNewUser: boolean }> => {
    setIsLoading(true);
    try {
      const response = await request<{
        accessToken: string;
        accessTokenExpiresAt: string;
        refreshToken: string;
        refreshTokenExpiresAt: string;
        isSignedIn: boolean;
      }>('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({
          mobileNumber: pendingPhone,
          otp,
          deviceId: getDeviceId(),
        }),
      });

      const tokens: AuthTokens = {
        accessToken: response.accessToken,
        accessTokenExpiresAt: response.accessTokenExpiresAt,
        refreshToken: response.refreshToken,
        refreshTokenExpiresAt: response.refreshTokenExpiresAt,
        mobileNumber: pendingPhone,
      };
      writeStoredAuth(tokens);

      if (response.isSignedIn) {
        const storedUser = readStoredUser();
        if (storedUser?.phone === pendingPhone) {
          setUser(storedUser);
        } else {
          const newUser: User = {
            id: pendingPhone,
            phone: pendingPhone,
            isVerified: true,
            createdAt: new Date(),
          };
          writeStoredUser(newUser);
          setUser(newUser);
        }
      }

      return { isNewUser: !response.isSignedIn };
    } finally {
      setIsLoading(false);
    }
  };

  const completeProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const accessToken = await ensureAccessToken();
      if (!accessToken) {
        throw new Error('Session expired. Please verify OTP again.');
      }

      await request('/auth/signIn', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          userName: data.username,
          age: data.age,
          email: data.email,
          deviceId: getDeviceId(),
        }),
      });

      const newUser: User = {
        id: pendingPhone,
        phone: pendingPhone,
        username: data.username,
        email: data.email,
        age: data.age,
        gender: data.gender,
        isVerified: true,
        createdAt: new Date(),
      };

      writeStoredUser(newUser);
      setUser(newUser);
      setOtpSent(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setPendingPhone('');
    setOtpSent(false);
    clearStoredAuth();
    clearStoredUser();
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      pendingPhone,
      otpSent,
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
