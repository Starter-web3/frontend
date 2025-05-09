// 'use client';

// import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// import axios from 'axios';
// import { useRouter } from 'next/navigation';

// // Define your API URL - consider using environment variables
// const API_URL_AUTH = process.env.NEXT_PUBLIC_API_URL_AUTH || 'http://your-api-url/auth';

// // Define the type for the user
// type User = {
//   id: string;
//   walletAddress?: string;
//   name?: string;
//   email?: string;
//   role?: string;
//   verificationStatus?: string;
//   phoneNumber?: string;
//   createdAt?: string;
//   // Add other user properties as needed
// };

// // Define the type for the auth context
// type AuthContextType = {
//   user: User | null;
//   loading: boolean;
//   error: string | null;
//   role: string;
//   register: (userData: {
//     walletAddress: string;
//     name: string;
//     email: string;
//     role?: string;
//   }) => Promise<any>;
//   login: (credentials: { walletAddress: string }) => Promise<any>;
//   getProfile: () => Promise<User>;
//   updateProfile: (profileData: Partial<User>) => Promise<any>;
//   logout: () => void;
// };

// const AuthContext = createContext<AuthContextType | null>(null);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [role, setRole] = useState<string>('');
//   const router = useRouter();

//   // Check for existing token on initial load (client-side only)
//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('token');
//       const storedRole = localStorage.getItem('role');

//       if (token) {
//         // If token exists, try to fetch user profile
//         getProfile().catch(() => {
//           // If profile fetch fails, token might be invalid
//           if (typeof window !== 'undefined') {
//             localStorage.removeItem('token');
//             localStorage.removeItem('role');
//           }
//           setUser(null);
//           setRole('');
//         });

//         if (storedRole) {
//           setRole(storedRole);
//         }
//       }
//     }
//   }, []);

//   // Register user
//   const register = async (userData: {
//     walletAddress: string;
//     name: string;
//     email: string;
//     role?: string;
//   }) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${API_URL_AUTH}/register`, userData);

//       if (typeof window !== 'undefined') {
//         localStorage.setItem('token', response.data.data.token);
//         localStorage.setItem('role', response.data.data.user.role || 'user');
//       }

//       setUser(response.data.data.user);
//       setRole(response.data.data.user.role || 'user');
//       setError(null);
//       return response.data.data;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Login user
//   const login = async (credentials: { walletAddress: string }) => {
//     setLoading(true);
//     try {
//       const response = await axios.post(`${API_URL_AUTH}/login`, credentials);

//       if (typeof window !== 'undefined') {
//         localStorage.setItem('token', response.data.data.token);
//         localStorage.setItem('role', response.data.data.user.role || 'user');
//       }

//       setUser(response.data.data.user);
//       setRole(response.data.data.user.role || 'user');

//       // Handle redirection based on role
//       if (response.data.data.user.role === 'admin') {
//         router.push('/admin');
//       } else {
//         router.push('/dashboard');
//       }

//       setError(null);
//       return response.data.data;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Get user profile
//   const getProfile = async (): Promise<User> => {
//     setLoading(true);
//     try {
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await axios.get(`${API_URL_AUTH}/me`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const userData = response.data.data.user;
//       setUser(userData);
//       setRole(userData.role || 'user');

//       if (typeof window !== 'undefined') {
//         localStorage.setItem('role', userData.role || 'user');
//       }

//       setError(null);
//       return userData;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);

//       // If unauthorized, clear token and user
//       if (err.response?.status === 401) {
//         if (typeof window !== 'undefined') {
//           localStorage.removeItem('token');
//           localStorage.removeItem('role');
//         }
//         setUser(null);
//         setRole('');
//       }

//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update user profile
//   const updateProfile = async (profileData: Partial<User>) => {
//     setLoading(true);
//     try {
//       const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

//       if (!token) {
//         throw new Error('No authentication token found');
//       }

//       const response = await axios.put(`${API_URL_AUTH}/me`, profileData, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const updatedUser = response.data.data.user;
//       setUser(updatedUser);

//       // Update role if it changed
//       if (updatedUser.role && updatedUser.role !== role) {
//         setRole(updatedUser.role);
//         if (typeof window !== 'undefined') {
//           localStorage.setItem('role', updatedUser.role);
//         }
//       }

//       setError(null);
//       return response.data.data;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

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

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         loading,
//         error,
//         role,
//         register,
//         login,
//         getProfile,
//         updateProfile,
//         logout,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (context === null) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
