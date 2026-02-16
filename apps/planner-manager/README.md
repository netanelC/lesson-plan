# 🛠️ Planner Manager - Backend API

Fastify-based REST API server for the Lesson Planner application. Provides endpoints for lesson plan management, file storage, user authentication, and role-based access control.

## 📋 Project Overview

**Backend Type:** REST API (Stateless)  
**Framework:** Fastify 5.x  
**Language:** TypeScript 5.9+  
**Database:** PostgreSQL 15+ with Prisma ORM  
**Authentication:** JWT + Google OAuth  
**File Storage:** MinIO (S3-compatible)  
**Validation:** Zod schemas (shared with frontend)

## 🚀 Features

- ✅ **Type-Safe API** - 100% TypeScript with zero `any` usage
- ✅ **Request Validation** - Zod schema validation on all endpoints
- ✅ **File Storage** - MinIO S3-compatible file uploads and downloads
- ✅ **Database** - PostgreSQL with Prisma ORM and migrations
- ✅ **Clean Architecture** - DAL → Service → Controller separation
- ✅ **Error Handling** - Consistent error responses and logging
- ✅ **Hebrew Support** - Full support for Hebrew error messages

## 🛠️ Tech Stack

- **Runtime**: Node.js 22+
- **Framework**: Fastify 5.7.4
- **Language**: TypeScript 5.9+
- **Database**: PostgreSQL 15+ with Prisma ORM 7.3+
- **File Storage**: MinIO (S3-compatible)
- **Authentication**: JWT + Google OAuth (google-auth-library 10.5.0)
- **Validation**: Zod 4.3+
- **Package Manager**: pnpm 10.0.0

## 📂 Project Structure

```
src/
├── app.ts                    # Fastify app configuration
├── server.ts                 # Server startup entry point
├── auth/                     # Authentication & JWT
│   ├── controller.ts         # Auth request handlers
│   ├── service.ts            # Auth business logic
│   ├── routes.ts             # Auth endpoints
│   └── types.ts              # Auth type definitions
├── users/                    # User management
│   ├── controller.ts         # User request handlers
│   └── routes.ts             # User endpoints
├── lessonPlan/               # Lesson Plan feature
│   ├── controller.ts         # Request handlers
│   ├── service.ts            # Business logic & orchestration
│   ├── DAL.ts                # Data access layer
│   ├── routes.ts             # Route definitions
│   └── index.ts              # Exports
├── file-storage/             # File storage service
│   ├── service.ts            # MinIO operations
│   └── index.ts              # Exports
├── middleware/               # Express-like middleware
│   └── auth.ts               # JWT validation middleware
└── types/                    # Type definitions
    └── fastify-jwt.d.ts      # Fastify JWT plugin types

db/
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
├── types.ts                  # Database-related types
└── helpers.ts                # Database utilities

config/
├── default.json              # Default configuration
├── custom-environment-variables.json  # Environment variable mapping
└── production.json           # Production configuration
```

## ⚡ Quick Start

### Prerequisites

- Node.js v22+
- pnpm v10.0.0+
- PostgreSQL 15+ (via Docker Compose)
- MinIO (via Docker Compose)

### Installation

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Setup environment variables:**
   Create a `.env` file:

   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/planner_db"
   PORT=8080
   NODE_ENV=development
   ```

3. **Start infrastructure:**

   ```bash
   docker-compose up -d
   ```

4. **Run database migrations:**

   ```bash
   pnpm prisma migrate dev --name NAME
   ```

5. **Start development server:**

   ```bash
   pnpm dev
   ```

   Server will be available at `http://localhost:8080`

## 🔌 API Endpoints

### Lesson Plans

| Method   | Endpoint           | Description                |
| -------- | ------------------ | -------------------------- |
| `POST`   | `/api/lessons`     | Create a new lesson plan   |
| `GET`    | `/api/lessons`     | Get all lesson plans       |
| `GET`    | `/api/lessons/:id` | Get a specific lesson plan |
| `PUT`    | `/api/lessons/:id` | Update a lesson plan       |
| `DELETE` | `/api/lessons/:id` | Delete a lesson plan       |

### Attachments

| Method   | Endpoint                                | Description            |
| -------- | --------------------------------------- | ---------------------- |
| `POST`   | `/api/lessons/:id/attachments`          | Upload file attachment |
| `GET`    | `/api/lessons/attachments/:id/download` | Download attachment    |
| `DELETE` | `/api/lessons/attachments/:fileId`      | Delete attachment      |

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
pnpm dev              # Start server with hot reload (tsx watch)
pnpm build            # Build TypeScript to JavaScript
pnpm start            # Build and run server in production mode
pnpm lint             # Run ESLint

# Database
pnpm migration:dev    # Run Prisma migrations in dev mode
pnpm migration:deploy # Apply migrations to production database

# Type checking
pnpm type-check       # Run TypeScript type checker
```

## 🔐 Environment Variables

| Variable               | Default       | Description                          |
| ---------------------- | ------------- | ------------------------------------ |
| `PORT`                 | `8080`        | Server port                          |
| `NODE_ENV`             | `development` | Environment (development/production) |
| `DATABASE_URL`         | Required      | PostgreSQL connection string         |
| `JWT_SECRET`           | Required      | JWT signing secret (min 32 chars)    |
| `GOOGLE_CLIENT_ID`     | Required      | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET` | Required      | Google OAuth client secret           |
| `MINIO_ENDPOINT`       | `localhost`   | MinIO host                           |
| `MINIO_PORT`           | `9000`        | MinIO port                           |
| `MINIO_ACCESS_KEY`     | `minioadmin`  | MinIO access key                     |
| `MINIO_SECRET_KEY`     | `minioadmin`  | MinIO secret key                     |

## 🔑 Authentication

### JWT Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt-token>
```

The JWT contains user information and is issued after successful login.

### Google OAuth

Login with Google:

```bash
POST /api/auth/google
Content-Type: application/json

{
  "token": "<google-id-token>"
}
```

Response:

```json
{
  "accessToken": "<jwt-token>",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "User Name",
    "role": "KINDERGARTEN",
    "googleId": "google-id"
  }
}
```

### Email/Password Authentication

Register and login with email:

```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password",
  "fullName": "User Name"
}
```

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure-password"
}
```

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
2. Run `pnpm prisma migrate dev --name NAME` to generate migrations
3. Ensure all endpoints are validated with Zod schemas
4. Follow the DAL → Service → Controller pattern
5. Add TypeScript types from `@repo/types`
