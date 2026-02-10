# 📚 Lesson Planner App

A modern, full-stack application designed for teachers to create, manage, and organize lesson plans. This project is built as a **Monorepo** to ensure type safety across the frontend and backend.

## 🚀 Features

* **Create Lesson Plans:** A detailed form with validation for pedagogy, operative goals, and lesson flow.
* **File Attachments:** Upload and attach files (Images, Audio, Docs) to specific lesson plans.
* **Dashboard:** View all lesson plans in a card-based layout.
* **Export to Word:** Generate a `.doc` file with specific Hebrew formatting and tables.
* **Export to PDF:** Clean, printer-friendly layout with automatic header/footer removal.
* **Manage:** Delete old lesson plans.
* **Hebrew Support:** Fully RTL (Right-to-Left) interface.

## 🛠️ Tech Stack

### Monorepo Structure

* **Turborepo**: High-performance build system.
* **pnpm**: Fast, disk space-efficient package manager.

### Frontend (`apps/planner-ui`)

* **React** (Vite): Fast UI development.
* **Tailwind CSS**: Utility-first styling.
* **React Hook Form + Zod**: Robust form validation.
* **TanStack Query**: Server state management.

### Backend (`apps/planner-manager`)

* **Fastify**: High-performance Node.js web framework.
* **Prisma ORM**: Type-safe database access.
* **MinIO**: S3-compatible object storage for file uploads.

### Shared (`packages/types`)

* **Shared Zod Schemas**: A single source of truth for validation rules used by both Frontend and Backend.

---

## 📂 Project Structure

```bash
├── apps
│   ├── planner-ui       # React Frontend
│   └── planner-manager  # Fastify Backend API
├── packages
│   ├── types            # Shared TypeScript interfaces & Zod schemas
│   └── config           # Shared TSConfig / ESLint configs

```

---

## ⚡ Getting Started

### 1. Prerequisites

* **Node.js** (v18+)
* **pnpm** (Install via `npm i -g pnpm`)
* **Docker** (For the Database and MinIO)

### 2. Installation

Clone the repo and install dependencies:

```bash
git clone <your-repo-url>
cd planner-app
pnpm install

```

### 3. Environment Setup

Create a `.env` file in `apps/planner-manager` (you can copy `.env.example` if it exists):

```env
# apps/planner-manager/.env
DATABASE_URL="postgresql://user:password@localhost:5432/planner_db"
PORT=3000

# MinIO / S3 Configuration
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET_NAME="planner-files"

```

### 4. Run Infrastructure

Start PostgreSQL and MinIO using Docker Compose (assuming you have a `docker-compose.yml` in the root or `packages/db`):

```bash
docker compose up -d

```

### 5. Database Setup

Push the Prisma schema to your local database:

```bash
# Run from root
pnpm db:push

```

### 6. Run Development Server

Start both the Frontend and Backend simultaneously:

```bash
pnpm dev

```

* **Frontend:** http://localhost:5173
* **Backend:** http://localhost:3000

---

## 🖼️ Usage Guide

1. **Create:** Click "צור חדש" to open the form. Fill in the topic, goals, and add the lesson flow stages. You can drag and drop files to attach them.
2. **View:** Click on any card in the dashboard to see the full details.
3. **Export:** * Click **Word** to download an editable document.
* Click **Print** to open the browser's print dialog (optimized for PDF saving).



---

## 🔜 Roadmap

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
