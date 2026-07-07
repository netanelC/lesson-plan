<div align="center">
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/React-Dark.svg" height="80" alt="React" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/TypeScript.svg" height="80" alt="TypeScript" />
  <img src="https://raw.githubusercontent.com/tandpfun/skill-icons/main/icons/PostgreSQL-Dark.svg" height="80" alt="PostgreSQL" />

  <h1>📚 Lesson Planner App</h1>

  <p><strong>A modern, full-stack monorepo application for creating, managing, and organizing kindergarten lesson plans.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Node.js-22+-green?style=flat-square&logo=node.js" alt="Node Version" />
    <img src="https://img.shields.io/badge/pnpm-10.0+-orange?style=flat-square&logo=pnpm" alt="pnpm" />
    <img src="https://img.shields.io/badge/Turborepo-2.9+-blue?style=flat-square&logo=vercel" alt="Turborepo" />
    <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript" alt="TypeScript Strict" />
  </p>
</div>

<br />

## 📖 Project Overview

Built with **Turborepo** for maximum code reusability, type safety, and scalability. This application delivers a highly polished, responsive, and fully localized RTL (Hebrew) interface for educators to seamlessly manage their curriculum.

### 🏢 Architecture Overview

* **`apps/planner-manager`** - Fastify REST API backend with PostgreSQL + Prisma ORM, JWT authentication, and MinIO file storage
* **`apps/planner-ui`** - React 19 SPA frontend with Vite, TypeScript, Tailwind CSS, React Hook Form, and React Query
* **`packages/types`** - Single source of truth for TypeScript interfaces and Zod validation schemas
* **`packages/typescript-config`** - Shared TypeScript compiler configuration
* **`packages/eslint-config`** - Shared ESLint strict rules and presets

---

## ✨ Key Features

* 🔐 **Robust Authentication** - Secure Email/Password + Google OAuth hybrid authentication via Fastify JWT.
* 🛡️ **Role-Based Access Control** - Granular permissions (OWNER, ADMIN, KINDERGARTEN) mapped dynamically.
* 📝 **Advanced Form Management** - Deeply validated multi-step pedagogical flows using React Hook Form & Zod.
* 📎 **S3-Compatible Storage** - Live drag-and-drop file attachments (images, audio, documents) backed by MinIO.
* 📄 **Word Document Generation** - Client-side `.docx` generation fully localized with RTL tables and styling.
* 🔖 **Saved & Bookmarked Plans** - Custom user dashboard tailored for active or favorited lesson plans.
* ⚡ **100% Type-Safe** - Zero `any` usage. End-to-end type safety from the Prisma database all the way to React props.
* 🌐 **Hebrew Native** - Full right-to-left layout integration with Tailwind CSS RTL features.

---

## 🛠️ Technology Stack

| Domain | Technology Choice | Description |
| :--- | :--- | :--- |
| **Frontend** | React 19, Vite 7 | High-performance SPA with modern React hooks. |
| **Styling** | Tailwind CSS v3 | Utility-first CSS with seamless RTL integration. |
| **State & Fetching** | TanStack Query v5, Axios | Advanced server-state caching and interception. |
| **Backend API** | Node 22, Fastify v5 | High-throughput, low-overhead REST architecture. |
| **Database** | PostgreSQL 15, Prisma v7 | Relational storage with declarative schema definitions. |
| **File Storage** | MinIO | S3-compatible, high-performance object storage. |
| **Validation** | Zod v4 | Shared schema definitions across frontend and backend. |
| **Testing** | Vitest, Supertest | Integration and unit testing with real DB instances. |
| **CI / CD** | GitHub Actions | Automated linting, formatting, and test-suite enforcement. |

---

## 🚀 Getting Started

### Prerequisites

* **Node.js** 22+
* **pnpm** 10.0+
* **Docker & Docker Compose** (for PostgreSQL and MinIO)

### Local Development Setup

```bash
# 1. Clone and install dependencies
git clone <repository-url>
cd lesson-plan
pnpm install

# 2. Start infrastructure services (Database & Storage)
docker-compose up -d

# 3. Synchronize database schema & generate Prisma Client
pnpm db:push

# 4. Spin up the entire Turborepo dev environment
pnpm dev
```

### Local Services
- **Frontend App**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **MinIO Dashboard**: [http://localhost:9001](http://localhost:9001) *(admin/admin)*
- **PostgreSQL**: `localhost:5432`

---

## 💻 Available Scripts

This repository utilizes `pnpm` workspaces combined with Turborepo task execution.

```bash
# Development
pnpm dev                 # Start all dev servers (frontend + backend)
pnpm dev --filter planner-manager  # Start only backend
pnpm dev --filter planner-ui       # Start only frontend

# Building
pnpm build               # Build all apps and packages

# Testing & Quality
pnpm test                # Run all integration & unit tests via Vitest
pnpm lint                # Run strict ESLint rules across all packages
pnpm format              # Format codebase with Prettier
pnpm check-types         # Run tsc type-checking without emitting

# Database Management
pnpm db:push             # Apply pending schema changes directly
pnpm db:studio           # Open Prisma Studio web UI
pnpm db:reset            # Wipe and reset database
```

---

## 🧪 Testing & CI/CD

Quality is enforced aggressively through both local Vitest runs and automated GitHub Actions.

### Continuous Integration (CI)
Our `.github/workflows/ci.yml` ensures that no broken code merges to main. On every Pull Request, the CI automatically:
1. Deploys an isolated Postgres 15 container.
2. Generates the Prisma typings and pushes the schema.
3. Checks Prettier formatting and strictly evaluates ESLint.
4. Executes the full `pnpm run test` integration suite against the live DB.

### Testing Architecture
* Tests are designed following the **AAA (Arrange, Act, Assert)** pattern.
* Backend testing relies heavily on `@fastify/jwt` mocking and `supertest` for true HTTP layer validation.
* Tests run directly against an ephemeral PostgreSQL instance to guarantee schema integrity.

---

## 🤝 Contributing

We enforce **Conventional Commits** to auto-generate changelogs and maintain history.

```text
feat(lessonPlan): add export to Word functionality
fix(auth): handle Google OAuth token expiration
docs(README): update API documentation
```

1. Create a feature branch: `git checkout -b feat/your-feature`
2. Make your changes and commit using conventional formatting.
3. Push and open a pull request against `main`.
4. Ensure the GitHub Actions CI pipeline passes (Format, Lint, Test).
5. Request review.

---

## 📄 License

This project is proprietary and intended for internal kindergarten curriculum usage. 

<div align="center">
  <i>Built with strict standards, high performance, and robust testing in mind.</i>
</div>
