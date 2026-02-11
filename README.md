# 📚 Lesson Planner App

A modern, professional full-stack application designed for teachers to create, manage, and organize lesson plans. Built as a **Turborepo monorepo** to ensure type safety, code reusability, and scalability across frontend and backend.

## 🎯 Project Overview

This is a Turborepo monorepo containing multiple apps and packages:

- **`apps/planner-manager`** - Fastify backend API with Prisma ORM and MinIO file storage
- **`apps/planner-ui`** - React frontend with Vite, Tailwind CSS, and React Hook Form
- **`packages/types`** - Shared TypeScript types and Zod validation schemas (single source of truth)
- **`packages/typescript-config`** - Shared TypeScript configuration
- **`packages/eslint-config`** - Shared ESLint configuration

## 🚀 Features

- ✅ **Create Lesson Plans** - Detailed form with validation for pedagogy, operative goals, and lesson flow
- ✅ **File Attachments** - Upload and attach files (Images, Audio, Documents) to lesson plans
- ✅ **Dashboard** - View all lesson plans in a beautiful card-based layout
- ✅ **Export to Word** - Generate `.docx` files with Hebrew formatting and tables
- ✅ **Export to PDF** - Clean, printer-friendly layout with automatic header/footer removal
- ✅ **Manage Plans** - Edit and delete lesson plans
- ✅ **Hebrew Support** - Fully RTL (Right-to-Left) interface with Hebrew localizations
- ✅ **Type Safety** - 100% TypeScript with zero `any` usage

## 🛠️ Tech Stack

### Monorepo Management
- **Turborepo** - High-performance build system and task orchestration
- **pnpm** - Fast, disk space-efficient package manager with strict dependency management

### Frontend (`apps/planner-ui`)
- **React 19** - UI library with Hooks
- **Vite** - Lightning-fast build tool with HMR
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Performant form validation
- **Zod** - TypeScript-first schema validation
- **TanStack Query** - Server state management and caching
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors

### Backend (`apps/planner-manager`)
- **Fastify** - High-performance Node.js web framework
- **TypeScript** - Type-safe backend development
- **Prisma ORM** - Type-safe database access with migrations
- **PostgreSQL** - Relational database
- **MinIO** - S3-compatible object storage for file uploads
- **AWS SDK** - S3 client for file operations
- **Zod** - Server-side request validation

### Shared Packages
- **`@repo/types`** - Shared TypeScript interfaces and Zod schemas
- **`@repo/typescript-config`** - Shared TypeScript compiler options
- **`@repo/eslint-config`** - Shared ESLint rules and presets

---

## 📂 Monorepo Structure

```bash
lessons-plan/
├── apps/
│   ├── planner-manager/          # Backend API (Fastify + Prisma)
│   │   ├── src/
│   │   │   ├── app.ts            # Fastify app setup
│   │   │   ├── server.ts         # Server entry point
│   │   │   ├── lessonPlan/       # Lesson plan domain
│   │   │   │   ├── controller.ts # Request handlers
│   │   │   │   ├── service.ts    # Business logic
│   │   │   │   ├── DAL.ts        # Data access layer
│   │   │   │   └── routes.ts     # Route definitions
│   │   │   └── file-storage/     # File upload service
│   │   ├── db/                   # Database configuration
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma # Database schema
│   │   │   │   └── migrations/   # Migration history
│   │   └── config/               # Environment configuration
│   │
│   └── planner-ui/               # Frontend SPA (React + Vite)
│       ├── src/
│       │   ├── components/       # Reusable UI components
│       │   │   └── ui/          # Base UI components
│       │   ├── features/        # Feature modules
│       │   │   └── lesson-plans/ # Lesson plans feature
│       │   │       ├── api/     # React Query hooks
│       │   │       └── components/ # Feature components
│       │   ├── lib/             # Utility libraries
│       │   ├── providers/       # React providers (Query, etc.)
│       │   └── utils/           # Utility functions
│       └── public/              # Static assets
│
├── packages/
│   ├── types/                    # Shared TS types and Zod schemas
│   │   └── src/
│   │       └── index.ts         # Exported types and schemas
│   ├── typescript-config/        # Shared TypeScript configuration
│   └── eslint-config/           # Shared ESLint configuration
│
├── docker-compose.yaml          # Docker services (PostgreSQL, MinIO)
├── package.json                 # Root workspace configuration
├── pnpm-workspace.yaml          # Workspace definition
└── turbo.json                   # Turborepo configuration
```

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org/))
- **pnpm** v8+ ([Install guide](https://pnpm.io/installation))
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))

### Installation & Setup

1. **Clone and install dependencies:**
   ```bash
   git clone <repository-url>
   cd lessons-plan
   pnpm install
   ```

2. **Start infrastructure (PostgreSQL + MinIO):**
   ```bash
   docker-compose up -d
   ```

3. **Setup database:**
   ```bash
   pnpm db:push
   ```

4. **Run development servers:**
   ```bash
   pnpm dev
   ```
   
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000
   - MinIO Console: http://localhost:9001

## 📖 App-Specific Documentation

Each app and package has its own detailed README:

- **[Backend Setup](./apps/planner-manager/README.md)** - API endpoints, database configuration, file storage
- **[Frontend Setup](./apps/planner-ui/README.md)** - Component structure, state management, building
- **[Shared Types](./packages/types/README.md)** - Type definitions and validation schemas

## 🏗️ Architecture

### Clean Architecture Principles

The project follows **clean architecture** and **SOLID principles**:

- **DAL (Data Access Layer)** - Handles all database operations via Prisma
- **Service Layer** - Contains business logic and orchestration (e.g., coordinating file deletion + DB cleanup)
- **Controller Layer** - Thin, focused only on HTTP request/response handling
- **Validation** - Centralized Zod schemas used by both frontend and backend

### Single Source of Truth

All validation rules and type definitions are defined in `packages/types` and used by:
- **Backend** - Server-side request validation and type safety
- **Frontend** - Form validation and type hints

This ensures consistency across the entire application.

### RTL Support

The entire UI is built with RTL-first development:
- All components use `dir="rtl"` 
- Tailwind classes leverage RTL variant support
- Hebrew localizations throughout the interface

---

## 🚀 Available Commands

### Root-level Commands

```bash
# Development
pnpm dev              # Start all apps in watch mode
pnpm build            # Build all apps and packages
pnpm lint             # Lint entire monorepo
pnpm type-check       # Type check everything

# Database
pnpm db:push          # Apply Prisma migrations
pnpm db:studio        # Open Prisma Studio

# Clean
pnpm clean            # Remove all build artifacts
```

### App-Specific Commands

See individual README files in:
- `apps/planner-manager/` - Backend commands
- `apps/planner-ui/` - Frontend commands

---

## 🚀 Roadmap

- [ ] User authentication and authorization
- [ ] Collaborative lesson planning (share with other teachers)
- [ ] Search and advanced filtering
- [ ] Lesson plan templates
- [ ] Analytics dashboard
- [ ] Mobile improvements

---

## �️ Usage Guide

1. **Create:** Click "צור חדש" to open the form. Fill in the topic, goals, and add the lesson flow stages. You can drag and drop files to attach them.
2. **View:** Click on any card in the dashboard to see the full details.
3. **Export:** * Click **Word** to download an editable document.
* Click **Print** to open the browser's print dialog (optimized for PDF saving).



---

## � Roadmap

* [ ] User Authentication (Login/Register).
* [ ] Edit existing lesson plans.
* [ ] Search and Filter functionality.
* [ ] Share plans with other teachers.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.
