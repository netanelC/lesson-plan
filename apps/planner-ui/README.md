# 🎨 Planner UI - Frontend Application

Modern React web application for creating and managing lesson plans. Built with **React 19**, **Vite**, **TypeScript**, and **Tailwind CSS**.

## 📋 Overview

Comprehensive SPA (Single Page Application) providing teachers with an intuitive interface to:
- Create and edit structured lesson plans
- Upload and manage teaching materials
- Export lesson plans to Word format
- View and organize lesson collections
- Full Hebrew language support with RTL layout

## 🚀 Features

- ✅ **Type-Safe Forms** - React Hook Form + Zod validation
- ✅ **Server State Management** - React Query (TanStack Query)
- ✅ **File Uploads** - Drag-and-drop attachments with preview
- ✅ **Export to Word** - Download lesson plans as .docx files
- ✅ **Responsive Design** - Mobile-friendly with Tailwind CSS
- ✅ **Hebrew RTL Support** - Full right-to-left layout
- ✅ **Zero TypeScript Errors** - 100% type-safe codebase

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Forms**: React Hook Form + Zod
- **API**: Axios + React Query
- **Routing**: React Router
- **Export**: DOCX generation

## 📂 Project Structure

```
src/
├── App.tsx                          # Main app component
├── main.tsx                         # React entry point
├── index.css                        # Global styles
├── components/
│   ├── Layout.tsx                   # Main layout wrapper
│   └── ui/
│       ├── TextInput.tsx            # Reusable text input
│       ├── SelectInput.tsx          # Select dropdown
│       ├── SectionCard.tsx          # Card wrapper
│       └── FileUploader.tsx         # File upload component
├── features/
│   └── lesson-plans/
│       ├── api/                     # API hooks (React Query)
│       │   ├── useCreateLessonPlan.ts
│       │   ├── useUpdateLessonPlan.ts
│       │   ├── useLessonPlan.ts
│       │   ├── useLessonPlans.ts
│       │   ├── useDeleteLessonPlan.ts
│       │   ├── useUploadAttachment.ts
│       │   └── useRemoveAttachment.ts
│       └── components/
│           ├── LessonPlanForm.tsx           # Main form orchestrator
│           ├── OperativeGoalsSection.tsx    # Goals management
│           ├── TeachingAidsAndReferences.tsx # Aids & references
│           └── LessonFlowSection.tsx        # Lesson flow steps
├── lib/
│   └── axios.ts                     # Configured Axios instance
├── providers/
│   └── QueryProvider.tsx            # React Query setup
└── utils/
    └── exportToWord.ts              # Word export utility
```

## ⚡ Quick Start

### Prerequisites

- Node.js v18+
- pnpm v8+
- Backend API running (see planner-manager README)

### Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Configure API endpoint:**
   Create `.env.local`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

   Application will be available at `http://localhost:5173`

## 🎯 Component Architecture

### Page Components

**LessonPlanForm** - Main lesson plan creation/editing page
- Manages form state via React Hook Form
- Orchestrates sub-component rendering
- Handles form submission and API calls
- ~246 lines

### Feature Components

| Component | Purpose | Lines |
|-----------|---------|-------|
| `OperativeGoalsSection` | Goals list management | ~90 |
| `TeachingAidsAndReferences` | Combined aids/references | ~90 |
| `LessonFlowSection` | Dynamic lesson step management | ~70 |

### UI Components (Reusable)

| Component | Purpose |
|-----------|---------|
| `TextInput` | Text field with label & validation error |
| `SelectInput` | Dropdown with label & validation error |
| `SectionCard` | Card wrapper for form sections |
| `FileUploader` | Drag-drop file upload with preview |

## 📝 Form Implementation

### State Management Pattern

All form state managed by React Hook Form with Zod validation:

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateLessonPlanSchema } from "@repo/types";

function LessonPlanForm() {
  const form = useForm({
    resolver: zodResolver(CreateLessonPlanSchema),
    defaultValues: {
      topic: "",
      unit: "",
      // ... other fields
    }
  });

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
      {/* Sub-components receive form methods */}
      <OperativeGoalsSection control={form.control} />
      <TeachingAidsAndReferences register={form.register} />
      {/* ... */}
    </form>
  );
}
```

### API Integration

Lesson plans fetched and managed via React Query hooks:

```typescript
// Fetch single lesson plan
const { data: lessonPlan, isLoading } = useLessonPlan(id);

// Create new lesson plan
const { mutate: createPlan } = useCreateLessonPlan();

// Update existing lesson plan
const { mutate: updatePlan } = useUpdateLessonPlan(id);

// Delete lesson plan
const { mutate: deletePlan } = useDeleteLessonPlan(id);
```

All hooks use `api.axios` for consistent HTTP client with:
- Base URL configuration
- Request/response interceptors
- Error handling

## 📤 File Uploads

### Upload Attachment

```typescript
const { mutate: uploadFile, isPending } = useUploadAttachment(lessonPlanId);

uploadFile(
  { file },
  {
    onSuccess: (attachment) => {
      console.log(`File uploaded: ${attachment.filename}`);
    }
  }
);
```

### Remove Attachment

```typescript
const { mutate: removeFile } = useRemoveAttachment(lessonPlanId);

removeFile({ fileId }, {
  onSuccess: () => {
    console.log("File removed");
  }
});
```

## 💾 Export to Word

Convert lesson plans to .docx files:

```typescript
import { exportToWord } from "@/utils/exportToWord";

const handleExport = async (lessonPlan: LessonPlan) => {
  await exportToWord(lessonPlan);
  // Downloads lessonPlan-[topic].docx
};
```

## 🌐 Internationalization (i18n)

### Hebrew RTL Support

Full right-to-left layout with:
- `dir="rtl"` on root element
- Tailwind RTL modifier support
- All form labels and placeholders in Hebrew
- Hebrew hints on form inputs

**Example:**
```typescript
<input
  placeholder="לדוגמה: צמחים בעונת האביב"
  // Displays right-to-left
/>
```

## 🎨 Styling

### Tailwind CSS + RTL

Responsive design using Tailwind CSS with RTL support:

```typescript
<div className="flex rtl:flex-row-reverse gap-4">
  {/* Automatically reverses layout in RTL mode */}
</div>
```

### Custom Colors

Defined in `tailwind.config.js`:
- Primary colors for buttons and links
- Neutral colors for text and backgrounds
- Semantic colors (success, error, warning)

## 📚 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with HMR
pnpm build            # Build for production
pnpm preview          # Preview production build locally
pnpm lint             # Run ESLint
pnpm type-check       # TypeScript type checking
```

## 🔐 Environment Variables

| Variable | Required | Default |
|----------|----------|---------|
| `VITE_API_BASE_URL` | Yes | `http://localhost:3000` |

## 🧪 Testing

Test all forms and components:

```bash
# From workspace root:
pnpm -F planner-ui test
```

Tests cover:
- Form validation with Zod schemas
- API integration with React Query
- Component rendering with RTL
- File upload functionality

## 📖 For More Information

- See [Root README](../../README.md) for monorepo overview
- See [Backend README](../planner-manager/README.md) for API documentation
- See [Types README](../../packages/types/README.md) for shared type definitions

## 🤝 Contributing

When developing features:

1. Use React Hook Form for form state
2. Use React Query for API calls
3. Validate with @repo/types schemas
4. Follow component extraction pattern for large forms
5. Test forms with Zod validation
6. Ensure RTL support with Tailwind RTL modifiers
7. Add Hebrew hints/placeholders to form inputs
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
