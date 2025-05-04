# Next.js 15 Context System with Role-Based Access Control

This README documents the three-context architecture used in this Next.js 15 application for API interactions, authentication, and role-based access control.

## Table of Contents

- [Overview](#overview)
- [Context Architecture](#context-architecture)
- [Installation](#installation)
- [Environment Configuration](#environment-configuration)
- [Context Providers](#context-providers)
  - [API Context](#api-context)
  - [Auth Context](#auth-context)
  - [Admin Context](#admin-context)
- [Usage with Components](#usage-with-components)
- [Role-Based Access Control](#role-based-access-control)
- [Client vs Server Components](#client-vs-server-components)
- [Protected Routes](#protected-routes)
- [Troubleshooting](#troubleshooting)

## Overview

This application uses a three-context architecture in Next.js 15 to separate concerns:

- **API Context**: General-purpose API communication layer
- **Auth Context**: Authentication, user management, and session handling
- **Admin Context**: Admin-specific operations and admin panel functionality

Each context serves a specific purpose in the application's architecture, providing a clean separation of concerns.

## Context Architecture

```
├── src/
│   ├── contexts/
│   │   ├── ApiContext.tsx    # General API operations
│   │   ├── AuthContext.tsx   # Authentication & user management
│   │   └── AdminContext.tsx  # Admin-specific operations
│   │
│   ├── providers.tsx         # Combined providers wrapper
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
3. Set up environment variables (see next section)
4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

## Environment Configuration

Create a `.env.local` file in the root of your project with the following variables:

```
NEXT_PUBLIC_API_URL=http://your-api-url/api
NEXT_PUBLIC_API_URL_AUTH=http://your-api-url/auth
NEXT_PUBLIC_API_URL_ADMIN=http://your-api-url/admin
```

## Context Providers

### API Context

`ApiContext` serves as the general-purpose API communication layer for functionality that isn't specific to authentication or admin operations.

#### Available Methods:

- `fetchProperties(filters)`: Get properties with filters
- `fetchPropertyById(id)`: Get property details
- `createProperty(propertyData)`: Create a new property
- `updateProperty(id, data)`: Update a property
- `deleteProperty(id)`: Delete a property
- `fetchCategories()`: Get property categories
- Other general API methods

#### Available State:

- `loading`: Boolean indicating if an API operation is in progress
- `error`: Error message if an API operation failed
- Various data states like `properties`, `propertyDetails`, etc.

#### Usage Example:

```jsx
'use client';

import { useApi } from '@/contexts/ApiContext';
import { useEffect } from 'react';

export default function PropertiesPage() {
  const { properties, loading, error, fetchProperties } = useApi();

  useEffect(() => {
    fetchProperties({ limit: 10 });
  }, [fetchProperties]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Property Listings</h1>
      <div className='grid'>
        {properties.map((property) => (
          <div key={property.id}>{property.title}</div>
        ))}
      </div>
    </div>
  );
}
```

### Auth Context

`AuthContext` handles user authentication, session management, and user-specific operations.

#### Available Methods:

- `register(userData)`: Register a new user
- `login(credentials)`: Authenticate a user
- `logout()`: End the current user session
- `getUser()`: Get the current authenticated user

#### Available State:

- `user`: The current authenticated user (null if not authenticated)
- `loading`: Boolean indicating if an auth operation is in progress
- `error`: Error message if an auth operation failed
- `role`: The current user's role (for role-based access control)

#### Usage Example:

```jsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const walletAddress = e.target.walletAddress.value;
    try {
      await login({ walletAddress });
      // Redirect handled by auth context
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name='walletAddress' placeholder='Wallet Address' required />
      <button type='submit' disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className='error'>{error}</p>}
    </form>
  );
}
```

### Admin Context

`AdminContext` provides admin-specific functionality and operations.

#### Available Methods:

- `getDashboard()`: Get admin dashboard stats
- `getOrders()`: Get all orders
- `getCustomers()`: Get all customers
- `updateOrderStatus(id, status)`: Update an order's status
- `getCategories()`: Get all categories
- `createCategory(data)`: Create a new category
- `updateCategory(id, data)`: Update a category
- Other admin-specific operations

#### Available State:

- `loading`: Boolean indicating if an admin operation is in progress
- `error`: Error message if an admin operation failed
- `dashboard`: Admin dashboard data
- Various admin data states

#### Usage Example:

```jsx
'use client';

import { useAdmin } from '@/contexts/AdminContext';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardPage() {
  const { user, role } = useAuth();
  const { dashboard, loading, error, getDashboard } = useAdmin();
  const router = useRouter();

  // Check admin access
  useEffect(() => {
    if (!user || role !== 'admin') {
      router.push('/login');
    }
  }, [user, role, router]);

  // Load dashboard data
  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!dashboard) return null;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <div className='stats'>
        <div className='stat'>
          <h3>Total Properties</h3>
          <p>{dashboard.totalProperties}</p>
        </div>
        <div className='stat'>
          <h3>Active Users</h3>
          <p>{dashboard.activeUsers}</p>
        </div>
        {/* Other dashboard stats */}
      </div>
    </div>
  );
}
```

## Usage with Components

To use these contexts in your components:

1. Mark your component as a client component with the `'use client'` directive
2. Import the appropriate hooks:
   ```jsx
   import { useApi } from '@/contexts/ApiContext';
   import { useAuth } from '@/contexts/AuthContext';
   import { useAdmin } from '@/contexts/AdminContext';
   ```
3. Access context values and methods:
   ```jsx
   const { loading: apiLoading, fetchProperties } = useApi();
   const { user, role } = useAuth();
   const { loading: adminLoading, getDashboard } = useAdmin();
   ```

## Role-Based Access Control

The Auth Context provides user role information that can be used for role-based access control:

```jsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Navigation() {
  const { user, role } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <a href='/'>Home</a>
        </li>
        <li>
          <a href='/properties'>Properties</a>
        </li>

        {/* Only show for authenticated users */}
        {user && (
          <li>
            <a href='/dashboard'>Dashboard</a>
          </li>
        )}

        {/* Only show for property owners or agents */}
        {user && (role === 'owner' || role === 'agent') && (
          <li>
            <a href='/properties/create'>List Property</a>
          </li>
        )}

        {/* Only show for admin users */}
        {user && role === 'admin' && (
          <li>
            <a href='/admin'>Admin Panel</a>
          </li>
        )}

        {/* Only show for verifiers */}
        {user && role === 'verifier' && (
          <li>
            <a href='/verifier'>Verification Dashboard</a>
          </li>
        )}

        {/* Authentication links */}
        {user ? (
          <li>
            <button onClick={() => logout()}>Logout</button>
          </li>
        ) : (
          <>
            <li>
              <a href='/login'>Login</a>
            </li>
            <li>
              <a href='/register'>Register</a>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
```

## Client vs Server Components

Next.js 15 has two types of components:

- **Server Components**: Default, cannot use hooks or browser APIs
- **Client Components**: Marked with `'use client'`, can use hooks and browser APIs

Context providers are client-side features. For server components:

1. Create a client wrapper component that uses the context
2. Pass data as props to server components

Example:

```jsx
// ClientWrapper.jsx - Client Component
'use client';

import { useAuth } from '@/contexts/AuthContext';
import ServerComponent from './ServerComponent';

export default function ClientWrapper() {
  const { user, role } = useAuth();

  return <ServerComponent userName={user?.name} userRole={role} />;
}

// ServerComponent.jsx - Server Component
export default function ServerComponent({ userName, userRole }) {
  return (
    <div>
      <h1>Hello, {userName || 'Guest'}</h1>
      {userRole === 'admin' && <p>Admin features would go here</p>}
    </div>
  );
}
```

## Protected Routes

Next.js middleware protects routes requiring authentication:

```javascript
// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/properties/create',
    '/properties/edit/:path*',
    '/admin/:path*',
    '/verifier/:path*',
    '/profile/:path*',
  ],
};

export default function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

For admin-specific routes, add additional role checking in the page component:

```jsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Even if token exists, check for admin role
    if (!user || role !== 'admin') {
      router.push('/');
    }
  }, [user, role, router]);

  if (!user || role !== 'admin') return null;

  return (
    <div>
      <h1>Admin Area</h1>
      {/* Admin content */}
    </div>
  );
}
```

## Troubleshooting

### "Error: useXxx must be used within an XxxProvider"

This error indicates you're trying to use a context hook outside its provider. Make sure:

1. Your component is wrapped with all three providers in the component tree
2. You're only using context hooks in client components (with `'use client'` directive)

### "ReferenceError: localStorage is not defined"

This happens when accessing browser APIs in server-rendered code:

1. Make sure your component is marked with `'use client'`
2. Wrap browser API access with environment checks:
   ```jsx
   if (typeof window !== 'undefined') {
     localStorage.getItem('token');
   }
   ```

### "Error: Hydration failed..."

This occurs when server-rendered content doesn't match client-rendered content:

1. Ensure initial state values don't depend on browser APIs
2. Use conditional rendering or useEffect for browser-dependent content
3. Consider using the next/dynamic import with the `{ ssr: false }` option for components that rely heavily on browser APIs

### JWT Token Expired

Create a central error handler for API requests that handles expired tokens:

1. In API/Auth contexts, add an interceptor for 401 responses
2. On 401, clear the session and redirect to login
3. Optionally, implement token refresh functionality
