# 🛠️ Planner Manager - Backend API

Backend API server for the Lesson Planner application. Built with **Fastify**, **Prisma ORM**, and **TypeScript**.

## 📋 Overview

The backend provides RESTful API endpoints for managing lesson plans and file attachments. It follows clean architecture principles with clear separation between controllers, services, and data access layers.

## 🚀 Features

- ✅ **Type-Safe API** - 100% TypeScript with zero `any` usage
- ✅ **Request Validation** - Zod schema validation on all endpoints
- ✅ **File Storage** - MinIO S3-compatible file uploads and downloads
- ✅ **Database** - PostgreSQL with Prisma ORM and migrations
- ✅ **Clean Architecture** - DAL → Service → Controller separation
- ✅ **Error Handling** - Consistent error responses and logging
- ✅ **Hebrew Support** - Full support for Hebrew error messages

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Fastify 5.x
- **Language**: TypeScript
- **Database**: PostgreSQL + Prisma ORM
- **File Storage**: MinIO (S3-compatible)
- **Validation**: Zod
- **Package Manager**: pnpm

## 📂 Project Structure

```
src/
├── app.ts                    # Fastify app configuration
├── server.ts                 # Server startup entry point
├── lessonPlan/               # Lesson Plan feature
│   ├── controller.ts         # Request handlers
│   ├── service.ts            # Business logic & orchestration
│   ├── DAL.ts                # Data access layer
│   ├── routes.ts             # Route definitions
│   └── index.ts              # Exports
└── file-storage/             # File storage service
    ├── service.ts            # MinIO operations
    └── index.ts              # Exports

db/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
├── types.ts                  # Database-related types
└── helpers.ts                # Database utilities

config/
└── default.json              # Environment configuration
```

## ⚡ Quick Start

### Prerequisites

- Node.js v18+
- pnpm v8+
- PostgreSQL (via Docker)
- MinIO (via Docker)

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Setup environment variables:**
   Create a `.env` file:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/planner_db"
   PORT=3000
   NODE_ENV=development
   ```

3. **Start infrastructure:**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations:**
   ```bash
   pnpm db:push
   ```

5. **Start development server:**
   ```bash
   pnpm dev
   ```

   Server will be available at `http://localhost:3000`

## 🔌 API Endpoints

### Lesson Plans

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/lessons` | Create a new lesson plan |
| `GET` | `/api/lessons` | Get all lesson plans |
| `GET` | `/api/lessons/:id` | Get a specific lesson plan |
| `PUT` | `/api/lessons/:id` | Update a lesson plan |
| `DELETE` | `/api/lessons/:id` | Delete a lesson plan |

### Attachments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/lessons/:id/attachments` | Upload file attachment |
| `GET` | `/api/lessons/attachments/:id/download` | Download attachment |
| `DELETE` | `/api/lessons/attachments/:fileId` | Delete attachment |

## 📝 Request/Response Examples

### Create Lesson Plan

**Request:**
```bash
POST /api/lessons
Content-Type: application/json

{
  "topic": "צמחים בעונת האביב",
  "unit": "יחידה 3 - הטבע",
  "ageGroup": "4-5",
  "frame": "plenary",
  "superGoal": "התלמידים יבינו את חשיבות ההגנה על הטבע",
  "operativeGoals": [
    "התלמיד יוכל לזהות סוגי צמחים",
    "התלמיד יבין את מחזור החיים",
    "התלמיד יוכל להסביר את התפקיד של צמחים"
  ],
  "priorKnowledge": "היכרות עם מחזור החיים",
  "teachingAids": ["מיקרוסקופ", "תמונות צמחים"],
  "references": ["ספר - 'החי והצומח' בעמ׳ 45-50"],
  "lessonFlow": [
    {
      "name": "פתיחה",
      "durationMinutes": 5,
      "description": "שיחה עם התלמידים על הנושא"
    },
    {
      "name": "גוף השיעור",
      "durationMinutes": 30,
      "description": "חקירה של צמחים בעזרת מיקרוסקופ"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "topic": "צמחים בעונת האביב",
  "unit": "יחידה 3 - הטבע",
  "ageGroup": "4-5",
  "frame": "plenary",
  "superGoal": "התלמידים יבינו את חשיבות ההגנה על הטבע",
  "operativeGoals": [...],
  "priorKnowledge": "היכרות עם מחזור החיים",
  "teachingAids": [...],
  "references": [...],
  "lessonFlow": [...],
  "author": "nati",
  "createdAt": "2026-02-11T12:00:00Z",
  "updatedAt": "2026-02-11T12:00:00Z",
  "isPublished": false
}
```

## 🗄️ Database Schema

### LessonPlan Model

```prisma
model LessonPlan {
  id          String   @id @default(uuid())
  author      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  isPublished Boolean  @default(false)
  
  // Header Info
  topic       String
  unit        String
  
  // Context
  frame       String    // "plenary" or "small-group"
  ageGroup    String    // "3-4" or "4-5"
  
  // Pedagogy
  superGoal       String
  operativeGoals  String[]
  priorKnowledge  String?
  
  // Preparation
  teachingAids String[]
  references   String[]
  
  // Content
  lessonFlow  Json      // Array of lesson steps
  
  // Relations
  attachments Attachment[]
}

model Attachment {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now())
  
  filename  String    // Original filename
  url       String    // MinIO URL
  fileType  String    // MIME type
  sizeBytes Int
  
  // Foreign Key
  lessonPlan   LessonPlan @relation(fields: [lessonPlanId], references: [id], onDelete: Cascade)
  lessonPlanId String
}
```

## 🏗️ Architecture

### Layered Architecture

1. **Routes Layer** (`routes.ts`)
   - Defines endpoints and validation schemas
   - Maps requests to controllers

2. **Controller Layer** (`controller.ts`)
   - Thin request handlers
   - Parse requests → Call service → Return response
   - Handle HTTP status codes

3. **Service Layer** (`service.ts`)
   - Orchestrate complex operations
   - Coordinate between DAL and external services
   - Example: removeAttachment coordinates MinIO deletion + DB cleanup

4. **DAL Layer** (`DAL.ts`)
   - Pure database operations
   - Uses Prisma for type-safe queries
   - No business logic

## 📚 Available Scripts

```bash
# Development
pnpm dev              # Start server with hot reload
pnpm build            # Build TypeScript to JavaScript
pnpm start            # Run built server
pnpm lint             # Run ESLint

# Database
pnpm db:push          # Apply Prisma migrations
pnpm db:studio        # Open Prisma Studio GUI

# Type checking
pnpm type-check       # Run TypeScript type checker
```

## 🔐 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `DATABASE_URL` | Required | PostgreSQL connection string |
| `MINIO_ENDPOINT` | `localhost` | MinIO host |
| `MINIO_PORT` | `9000` | MinIO port |
| `MINIO_ACCESS_KEY` | `minioadmin` | MinIO access key |
| `MINIO_SECRET_KEY` | `minioadmin` | MinIO secret key |

## 🐛 Error Handling

All errors follow a consistent format:

```json
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": "ValidationError: ...",
  "details": {...}
}
```

Common status codes:
- `201` - Created
- `200` - OK
- `204` - No Content
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Server Error

## 📖 For More Information

- See [Root README](../../README.md) for monorepo overview
- See [Frontend README](../planner-ui/README.md) for frontend documentation
- See [Types README](../../packages/types/README.md) for shared types

## 🤝 Contributing

When modifying the backend:

1. Update the Prisma schema if database changes are needed
2. Run `pnpm db:push` to generate migrations
3. Ensure all endpoints are validated with Zod schemas
4. Follow the DAL → Service → Controller pattern
5. Add TypeScript types from `@repo/types`
