# 📦 @repo/types - Shared Type Definitions

Centralized package for TypeScript types and Zod validation schemas used across the lesson planner monorepo. **Single source of truth** for frontend and backend validation.

## 📋 Overview

This package ensures that:
- ✅ Frontend forms validate using the same schemas as the backend
- ✅ TypeScript interfaces are consistent across apps
- ✅ Validation rules are maintained in one place
- ✅ Type safety prevents data mismatches between frontend/backend

## 🏗️ Project Structure

```
src/
└── index.ts                  # Main exports
    ├── Schemas               # Zod validation schemas
    ├── Types                 # TypeScript interfaces
    └── Constants             # Enumerations
```

## 📝 Exported Types & Schemas

### Lesson Plan Schema

**`CreateLessonPlanSchema`** - Zod schema for creating/updating lesson plans

```typescript
const CreateLessonPlanSchema = z.object({
  topic: z.string().min(1),
  unit: z.string().min(1),
  ageGroup: z.enum(["3-4", "4-5"]),
  frame: z.enum(["plenary", "small-group"]),
  superGoal: z.string().min(1),
  operativeGoals: z.array(z.string()).min(3),
  priorKnowledge: z.string().optional(),
  teachingAids: z.array(z.string()),
  references: z.array(z.string()),
  lessonFlow: z.array(z.object({
    name: z.string(),
    durationMinutes: z.number().positive(),
    description: z.string()
  }))
});
```

### Types

| Type | Description |
|------|-------------|
| `LessonPlan` | Complete lesson plan with metadata |
| `CreateLessonPlanDto` | Request DTO for creating/updating |
| `Attachment` | File attachment metadata |
| `LessonStep` | Single lesson flow step |
| `AgeGroup` | "3-4" \| "4-5" |
| `ActivityFrame` | "plenary" \| "small-group" |

### Constants

```typescript
const AGE_GROUPS = ["3-4", "4-5"] as const;
const ACTIVITY_FRAMES = ["plenary", "small-group"] as const;
const MIN_OPERATIVE_GOALS = 1;
```

## 🔗 Usage

### In Frontend Components

```typescript
import { CreateLessonPlanSchema, type LessonPlan } from "@repo/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

function LessonPlanForm() {
  const form = useForm({
    resolver: zodResolver(CreateLessonPlanSchema),
    defaultValues: {
      topic: "",
      unit: "",
      ageGroup: "4-5",
      frame: "plenary",
      superGoal: "",
      operativeGoals: [""],
      priorKnowledge: "",
      teachingAids: [],
      references: [],
      lessonFlow: [
        { name: "", durationMinutes: 0, description: "" }
      ]
    }
  });

  return <form onSubmit={form.handleSubmit(onSubmit)}>...</form>;
}
```

### In Backend Routes

```typescript
import { CreateLessonPlanSchema, type CreateLessonPlanDto } from "@repo/types";

app.post<{ Body: CreateLessonPlanDto }>("/api/lessons", async (request, reply) => {
  // Validate request body
  const validatedData = CreateLessonPlanSchema.parse(request.body);
  
  // Use validated data
  const lessonPlan = await lessonPlanService.create(validatedData);
  
  return reply.code(201).send(lessonPlan);
});
```

### Runtime Validation

```typescript
// Validate and parse in one step
try {
  const data = CreateLessonPlanSchema.parse(userInput);
  // data is type-safe as CreateLessonPlanDto
} catch (error) {
  // Handle validation error
  console.error(error.errors);
}

// Non-throwing validation
const result = CreateLessonPlanSchema.safeParse(userInput);
if (result.success) {
  console.log(result.data); // Type-safe
} else {
  console.error(result.error); // Zod error details
}
```

## 🔄 Monorepo Pattern

This package implements the **Single Source of Truth** pattern:

```
Frontend                     Backend
  ↓                            ↓
  └──────→ @repo/types ←───────┘
     ↑                        ↑
  Uses same               Validates same
  schemas &               schemas &
  types                   types
```

### Benefits

1. **Consistency** - Frontend and backend always agree on data shape
2. **Type Safety** - Full TypeScript support in both environments
3. **Maintainability** - Update validation rules once, both use the new rules
4. **Validation Parity** - Same validation logic on both sides
5. **DRY Principle** - No duplication of schemas

## 📦 Installation & Setup

### For Applications

The types are automatically available via the workspace alias:

```typescript
// Both work identically:
import { LessonPlan } from "@repo/types";
import { LessonPlan } from "../../../packages/types/src";
```

### Configuration

In your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@repo/types": ["../../packages/types/src/index.ts"],
      "@repo/types/*": ["../../packages/types/src/*"]
    }
  }
}
```

## ✏️ Maintenance Guidelines

### Adding a New Type

1. Define the Zod schema (includes validation)
2. Extract the TypeScript type from the schema
3. Export both from `index.ts`

**Example:**

```typescript
// src/index.ts

// 1. Define Zod schema
const MyEntitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.date()
});

// 2. Extract TypeScript type
type MyEntity = z.infer<typeof MyEntitySchema>;

// 3. Export both
export { MyEntitySchema, type MyEntity };
```

### Updating Validation Rules

When changing validation:

1. Update the Zod schema in `@repo/types`
2. Both frontend and backend automatically use the new rules
3. TypeScript will flag any type mismatches
4. No need to update validations in two places

## 🎯 Current Schema Coverage

| Entity | Type | Schema | Status |
|--------|------|--------|--------|
| Lesson Plan | ✅ | `CreateLessonPlanSchema` | ✅ Complete |
| Attachment | ✅ | Included in LessonPlan | ✅ Complete |
| Lesson Step | ✅ | Inline in LessonFlow | ✅ Complete |

## 📚 Available Scripts

```bash
# From workspace root:
pnpm -F @repo/types type-check    # Type checking
pnpm -F @repo/types lint          # Linting
```

## 🔐 Type Safety Guarantees

All exported types are:
- ✅ **100% TypeScript** - No `any` types
- ✅ **Zod-backed** - Runtime validation available
- ✅ **Consistent** - Single definition across monorepo
- ✅ **Exhaustive** - All business entities covered

## 📖 For More Information

- See [Root README](../../README.md) for monorepo overview
- See [Backend README](../../apps/planner-manager/README.md) for API schema details
- See [Frontend README](../../apps/planner-ui/README.md) for form usage

## 🤝 Contributing

When modifying types:

1. Update Zod schema first
2. Extract TypeScript types from schemas
3. Run `pnpm type-check` to verify changes
4. Update tests if behavior changes
5. Commit with clear message about schema changes
