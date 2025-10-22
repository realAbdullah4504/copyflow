# CopyFlow - Folder Structure

## Overview

This document describes the folder structure of the CopyFlow application, following professional React/TypeScript best practices.

## Root Structure

```
copyflow/
├── docs/                    # Project documentation
├── public/                  # Static public assets
├── src/                     # Source code
└── [config files]          # Various configuration files
```

## Source Structure (`src/`)

```
src/
├── assets/                 # Static assets (images, SVGs, fonts)
│   └── react.svg
│
├── components/             # React components
│   ├── admin/             # Admin-specific components
│   ├── auth/              # Authentication components
│   ├── common/            # Shared/reusable components
│   │   ├── ErrorBoundary.tsx
│   │   └── index.ts
│   ├── dashboard/         # Dashboard-specific components
│   ├── guards/            # Route guards and authentication guards
│   ├── icons/             # Custom icon components
│   ├── layouts/           # Layout components (headers, sidebars, etc.)
│   └── ui/                # shadcn/ui components (51 components)
│
├── config/                # Application configuration
│   ├── env.ts             # Environment variables
│   ├── roles.ts           # User roles configuration
│   └── routeRoles.ts      # Route-based role permissions
│
├── constants/             # Application constants
│   └── admin/             # Admin-related constants
│
├── hooks/                 # Custom React hooks
│   ├── useAttendance.ts
│   ├── useAuth.ts
│   └── useSubmissions.ts
│
├── lib/                   # Third-party library configurations
│   ├── queryClient.ts     # React Query configuration
│   ├── supabaseClient.ts  # Supabase client setup
│   └── utils.ts           # shadcn/ui utility functions
│
├── navigation/            # Navigation configuration
│   └── index.ts           # Navigation items and menu structure
│
├── pages/                 # Page components (route-level components)
│   ├── auth/              # Authentication pages (login, register)
│   ├── dashboard/         # Dashboard pages
│   └── errors/            # Error pages (404, 500, etc.)
│
├── routes/                # Routing configuration
│   ├── appRoutes.tsx      # Application routes
│   ├── index.tsx          # Route exports
│   └── privateRoutes.tsx  # Protected routes
│
├── services/              # API services and data fetching
│   ├── attendanceService.ts
│   ├── authService.ts
│   └── submissionService.ts
│
├── store/                 # State management (Zustand)
│   ├── index.ts           # Store configuration
│   └── slices/            # State slices
│       ├── authSlice.ts
│       ├── dataLoadingSlice.ts
│       ├── notificationSlice.ts
│       └── uiSlice.ts
│
├── styles/                # Global styles and CSS
│   ├── App.css            # Application-specific styles
│   └── index.css          # Global styles and Tailwind imports
│
├── types/                 # TypeScript type definitions
│   ├── api/               # API-related types
│   ├── common.ts          # Common types used across the app
│   ├── config/            # Configuration types
│   ├── domain/            # Domain/business logic types
│   ├── index.ts           # Type exports
│   ├── navigation.ts      # Navigation-related types
│   ├── store/             # Store/state types
│   └── ui/                # UI component types
│
├── utils/                 # Utility functions and helpers
│   ├── formatters.ts      # Formatting functions (dates, currency, etc.)
│   ├── validators.ts      # Validation functions
│   ├── index.ts           # Utils exports
│   └── README.md          # Utils documentation
│
├── App.tsx                # Root application component
└── main.tsx               # Application entry point
```

## Key Principles

### 1. **Separation of Concerns**
- **Components**: UI rendering and user interactions
- **Services**: API calls and external data
- **Hooks**: Reusable stateful logic
- **Utils**: Pure helper functions
- **Store**: Global state management
- **Types**: Type definitions and interfaces

### 2. **Feature-based Organization**
Components, pages, and services are organized by feature (admin, auth, dashboard, etc.) for better maintainability.

### 3. **Clear Responsibilities**
- `components/` - Reusable UI components
- `pages/` - Route-level page components
- `services/` - Business logic and API interactions
- `hooks/` - Custom React hooks
- `utils/` - Pure utility functions
- `types/` - TypeScript definitions

### 4. **Configuration Centralization**
All configuration files are in the `config/` folder, making it easy to manage environment-specific settings.

## Best Practices

1. **Import Aliases**: Use `@/` for absolute imports (e.g., `import { Button } from '@/components/ui/button'`)

2. **Index Files**: Use `index.ts` files to create clean public APIs for folders

3. **Type Safety**: All TypeScript types are centralized in the `types/` folder

4. **Component Organization**:
   - Feature-specific components in feature folders
   - Shared components in `common/`
   - UI library components in `ui/`

5. **Styles**:
   - Global styles in `styles/index.css`
   - Component-specific styles using Tailwind classes
   - Custom CSS in `styles/App.css` when needed

## Changes Made

The following improvements were made to match professional standards:

1. ✅ **Created `styles/` folder** - Moved CSS files from root to dedicated folder
2. ✅ **Moved ErrorBoundary** - Relocated to `components/common/` for better organization
3. ✅ **Created `utils/` folder** - Added dedicated folder for utility functions with validators and formatters
4. ✅ **Improved Documentation** - Created comprehensive folder structure documentation
5. ✅ **Added Index Files** - Created barrel exports for better import paths

## Empty Folders to Remove

The following empty folders should be cleaned up:
- `src/components/error/` (empty - ErrorBoundary moved to common/)
- `src/pages/test/` (empty - remove if not needed)

## Notes

- The project uses **React 19**, **TypeScript**, **Vite**, **TailwindCSS v4**, and **shadcn/ui**
- State management uses **Zustand**
- Data fetching uses **React Query** (TanStack Query)
- Backend uses **Supabase**
