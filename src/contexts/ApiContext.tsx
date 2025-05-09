// 'use client';

// import { createContext, useContext, useState, ReactNode } from 'react';
// import axios from 'axios';

// // Define your API URL - consider using environment variables
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://your-api-url/api';

// // Create a type for the API context
// type ApiContextType = {
//   // States
//   properties: any[];
//   propertyDetails: any;
//   categories: any[];
//   loading: boolean;
//   error: string | null;

//   // Property endpoints
//   fetchProperties: (filters?: any) => Promise<any>;
//   fetchPropertyById: (id: string) => Promise<any>;
//   createProperty: (propertyData: any) => Promise<any>;
//   updateProperty: (id: string, propertyData: any) => Promise<any>;
//   deleteProperty: (id: string) => Promise<any>;
//   verifyProperty: (id: string) => Promise<any>;
//   fetchMyProperties: (filters?: any) => Promise<any>;
//   fetchPropertiesByOwner: (ownerId: string, filters?: any) => Promise<any>;

//   // Category endpoints
//   fetchCategories: () => Promise<any>;
// };

// export const ApiContext = createContext<ApiContextType | null>(null);

// type ApiProviderProps = {
//   children: ReactNode;
// };

// export const ApiProvider = ({ children }: ApiProviderProps) => {
//   const [properties, setProperties] = useState<any[]>([]);
//   const [propertyDetails, setPropertyDetails] = useState<any>(null);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   // Create axios instance with auth token
//   const createAxiosInstance = () => {
//     let token = '';
//     if (typeof window !== 'undefined') {
//       token = localStorage.getItem('token') || '';
//     }

//     return axios.create({
//       headers: {
//         Authorization: token ? `Bearer ${token}` : '',
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });
//   };

//   // Fetch properties with optional filters
//   const fetchProperties = async (filters: any = {}) => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       const response = await axiosInstance.get(`${API_URL}/properties`, {
//         params: filters,
//       });

//       setProperties(response.data.data.properties);
//       setError(null);
//       return response.data.data;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       return { properties: [], pagination: { total: 0 } };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch a property by ID
//   const fetchPropertyById = async (id: string) => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       const response = await axiosInstance.get(`${API_URL}/properties/${id}`);

//       setPropertyDetails(response.data.data.property);
//       setError(null);
//       return response.data.data.property;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Create a new property
//   const createProperty = async (propertyData: any) => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       const response = await axiosInstance.post(`${API_URL}/properties`, propertyData);

//       setError(null);
//       return response.data.data.property;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Update a property
//   const updateProperty = async (id: string, propertyData: any) => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       const response = await axiosInstance.put(`${API_URL}/properties/${id}`, propertyData);

//       setError(null);
//       return response.data.data.property;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete a property
//   const deleteProperty = async (id: string) => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       await axiosInstance.delete(`${API_URL}/properties/${id}`);

//       setError(null);
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Verify a property (for verifiers only)
//   const verifyProperty = async (id: string) => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       const response = await axiosInstance.patch(`${API_URL}/properties/${id}/verify`);

//       setError(null);
//       return response.data.data.property;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch properties owned by the current user
//   const fetchMyProperties = async (filters: any = {}) => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       const response = await axiosInstance.get(`${API_URL}/properties/my/properties`, {
//         params: filters,
//       });

//       setError(null);
//       return response.data.data;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       return { properties: [], pagination: { total: 0 } };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch properties by owner ID
//   const fetchPropertiesByOwner = async (ownerId: string, filters: any = {}) => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       const response = await axiosInstance.get(`${API_URL}/properties/owner/${ownerId}`, {
//         params: filters,
//       });

//       setError(null);
//       return response.data.data;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       return { properties: [], pagination: { total: 0 } };
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch all categories
//   const fetchCategories = async () => {
//     setLoading(true);
//     try {
//       const axiosInstance = createAxiosInstance();
//       const response = await axiosInstance.get(`${API_URL}/categories`);

//       setCategories(response.data.data);
//       setError(null);
//       return response.data.data;
//     } catch (err: any) {
//       setError(err.response?.data?.message || err.message);
//       return [];
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ApiContext.Provider
//       value={{
//         // States
//         properties,
//         propertyDetails,
//         categories,
//         loading,
//         error,

//         // Property methods
//         fetchProperties,
//         fetchPropertyById,
//         createProperty,
//         updateProperty,
//         deleteProperty,
//         verifyProperty,
//         fetchMyProperties,
//         fetchPropertiesByOwner,

//         // Category methods
//         fetchCategories,
//       }}
//     >
//       {children}
//     </ApiContext.Provider>
//   );
// };

// export const useApi = () => {
//   const context = useContext(ApiContext);
//   if (context === null) {
//     throw new Error('useApi must be used within an ApiProvider');
//   }
//   return context;
// };
