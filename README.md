# 📚 Lesson Planner App

A full-stack application for creating, managing, and organizing kindergarten lesson plans. Built with **Turborepo** for maximum code reusability, type safety, and scalability.

## 📖 Project Summary

**Monorepo Structure:**

- **`apps/planner-manager`** - Fastify REST API backend with PostgreSQL + Prisma ORM, JWT authentication, and MinIO file storage
- **`apps/planner-ui`** - React 19 SPA frontend with Vite, TypeScript, Tailwind CSS, React Hook Form, and React Query
- **`packages/types`** - Single source of truth for TypeScript interfaces and Zod validation schemas
- **`packages/typescript-config`** - Shared TypeScript compiler configuration
- **`packages/eslint-config`** - Shared ESLint rules and presets

**Key Capabilities:**

- ✅ **Lesson Plan Creation** - Form with validation for pedagogy, operative goals (3+), and lesson flow steps
- ✅ **File Attachments** - Upload/download files (images, audio, documents) via S3-compatible MinIO storage
- ✅ **Dashboard** - Responsive card-based list of all lesson plans
- ✅ **Export** - Generate `.docx` Word documents with Hebrew formatting and tables
- ✅ **Plan Management** - Create, read, update, delete lesson plans
- ✅ **User Authentication** - Email/password + Google OAuth hybrid authentication with JWT tokens
- ✅ **Role-Based Access** - User roles (OWNER, ADMIN, KINDERGARTEN) with permission levels
- ✅ **Hebrew Language** - Full RTL (right-to-left) support with Hebrew validation messages
- ✅ **Type-Safe** - 100% TypeScript across frontend and backend with zero `any` usage

## 🛠️ Tech Stack Overview

### Monorepo Management

- **Turborepo 2.8+** - Monorepo build system with task orchestration and caching
- **pnpm 10.0+** - Fast, disk-efficient package manager with strict dependency resolution

### Backend (`apps/planner-manager`)

| Layer                | Technology                          |
| -------------------- | ----------------------------------- |
| **Runtime**          | Node.js 22+                         |
| **Framework**        | Fastify 5.x                         |
| **Language**         | TypeScript 5.9+                     |
| **Database**         | PostgreSQL 15+ via Prisma ORM 7.3+  |
| **ORM**              | Prisma with pg adapter              |
| **File Storage**     | MinIO (S3-compatible)               |
| **Authentication**   | JWT (native Fastify) + Google OAuth |
| **Validation**       | Zod 4.3+ with Fastify type provider |
| **HTTP Multipart**   | @fastify/multipart for file uploads |
| **Password Hashing** | bcryptjs 3.0+                       |

### Frontend (`apps/planner-ui`)

| Layer                | Technology                                     |
| -------------------- | ---------------------------------------------- |
| **Runtime**          | Node.js 22+                                    |
| **Framework**        | React 19                                       |
| **Build Tool**       | Vite 7.x                                       |
| **Language**         | TypeScript 5.9+                                |
| **Styling**          | Tailwind CSS 3 + PostCSS + Autoprefixer        |
| **Forms**            | React Hook Form 7.x + Zod resolver             |
| **Routing**          | React Router 7.x                               |
| **API Client**       | Axios 1.13+ with interceptors                  |
| **State Management** | TanStack Query 5.x (React Query)               |
| **Auth Provider**    | Google OAuth via @react-oauth/google           |
| **Export**           | docx library for Word generation               |
| **Utilities**        | clsx, file-saver, use-debounce, react-to-print |

### Shared Packages

- **`@repo/types`** - Zod schemas + TypeScript interfaces (single source of truth)
- **`@repo/typescript-config`** - Base TypeScript compilation settings
- **`@repo/eslint-config`** - Shared ESLint rules

## 📂 Directory Structure

```
lesson-plan/                           # Root monorepo
├── apps/
│   ├── planner-manager/               # Backend REST API
│   │   ├── src/
│   │   │   ├── app.ts                 # Fastify instance setup
│   │   │   ├── server.ts              # Server startup
│   │   │   ├── lessonPlan/            # Lesson plan feature
│   │   │   │   ├── controller.ts      # Request handlers
│   │   │   ├── service.ts             # Business logic
│   │   │   ├── DAL.ts                 # Prisma database layer
│   │   │   ├── routes.ts              # Route definitions
│   │   │   ├── auth/                  # Authentication (JWT + Google OAuth)
│   │   │   ├── users/                 # User management
│   │   │   ├── file-storage/          # MinIO/S3 integration
│   │   │   └── middleware/            # Fastify middleware
│   │   ├── db/
│   │   │   ├── prisma/
│   │   │   │   ├── schema.prisma      # Database schema
│   │   │   │   └── migrations/        # Migration history
│   │   │   ├── types.ts               # Database types
│   │   │   └── helpers.ts             # Database utilities
│   │   ├── config/
│   │   │   └── default.json           # Configuration
│   │   └── package.json
│   │
│   └── planner-ui/                    # Frontend React SPA
│       ├── src/
│       │   ├── App.tsx                # Main app & routing
│       │   ├── main.tsx               # React entry point
│       │   ├── components/            # Reusable components
│       │   │   ├── Layout.tsx         # Main layout
│       │   │   └── ui/                # UI primitives
│       │   ├── features/
│       │   │   ├── auth/              # Authentication feature
│       │   │   ├── lessonPlan/        # Lesson plans feature
│       │   │   │   ├── api/           # React Query hooks
│       │   │   │   └── components/    # Feature components
│       │   │   └── users/             # User management
│       │   ├── lib/                   # Utility libraries
│       │   ├── providers/             # React providers
│       │   └── utils/                 # Utility functions
│       ├── public/                    # Static assets
│       └── package.json
│
├── packages/
│   ├── types/                         # Shared types & Zod schemas
│   │   └── src/index.ts
│   ├── typescript-config/             # Shared TS config
│   └── eslint-config/                 # Shared ESLint config
│
├── docker-compose.yaml                # PostgreSQL + MinIO
├── package.json                       # Root workspace
├── pnpm-workspace.yaml                # Workspace definition
├── turbo.json                         # Build config
└── tsconfig.json                      # Root TS config
```

## ⚡ Quick Start

### Prerequisites

- **Node.js** 22+
- **pnpm** 10.0+
- **Docker & Docker Compose**
- **PostgreSQL 15+** (via Docker)
- **MinIO** (via Docker)

### Development Setup

```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd lesson-plan
pnpm install

# 2. Start infrastructure services
docker-compose up -d

# 3. Setup database & generate Prisma Client
pnpm db:push

# 4. Start all development servers (Turbo)
pnpm dev
```

**Development Servers:**

- Frontend: http://localhost:3000 (Vite)
- Backend API: http://localhost:8080 (Fastify)
- MinIO Console: http://localhost:9001 (admin/admin)
- PostgreSQL: localhost:5432

### Available Scripts

```bash
# Development
pnpm dev              # Start all dev servers (frontend + backend)
pnpm dev --filter backend  # Start only backend
pnpm dev --filter frontend # Start only frontend

# Building
pnpm build            # Build all apps and packages

# Testing
pnpm test             # Run all tests
pnpm test:watch       # Watch mode testing
pnpm test:ui          # Vitest UI dashboard

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format with Prettier
pnpm check-types      # TypeScript type checking

# Database
pnpm db:push          # Apply pending migrations
pnpm db:reset         # Reset database (dev only)
pnpm db:studio        # Open Prisma Studio UI
pnpm db:migrate       # Create new migration

# Package Management
pnpm                  # Install all dependencies
pnpm add <package>    # Add package to workspace
```

## 📚 App-Specific Documentation

Each application and shared package has detailed documentation:

- **[Backend README](./apps/planner-manager/README.md)** - API endpoints, database schema, environment setup
- **[Frontend README](./apps/planner-ui/README.md)** - Component architecture, hooks, state management
- **[Types README](./packages/types/README.md)** - Exported TypeScript types and Zod schemas
- **[TypeScript Config README](./packages/typescript-config/README.md)** - Shared compiler settings
- **[ESLint Config README](./packages/eslint-config/README.md)** - Shared linting rules

---

## 🏗️ Architecture Overview

### Clean Architecture Pattern

Backend follows clean architecture with strict separation of concerns:

```
Routes → Controller → Service → DAL → Prisma → PostgreSQL
  ↓                                                  ↓
Request                                        Database
Validation                                     Response
(Zod)
```

**Layers:**

- **Routes** - Define endpoints and register middleware
- **Controller** - Handle HTTP requests/responses (stateless)
- **Service** - Contain business logic and orchestration
- **DAL (Data Access Layer)** - Wrap Prisma queries, return domain objects
- **Database** - PostgreSQL with Prisma migrations

### Single Source of Truth (Types)

All validation rules and type definitions live in `@repo/types`:

```
@repo/types/src/index.ts
├── Zod Schemas       → Used by backend for request validation
├── TypeScript Types  → Used by both frontend & backend for type safety
└── Constants         → Enumerations shared across app
```

**Benefits:**

- Frontend and backend validate using the same rules
- Type consistency prevents data mismatches
- Centralized updates propagate everywhere

### Frontend State Management

React Query + Context API pattern:

```
React Query (TanStack Query)
└── Server State Management
    ├── Caching
    ├── Auto-refetching
    ├── Background sync
    └── API synchronization

AuthContext
└── User Authentication State
    ├── Current user
    ├── Auth token
    └── Login/logout
```

### RTL (Right-to-Left) Support

Full Hebrew language support:

```tsx
<div dir="rtl" lang="he">
  {" "}
  // All components wrapped
  {/* Tailwind RTL variants automatically applied */}
</div>
```

All error messages, labels, and UI text use Hebrew localizations from Zod schemas.

---

## 🔐 Authentication & Authorization

### Authentication Methods

1. **Email/Password** - Local authentication with bcrypt password hashing
2. **Google OAuth** - Social login via Google provider

### User Roles

| Role             | Permissions                                      |
| ---------------- | ------------------------------------------------ |
| **OWNER**        | Full system access, create/edit/delete any plan  |
| **ADMIN**        | Create/edit/delete own plans, manage attachments |
| **KINDERGARTEN** | Read-only access to published plans              |

### Token-Based Auth

- **JWT Tokens** - Issued on login/registration
- **Token Storage** - localStorage (frontend)
- **Token Refresh** - Not implemented yet (future enhancement)
- **Protected Routes** - Fastify auth middleware guards endpoints

---

## 🗄️ Database Schema Overview

### Core Models

```prisma
User
├── id (UUID)
├── email (unique)
├── fullName
├── passwordHash (optional, for email/password auth)
├── googleId (optional, for Google OAuth)
├── role (OWNER | ADMIN | KINDERGARTEN)
└── lessonPlans[] (relationship)

LessonPlan
├── id (UUID)
├── topic (string)
├── unit (string)
├── frame (plenary | small-group)
├── ageGroup (3-4 | 4-5)
├── superGoal (string)
├── operativeGoals (string[])
├── lessonFlow (JSON - array of steps)
├── teachingAids (string[])
├── references (string[])
├── isPublished (boolean)
├── author → User
└── attachments[] (relationship)

Attachment
├── id (UUID)
├── filename (string)
├── url (string)
├── fileType (MIME)
├── sizeBytes (number)
└── lessonPlan → LessonPlan
```

---

## 📋 Feature Checklist

### Lesson Plan Management

- ✅ Create lesson plans with structured form
- ✅ Edit existing plans
- ✅ Delete plans (soft delete via isPublished)
- ✅ List all plans with filtering
- ✅ View plan details
- ✅ Export plans to Word (.docx) format

### File Management

- ✅ Upload attachments (images, audio, documents)
- ✅ Download attachments
- ✅ Remove attachments
- ✅ S3-compatible storage (MinIO)

### User Management

- ✅ User registration (email/password)
- ✅ User login (email/password + Google OAuth)
- ✅ JWT-based session management
- ✅ Role-based access control

### Form Validation

- ✅ Frontend validation with React Hook Form + Zod
- ✅ Backend validation with Zod
- ✅ Hebrew error messages
- ✅ Real-time validation feedback

### Internationalization

- ✅ Hebrew language support
- ✅ RTL layout support
- ✅ Hebrew form labels and placeholders
- ✅ Hebrew error messages

---

## 🧪 Testing

The project uses **Jest** for testing with the following patterns:

```bash
pnpm test              # Run all tests
pnpm test:watch        # Watch mode
pnpm test:ui           # Vitest UI dashboard
```

**Test Structure:**

- Black-box tests (testing behavior, not implementation)
- Happy path, sad path, bad input coverage
- AAA pattern (Arrange, Act, Assert)
- Test independence (no shared state)

---

## 📝 Git & Version Control

### Conventional Commits

```
type(scope): description

Examples:
feat(lessonPlan): add export to Word functionality
fix(auth): handle Google OAuth token expiration
docs(README): update API documentation
```

**Commit Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (not functionality)
- `refactor` - Code reorganization
- `test` - Test additions/updates
- `ci` - CI/CD configuration
- `deps` - Dependency updates
- `devdeps` - Dev dependency updates

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make changes and commit with conventional commits
3. Push and open a pull request
4. Ensure tests pass and code is formatted
5. Request review and merge

---

## 📞 Support & Troubleshooting

### Common Issues

**Q: "Cannot find module '@repo/types'"**

```bash
# Solution: Ensure pnpm install was run
pnpm install
pnpm build  # Build shared packages first
```

**Q: "Database connection refused"**

```bash
# Solution: Start Docker services
docker-compose up -d
pnpm db:push  # Apply migrations
```

**Q: "Port 8080 already in use"**

```bash
# Solution: Kill process or change PORT env var
PORT=3001 pnpm dev
```

---

## 📄 License

[Specify your license here]

---

## 📧 Contact & Questions

For questions or issues, please open a GitHub issue or contact the development team.

---

**Last Updated:** February 14, 2026

---

## 🚀 Roadmap

- [ ] User authentication and authorization
- [ ] Collaborative lesson planning (share with other kindergartens)
- [ ] Search and advanced filtering
- [ ] Lesson plan templates
- [ ] Analytics dashboard
- [ ] Mobile improvements

---

## �️ Usage Guide

1. **Create:** Click "צרי חדש" to open the form. Fill in the topic, goals, and add the lesson flow stages. You can drag and drop files to attach them.
2. **View:** Click on any card in the dashboard to see the full details.
3. **Export:** \* Click **Word** to download an editable document.

- Click **Print** to open the browser's print dialog (optimized for PDF saving).

---

## � Roadmap

- [ ] User Authentication (Login/Register).
- [ ] Edit existing lesson plans.
- [ ] Search and Filter functionality.
- [ ] Share plans with other kindergartens.

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/amazing-feature`).
3. Commit your changes.
4. Push to the branch.
5. Open a Pull Request.
