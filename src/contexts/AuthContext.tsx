'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// Define your API URL
const API_URL = 'https://strataforge.buyinbytes.com/api';

// Define the type for the user
type User = {
  id: string;
  walletAddress?: string;
  name?: string;
  email?: string;
  role?: string;
  verificationStatus?: string;
  phoneNumber?: string;
  createdAt?: string;
  // Add other user properties as needed
};

// Define the type for the auth context
type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  role: string;
  register: (userData: {
    walletAddress: string;
    name: string;
    email: string;
    role?: string;
  }) => Promise<any>;
  verifyEmail: (verificationData: {
    email: string;
    otp: string;
  }) => Promise<any>;
  resendOtp: (email: string) => Promise<any>;
  login: (credentials: { walletAddress: string }) => Promise<any>;
  // getProfile: () => Promise<User>;
  // updateProfile: (profileData: Partial<User>) => Promise<any>;
  //logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<string>('');
  const router = useRouter();

  // Initialize axios with token if it exists
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
  }, []);

  // Check for existing token on initial load (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const storedRole = localStorage.getItem('role');

      if (token) {
        // Profile endpoint not ready yet - just set stored role if available
        // getProfile().catch(() => {
        //   // If profile fetch fails, token might be invalid
        //   if (typeof window !== 'undefined') {
        //     localStorage.removeItem('token');
        //     localStorage.removeItem('role');
        //   }
        //   setUser(null);
        //   setRole('');
        // });

        if (storedRole) {
          setRole(storedRole);
        }
      }
    }
  }, []);

  // Helper function to handle auth response
  const handleAuthResponse = (responseData: any) => {
    const { token, user: userData } = responseData.data;

    if (typeof window !== 'undefined') {
      // Store auth data
      localStorage.setItem('token', token);
      localStorage.setItem('role', userData.role || 'user');
      // Set token for future requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    setUser(userData);
    setRole(userData.role || 'user');
    setError(null);

    return { token, userData };
  };

  // Login user
  const login = async (credentials: { walletAddress: string }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      // Extract data from response
      const { token, user: userData } = response.data.data;

      // Store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('role', userData.role || 'user');
        // Set token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }

      setUser(userData);
      setRole(userData.role || 'user');
      setError(null);
      
      return response.data;
    } catch (err: any) {
      // Clear any existing auth data on error
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        delete axios.defaults.headers.common['Authorization'];
      }
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (userData: {
    walletAddress: string;
    name: string;
    email: string;
    role?: string;
  }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        walletAddress: userData.walletAddress,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user'
      });

      // Store email for verification
      if (typeof window !== 'undefined') {
        localStorage.setItem('registrationEmail', userData.email);
        localStorage.setItem('userRole', userData.role || 'user');
      }

      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Verify email with OTP
  const verifyEmail = async (verificationData: {
    email: string;
    otp: string;
  }) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, verificationData);
      const userData = response.data.data.user;
      const token = response.data.data.token;

      // After successful verification, store auth data
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        const userRole = userData.role || localStorage.getItem('userRole') || 'user';
        localStorage.setItem('role', userRole);
        
        // Set token for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Clean up temporary data
        localStorage.removeItem('registrationEmail');
        localStorage.removeItem('userRole');
      }

      setUser(userData);
      setRole(userData.role || 'user');
      setError(null);

      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const resendOtp = async (email: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, { email });
      setError(null);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get user profile - COMMENTED OUT UNTIL ENDPOINT IS READY
  // const getProfile = async (): Promise<User> => {
  //   setLoading(true);
  //   try {
  //     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  //     if (!token) {
  //       throw new Error('No authentication token found');
  //     }

  //     const response = await axios.get(`${API_URL}/auth/me`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const userData = response.data.data.user;
  //     setUser(userData);
  //     setRole(userData.role || 'user');

  //     if (typeof window !== 'undefined') {
  //       localStorage.setItem('role', userData.role || 'user');
  //     }

  //     setError(null);
  //     return userData;
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || err.message);

  //     // If unauthorized, clear token and user
  //     if (err.response?.status === 401) {
  //       if (typeof window !== 'undefined') {
  //         localStorage.removeItem('token');
  //         localStorage.removeItem('role');
  //       }
  //       setUser(null);
  //       setRole('');
  //     }

  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Update user profile - COMMENTED OUT UNTIL ENDPOINT IS READY
  // const updateProfile = async (profileData: Partial<User>) => {
  //   setLoading(true);
  //   try {
  //     const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  //     if (!token) {
  //       throw new Error('No authentication token found');
  //     }

  //     const response = await axios.put(`${API_URL}/auth/me`, profileData, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const updatedUser = response.data.data.user;
  //     setUser(updatedUser);

  //     // Update role if it changed
  //     if (updatedUser.role && updatedUser.role !== role) {
  //       setRole(updatedUser.role);
  //       if (typeof window !== 'undefined') {
  //         localStorage.setItem('role', updatedUser.role);
  //       }
  //     }

  //     setError(null);
  //     return response.data;
  //   } catch (err: any) {
  //     setError(err.response?.data?.message || err.message);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };

//   // Logout user
//   const logout = () => {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('token');
//       localStorage.removeItem('role');
//     }

//     setUser(null);
//     setRole('');
//     router.push('/login');
//   };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        setError,
        role,
        register,
        verifyEmail,
        resendOtp,
        login,
        // getProfile,
        // updateProfile,
        //logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};