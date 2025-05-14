// 'use client';

// import React, { createContext, useContext, useState, ReactNode } from 'react';
// import axios from 'axios';

// // Define your API URL - consider using environment variables
// const API_URL_ADMIN = process.env.NEXT_PUBLIC_API_URL_ADMIN || 'http://your-api-url/admin';

// // Define the admin context type
// type AdminContextType = {
//   loading: boolean;
//   error: string | null;
//   dashboard: any | null;
//   orders: any[];
//   customers: any[];
//   categories: any[];
//   productStats: any[];
//   orderStats: any[];
//   salesStats: any[];
//   getDashboard: () => Promise<any>;

//   // Category management
//   getCategories: () => Promise<any>;
//   createCategory: (data: any) => Promise<any>;
//   createSubCategory: (categoryId: string, data: FormData) => Promise<any>;
//   createSubSubCategory: (subCategoryId: string, data: FormData) => Promise<any>;
//   updateCategory: (id: string, formData: FormData) => Promise<any>;
//   deleteCategory: (id: string) => Promise<any>;

//   // Product management
//   createProduct: (formData: FormData) => Promise<any>;
//   updateProduct: (id: string, formData: FormData) => Promise<any>;
//   deleteProduct: (id: string) => Promise<any>;
//   updateProductStock: (productId: string, stockQuantity: number) => Promise<any>;
//   archiveProduct: (id: string) => Promise<any>;
//   restoreProduct: (id: string) => Promise<any>;

//   // Media management
//   addProductImages: (productId: string, images: File[]) => Promise<any>;
//   deleteProductImage: (imageId: string) => Promise<any>;
//   updateProductImage: (imageId: string, updateData: any) => Promise<any>;

//   // Order management
//   getOrders: (params?: any) => Promise<any>;
//   getOrderDetails: (id: string) => Promise<any>;
//   updateOrderStatus: (id: string, status: string) => Promise<any>;
//   cancelOrder: (id: string) => Promise<any>;
//   getOrderStats: () => Promise<any>;
//   getSalesStats: () => Promise<any>;

//   // Customer management
//   getCustomers: (params?: any) => Promise<any>;
//   getCustomerDetails: (id: string) => Promise<any>;
//   deleteCustomer: (id: string) => Promise<any>;
//   banCustomer: (id: string, status: boolean) => Promise<any>;

//   // Review management
//   getAllReviews: () => Promise<any>;
//   deleteReview: (reviewId: string) => Promise<any>;
// };

// const AdminContext = createContext<AdminContextType | null>(null);

// export const AdminProvider = ({ children }: { children: ReactNode }) => {
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);
//   const [dashboard, setDashboard] = useState<any | null>(null);
//   const [orders, setOrders] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [categories, setCategories] = useState<any[]>([]);
//   const [productStats, setProductStats] = useState<any[]>([]);
//   const [orderStats, setOrderStats] = useState<any[]>([]);
//   const [salesStats, setSalesStats] = useState<any[]>([]);

//   // Create axios instance with auth token
//   const createAxiosInstance = () => {
//     let token = '';
//     if (typeof window !== 'undefined') {
//       token = localStorage.getItem('token') || '';
//     }

//     return axios.create({
//       baseURL: API_URL_ADMIN,
//       headers: {
//         Authorization: token ? `Bearer ${token}` : '',
//         Accept: 'application/json',
//         'Content-Type': 'application/json',
//       },
//     });
//   };

//   // Generic request handler
//   const handleRequest = async (callback: (instance: any) => Promise<any>) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const instance = createAxiosInstance();
//       const response = await callback(instance);
//       return response?.data?.data;
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || err.message || 'Request failed';
//       setError(errorMessage);
//       throw new Error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // DASHBOARD ENDPOINTS
//   const getDashboard = async () => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get('/dashboard');
//       setDashboard(res?.data?.data);
//       return res;
//     });
//   };

//   // CATEGORY ENDPOINTS
//   const getCategories = async () => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get('/categories');
//       setCategories(res.data.data);
//       return res;
//     });
//   };

//   const createCategory = async (data: any) => {
//     return handleRequest((instance) => instance.post('/categories', data));
//   };

//   const createSubCategory = async (categoryId: string, data: FormData) => {
//     return handleRequest((instance) => {
//       const headers = {
//         ...instance.defaults.headers.common,
//         'Content-Type': 'multipart/form-data',
//       };
//       return instance.post(`/categories/${categoryId}/sub`, data, { headers });
//     });
//   };

//   const createSubSubCategory = async (subCategoryId: string, data: FormData) => {
//     return handleRequest((instance) => {
//       const headers = {
//         ...instance.defaults.headers.common,
//         'Content-Type': 'multipart/form-data',
//       };
//       return instance.post(`/categories/${subCategoryId}/subsub`, data, { headers });
//     });
//   };

//   const updateCategory = async (id: string, formData: FormData) => {
//     return handleRequest((instance) =>
//       instance.patch(`/categories/${id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       }),
//     );
//   };

//   const deleteCategory = async (id: string) => {
//     return handleRequest((instance) => instance.delete(`/categories/${id}/force`));
//   };

//   // PRODUCT ENDPOINTS
//   const createProduct = async (formData: FormData) => {
//     return handleRequest((instance) =>
//       instance.post('/products', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       }),
//     );
//   };

//   const updateProduct = async (id: string, formData: FormData) => {
//     return handleRequest((instance) =>
//       instance.patch(`/products/${id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       }),
//     );
//   };

//   const deleteProduct = async (id: string) => {
//     return handleRequest((instance) => instance.delete(`/products/${id}`));
//   };

//   const updateProductStock = async (productId: string, stockQuantity: number) => {
//     return handleRequest((instance) =>
//       instance.patch(`/products/${productId}/stock`, {
//         stockQuantity: Number(stockQuantity),
//       }),
//     );
//   };

//   const archiveProduct = async (id: string) => {
//     return handleRequest((instance) => instance.patch(`/products/${id}/archive`));
//   };

//   const restoreProduct = async (id: string) => {
//     return handleRequest((instance) => instance.patch(`/products/${id}/restore`));
//   };

//   // PRODUCT MEDIA ENDPOINTS
//   const addProductImages = async (productId: string, images: File[]) => {
//     const formData = new FormData();
//     images.forEach((img) => formData.append('images', img));
//     return handleRequest((instance) =>
//       instance.post(`/products/${productId}/images`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       }),
//     );
//   };

//   const deleteProductImage = async (imageId: string) => {
//     return handleRequest((instance) => instance.delete(`/products/images/${imageId}`));
//   };

//   const updateProductImage = async (imageId: string, updateData: any) => {
//     return handleRequest((instance) => instance.patch(`/products/images/${imageId}`, updateData));
//   };

//   // STATISTICS ENDPOINTS
//   const getProductStats = async () => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get('/products/stats');
//       setProductStats(res?.data?.data);
//       return res;
//     });
//   };

//   const getOrderStats = async () => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get('/orders/stats');
//       setOrderStats(res?.data?.data);
//       return res;
//     });
//   };

//   const getSalesStats = async () => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get('/sales/stats');
//       setSalesStats(res?.data?.data);
//       return res;
//     });
//   };

//   // ORDERS ENDPOINTS
//   const getOrders = async (params?: any) => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get('/orders', { params });
//       setOrders(res.data.data);
//       return res;
//     });
//   };

//   const getOrderDetails = async (id: string) => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get(`/orders/${id}`);
//       return res;
//     });
//   };

//   const updateOrderStatus = async (id: string, status: string) => {
//     return handleRequest(async (instance) => {
//       const res = await instance.patch(`/orders/${id}`, { status });
//       return res;
//     });
//   };

//   const cancelOrder = async (id: string) => {
//     return handleRequest((instance) => instance.delete(`/orders/${id}`));
//   };

//   // CUSTOMER ENDPOINTS
//   const getCustomers = async (params?: any) => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get('/customers', { params });
//       setCustomers(res?.data?.data);
//       return res;
//     });
//   };

//   const getCustomerDetails = async (id: string) => {
//     return handleRequest(async (instance) => {
//       const res = await instance.get(`/customers/${id}`);
//       return res;
//     });
//   };

//   const deleteCustomer = async (id: string) => {
//     return handleRequest((instance) => instance.delete(`/customers/${id}`));
//   };

//   const banCustomer = async (id: string, status: boolean) => {
//     return handleRequest((instance) => instance.patch(`/customers/${id}/ban`, { status }));
//   };

//   // REVIEW ENDPOINTS
//   const getAllReviews = async () => {
//     return handleRequest((instance) => instance.get('/reviews'));
//   };

//   const deleteReview = async (reviewId: string) => {
//     return handleRequest((instance) => instance.delete(`/reviews/${reviewId}`));
//   };

//   return (
//     <AdminContext.Provider
//       value={{
//         loading,
//         error,
//         dashboard,
//         productStats,
//         orderStats,
//         salesStats,
//         orders,
//         customers,
//         categories,
//         getDashboard,
//         getCategories,
//         createCategory,
//         createSubCategory,
//         createSubSubCategory,
//         updateCategory,
//         deleteCategory,
//         createProduct,
//         updateProduct,
//         deleteProduct,
//         updateProductStock,
//         archiveProduct,
//         restoreProduct,
//         addProductImages,
//         deleteProductImage,
//         updateProductImage,
//         getOrders,
//         getOrderDetails,
//         updateOrderStatus,
//         cancelOrder,
//         getCustomers,
//         getCustomerDetails,
//         deleteCustomer,
//         banCustomer,
//         getAllReviews,
//         deleteReview,
//         getOrderStats,
//         getSalesStats,
//       }}
//     >
//       {children}
//     </AdminContext.Provider>
//   );
// };

// export const useAdmin = () => {
//   const context = useContext(AdminContext);
//   if (context === null) {
//     throw new Error('useAdmin must be used within an AdminProvider');
//   }
//   return context;
// };
