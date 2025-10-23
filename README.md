# CopyFlow

A modern, professional React application built with TypeScript, Vite, and Supabase.

## 🚀 Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **TailwindCSS v4** - Styling
- **shadcn/ui** - UI component library
- **React Query (TanStack Query)** - Data fetching & caching
- **Zustand** - State management
- **React Router v7** - Routing
- **Supabase** - Backend & authentication
- **Zod** - Schema validation

## 📁 Project Structure

The project follows professional folder structure standards:

```
src/
├── components/      # Reusable UI components
├── pages/          # Route-level page components
├── hooks/          # Custom React hooks
├── services/       # API services
├── store/          # Global state (Zustand)
├── routes/         # Route configuration
├── types/          # TypeScript definitions
├── styles/         # Global styles
├── utils/          # Utility functions
├── config/         # App configuration
└── lib/            # Third-party library configs
```

For detailed information, see **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)**.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
# Copy .env.example to .env and fill in your values
cp .env.example .env

# Start development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run generate:barrels` - Generate barrel exports

## 📚 Documentation

- **[FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md)** - Complete folder structure guide
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** - Architecture principles
- **[REORGANIZATION_SUMMARY.md](./REORGANIZATION_SUMMARY.md)** - Recent structure changes
- **[NEXT_STEPS.md](./NEXT_STEPS.md)** - Setup and cleanup instructions

## 🎯 Features

- ✅ Role-based authentication (Admin, Secretary, Teacher)
- ✅ Protected routes with route guards
- ✅ Modern UI with shadcn/ui components
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Type-safe API calls
- ✅ Global state management
- ✅ Error boundaries
- ✅ Professional folder structure

## 🔧 Configuration

The app uses centralized configuration in the `src/config/` folder:

- `env.ts` - Environment variables
- `roles.ts` - User role definitions
- `routeRoles.ts` - Route access control

## 🧰 Utilities

Reusable utility functions are available in `src/utils/`:

```typescript
import { isValidEmail, formatDate, truncateText } from '"@/utils"';

// Validation
if (isValidEmail(email)) { /* ... */ }

// Formatting
const date = formatDate(new Date());
```

See **[src/utils/README.md](./src/utils/README.md)** for more details.

## 🎨 Styling

- **TailwindCSS v4** for utility-first styling
- **shadcn/ui** for pre-built accessible components
- Custom theme configuration in `src/styles/index.css`
- Dark mode support via `next-themes`

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` folder.

## 🤝 Contributing

1. Follow the established folder structure
2. Use TypeScript for type safety
3. Write reusable utility functions in `src/utils/`
4. Keep components focused and single-purpose
5. Add proper TypeScript types in `src/types/`

## 📄 License

[Your License Here]

## 🔗 Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Supabase Documentation](https://supabase.com/docs)
