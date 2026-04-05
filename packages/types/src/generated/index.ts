import { z } from 'zod';
import { Prisma } from '../../../../apps/planner-manager/src/db/prisma/generated/client/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.NullTypes.DbNull;
  if (v === 'JsonNull') return Prisma.NullTypes.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.string(), z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.any() }),
    z.record(z.string(), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','fullName','role','createdAt','updatedAt']);

export const LessonPlanScalarFieldEnumSchema = z.enum(['id','topic','unit','frame','ageGroup','superGoal','operativeGoals','lessonFlow','teachingAids','references','isPublished','createdAt','updatedAt','authorId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const JsonNullValueInputSchema: z.ZodType<Prisma.JsonNullValueInput> = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const JsonNullValueFilterSchema: z.ZodType<Prisma.JsonNullValueFilter> = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const FrameSchema = z.enum(['PLENARY','SMALL_GROUP']);

export type FrameType = `${z.infer<typeof FrameSchema>}`

export const AgeGroupSchema = z.enum(['THREE_TO_FOUR','FOUR_TO_FIVE']);

export type AgeGroupType = `${z.infer<typeof AgeGroupSchema>}`

export const RoleSchema = z.enum(['KINDERGARTEN','ADMIN','OWNER']);

export type RoleType = `${z.infer<typeof RoleSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: RoleSchema,
  id: z.cuid(),
  email: z.string(),
  fullName: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// LESSON PLAN SCHEMA
/////////////////////////////////////////

export const LessonPlanSchema = z.object({
  frame: FrameSchema,
  ageGroup: AgeGroupSchema,
  id: z.uuid(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  unit: z.string().min(2, { message: "נא להזין יחידת לימוד" }),
  superGoal: z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),
  operativeGoals: z.string().array(),
  lessonFlow: JsonValueSchema,
  teachingAids: z.string().array(),
  references: z.string().array(),
  isPublished: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  authorId: z.string(),
})

export type LessonPlan = z.infer<typeof LessonPlanSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  lessonPlans: z.union([z.boolean(),z.lazy(() => LessonPlanFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  lessonPlans: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  fullName: z.boolean().optional(),
  role: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  lessonPlans: z.union([z.boolean(),z.lazy(() => LessonPlanFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// LESSON PLAN
//------------------------------------------------------

export const LessonPlanIncludeSchema: z.ZodType<Prisma.LessonPlanInclude> = z.object({
  author: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict();

export const LessonPlanArgsSchema: z.ZodType<Prisma.LessonPlanDefaultArgs> = z.object({
  select: z.lazy(() => LessonPlanSelectSchema).optional(),
  include: z.lazy(() => LessonPlanIncludeSchema).optional(),
}).strict();

export const LessonPlanSelectSchema: z.ZodType<Prisma.LessonPlanSelect> = z.object({
  id: z.boolean().optional(),
  topic: z.boolean().optional(),
  unit: z.boolean().optional(),
  frame: z.boolean().optional(),
  ageGroup: z.boolean().optional(),
  superGoal: z.boolean().optional(),
  operativeGoals: z.boolean().optional(),
  lessonFlow: z.boolean().optional(),
  teachingAids: z.boolean().optional(),
  references: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  authorId: z.boolean().optional(),
  author: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  fullName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  lessonPlans: z.lazy(() => LessonPlanListRelationFilterSchema).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  lessonPlans: z.lazy(() => LessonPlanOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.cuid(),
    email: z.string(),
  }),
  z.object({
    id: z.cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  fullName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  lessonPlans: z.lazy(() => LessonPlanListRelationFilterSchema).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  fullName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumRoleWithAggregatesFilterSchema), z.lazy(() => RoleSchema) ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const LessonPlanWhereInputSchema: z.ZodType<Prisma.LessonPlanWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => LessonPlanWhereInputSchema), z.lazy(() => LessonPlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LessonPlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LessonPlanWhereInputSchema), z.lazy(() => LessonPlanWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  topic: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  frame: z.union([ z.lazy(() => EnumFrameFilterSchema), z.lazy(() => FrameSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => EnumAgeGroupFilterSchema), z.lazy(() => AgeGroupSchema) ]).optional(),
  superGoal: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  operativeGoals: z.lazy(() => StringNullableListFilterSchema).optional(),
  lessonFlow: z.lazy(() => JsonFilterSchema).optional(),
  teachingAids: z.lazy(() => StringNullableListFilterSchema).optional(),
  references: z.lazy(() => StringNullableListFilterSchema).optional(),
  isPublished: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  authorId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  author: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const LessonPlanOrderByWithRelationInputSchema: z.ZodType<Prisma.LessonPlanOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  frame: z.lazy(() => SortOrderSchema).optional(),
  ageGroup: z.lazy(() => SortOrderSchema).optional(),
  superGoal: z.lazy(() => SortOrderSchema).optional(),
  operativeGoals: z.lazy(() => SortOrderSchema).optional(),
  lessonFlow: z.lazy(() => SortOrderSchema).optional(),
  teachingAids: z.lazy(() => SortOrderSchema).optional(),
  references: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
  author: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const LessonPlanWhereUniqueInputSchema: z.ZodType<Prisma.LessonPlanWhereUniqueInput> = z.object({
  id: z.uuid(),
})
.and(z.strictObject({
  id: z.uuid().optional(),
  AND: z.union([ z.lazy(() => LessonPlanWhereInputSchema), z.lazy(() => LessonPlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LessonPlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LessonPlanWhereInputSchema), z.lazy(() => LessonPlanWhereInputSchema).array() ]).optional(),
  topic: z.union([ z.lazy(() => StringFilterSchema), z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }) ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string().min(2, { message: "נא להזין יחידת לימוד" }) ]).optional(),
  frame: z.union([ z.lazy(() => EnumFrameFilterSchema), z.lazy(() => FrameSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => EnumAgeGroupFilterSchema), z.lazy(() => AgeGroupSchema) ]).optional(),
  superGoal: z.union([ z.lazy(() => StringFilterSchema), z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }) ]).optional(),
  operativeGoals: z.lazy(() => StringNullableListFilterSchema).optional(),
  lessonFlow: z.lazy(() => JsonFilterSchema).optional(),
  teachingAids: z.lazy(() => StringNullableListFilterSchema).optional(),
  references: z.lazy(() => StringNullableListFilterSchema).optional(),
  isPublished: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  authorId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  author: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const LessonPlanOrderByWithAggregationInputSchema: z.ZodType<Prisma.LessonPlanOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  frame: z.lazy(() => SortOrderSchema).optional(),
  ageGroup: z.lazy(() => SortOrderSchema).optional(),
  superGoal: z.lazy(() => SortOrderSchema).optional(),
  operativeGoals: z.lazy(() => SortOrderSchema).optional(),
  lessonFlow: z.lazy(() => SortOrderSchema).optional(),
  teachingAids: z.lazy(() => SortOrderSchema).optional(),
  references: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => LessonPlanCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => LessonPlanMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => LessonPlanMinOrderByAggregateInputSchema).optional(),
});

export const LessonPlanScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.LessonPlanScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => LessonPlanScalarWhereWithAggregatesInputSchema), z.lazy(() => LessonPlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => LessonPlanScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LessonPlanScalarWhereWithAggregatesInputSchema), z.lazy(() => LessonPlanScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  topic: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  unit: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  frame: z.union([ z.lazy(() => EnumFrameWithAggregatesFilterSchema), z.lazy(() => FrameSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => EnumAgeGroupWithAggregatesFilterSchema), z.lazy(() => AgeGroupSchema) ]).optional(),
  superGoal: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  operativeGoals: z.lazy(() => StringNullableListFilterSchema).optional(),
  lessonFlow: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  teachingAids: z.lazy(() => StringNullableListFilterSchema).optional(),
  references: z.lazy(() => StringNullableListFilterSchema).optional(),
  isPublished: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  authorId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  email: z.string(),
  fullName: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lessonPlans: z.lazy(() => LessonPlanCreateNestedManyWithoutAuthorInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.cuid().optional(),
  email: z.string(),
  fullName: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  lessonPlans: z.lazy(() => LessonPlanUncheckedCreateNestedManyWithoutAuthorInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lessonPlans: z.lazy(() => LessonPlanUpdateManyWithoutAuthorNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  lessonPlans: z.lazy(() => LessonPlanUncheckedUpdateManyWithoutAuthorNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.cuid().optional(),
  email: z.string(),
  fullName: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanCreateInputSchema: z.ZodType<Prisma.LessonPlanCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  unit: z.string().min(2, { message: "נא להזין יחידת לימוד" }),
  frame: z.lazy(() => FrameSchema),
  ageGroup: z.lazy(() => AgeGroupSchema),
  superGoal: z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),
  operativeGoals: z.union([ z.lazy(() => LessonPlanCreateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  teachingAids: z.union([ z.lazy(() => LessonPlanCreateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanCreatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  author: z.lazy(() => UserCreateNestedOneWithoutLessonPlansInputSchema),
});

export const LessonPlanUncheckedCreateInputSchema: z.ZodType<Prisma.LessonPlanUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  unit: z.string().min(2, { message: "נא להזין יחידת לימוד" }),
  frame: z.lazy(() => FrameSchema),
  ageGroup: z.lazy(() => AgeGroupSchema),
  superGoal: z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),
  operativeGoals: z.union([ z.lazy(() => LessonPlanCreateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  teachingAids: z.union([ z.lazy(() => LessonPlanCreateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanCreatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  authorId: z.string(),
});

export const LessonPlanUpdateInputSchema: z.ZodType<Prisma.LessonPlanUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string().min(2, { message: "נא להזין יחידת לימוד" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  frame: z.union([ z.lazy(() => FrameSchema), z.lazy(() => EnumFrameFieldUpdateOperationsInputSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => EnumAgeGroupFieldUpdateOperationsInputSchema) ]).optional(),
  superGoal: z.union([ z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  operativeGoals: z.union([ z.lazy(() => LessonPlanUpdateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  teachingAids: z.union([ z.lazy(() => LessonPlanUpdateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanUpdatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  author: z.lazy(() => UserUpdateOneRequiredWithoutLessonPlansNestedInputSchema).optional(),
});

export const LessonPlanUncheckedUpdateInputSchema: z.ZodType<Prisma.LessonPlanUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string().min(2, { message: "נא להזין יחידת לימוד" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  frame: z.union([ z.lazy(() => FrameSchema), z.lazy(() => EnumFrameFieldUpdateOperationsInputSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => EnumAgeGroupFieldUpdateOperationsInputSchema) ]).optional(),
  superGoal: z.union([ z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  operativeGoals: z.union([ z.lazy(() => LessonPlanUpdateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  teachingAids: z.union([ z.lazy(() => LessonPlanUpdateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanUpdatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  authorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanCreateManyInputSchema: z.ZodType<Prisma.LessonPlanCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  unit: z.string().min(2, { message: "נא להזין יחידת לימוד" }),
  frame: z.lazy(() => FrameSchema),
  ageGroup: z.lazy(() => AgeGroupSchema),
  superGoal: z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),
  operativeGoals: z.union([ z.lazy(() => LessonPlanCreateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  teachingAids: z.union([ z.lazy(() => LessonPlanCreateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanCreatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  authorId: z.string(),
});

export const LessonPlanUpdateManyMutationInputSchema: z.ZodType<Prisma.LessonPlanUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string().min(2, { message: "נא להזין יחידת לימוד" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  frame: z.union([ z.lazy(() => FrameSchema), z.lazy(() => EnumFrameFieldUpdateOperationsInputSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => EnumAgeGroupFieldUpdateOperationsInputSchema) ]).optional(),
  superGoal: z.union([ z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  operativeGoals: z.union([ z.lazy(() => LessonPlanUpdateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  teachingAids: z.union([ z.lazy(() => LessonPlanUpdateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanUpdatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LessonPlanUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string().min(2, { message: "נא להזין יחידת לימוד" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  frame: z.union([ z.lazy(() => FrameSchema), z.lazy(() => EnumFrameFieldUpdateOperationsInputSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => EnumAgeGroupFieldUpdateOperationsInputSchema) ]).optional(),
  superGoal: z.union([ z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  operativeGoals: z.union([ z.lazy(() => LessonPlanUpdateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  teachingAids: z.union([ z.lazy(() => LessonPlanUpdateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanUpdatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  authorId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const EnumRoleFilterSchema: z.ZodType<Prisma.EnumRoleFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const LessonPlanListRelationFilterSchema: z.ZodType<Prisma.LessonPlanListRelationFilter> = z.strictObject({
  every: z.lazy(() => LessonPlanWhereInputSchema).optional(),
  some: z.lazy(() => LessonPlanWhereInputSchema).optional(),
  none: z.lazy(() => LessonPlanWhereInputSchema).optional(),
});

export const LessonPlanOrderByRelationAggregateInputSchema: z.ZodType<Prisma.LessonPlanOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  fullName: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const EnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.EnumRoleWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const EnumFrameFilterSchema: z.ZodType<Prisma.EnumFrameFilter> = z.strictObject({
  equals: z.lazy(() => FrameSchema).optional(),
  in: z.lazy(() => FrameSchema).array().optional(),
  notIn: z.lazy(() => FrameSchema).array().optional(),
  not: z.union([ z.lazy(() => FrameSchema), z.lazy(() => NestedEnumFrameFilterSchema) ]).optional(),
});

export const EnumAgeGroupFilterSchema: z.ZodType<Prisma.EnumAgeGroupFilter> = z.strictObject({
  equals: z.lazy(() => AgeGroupSchema).optional(),
  in: z.lazy(() => AgeGroupSchema).array().optional(),
  notIn: z.lazy(() => AgeGroupSchema).array().optional(),
  not: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => NestedEnumAgeGroupFilterSchema) ]).optional(),
});

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.strictObject({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const LessonPlanCountOrderByAggregateInputSchema: z.ZodType<Prisma.LessonPlanCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  frame: z.lazy(() => SortOrderSchema).optional(),
  ageGroup: z.lazy(() => SortOrderSchema).optional(),
  superGoal: z.lazy(() => SortOrderSchema).optional(),
  operativeGoals: z.lazy(() => SortOrderSchema).optional(),
  lessonFlow: z.lazy(() => SortOrderSchema).optional(),
  teachingAids: z.lazy(() => SortOrderSchema).optional(),
  references: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
});

export const LessonPlanMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LessonPlanMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  frame: z.lazy(() => SortOrderSchema).optional(),
  ageGroup: z.lazy(() => SortOrderSchema).optional(),
  superGoal: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
});

export const LessonPlanMinOrderByAggregateInputSchema: z.ZodType<Prisma.LessonPlanMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  unit: z.lazy(() => SortOrderSchema).optional(),
  frame: z.lazy(() => SortOrderSchema).optional(),
  ageGroup: z.lazy(() => SortOrderSchema).optional(),
  superGoal: z.lazy(() => SortOrderSchema).optional(),
  isPublished: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  authorId: z.lazy(() => SortOrderSchema).optional(),
});

export const EnumFrameWithAggregatesFilterSchema: z.ZodType<Prisma.EnumFrameWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => FrameSchema).optional(),
  in: z.lazy(() => FrameSchema).array().optional(),
  notIn: z.lazy(() => FrameSchema).array().optional(),
  not: z.union([ z.lazy(() => FrameSchema), z.lazy(() => NestedEnumFrameWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFrameFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFrameFilterSchema).optional(),
});

export const EnumAgeGroupWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAgeGroupWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => AgeGroupSchema).optional(),
  in: z.lazy(() => AgeGroupSchema).array().optional(),
  notIn: z.lazy(() => AgeGroupSchema).array().optional(),
  not: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => NestedEnumAgeGroupWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAgeGroupFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAgeGroupFilterSchema).optional(),
});

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const LessonPlanCreateNestedManyWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanCreateNestedManyWithoutAuthorInput> = z.strictObject({
  create: z.union([ z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema).array(), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LessonPlanCreateOrConnectWithoutAuthorInputSchema), z.lazy(() => LessonPlanCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LessonPlanCreateManyAuthorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
});

export const LessonPlanUncheckedCreateNestedManyWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanUncheckedCreateNestedManyWithoutAuthorInput> = z.strictObject({
  create: z.union([ z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema).array(), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LessonPlanCreateOrConnectWithoutAuthorInputSchema), z.lazy(() => LessonPlanCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LessonPlanCreateManyAuthorInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const EnumRoleFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumRoleFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => RoleSchema).optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const LessonPlanUpdateManyWithoutAuthorNestedInputSchema: z.ZodType<Prisma.LessonPlanUpdateManyWithoutAuthorNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema).array(), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LessonPlanCreateOrConnectWithoutAuthorInputSchema), z.lazy(() => LessonPlanCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LessonPlanUpsertWithWhereUniqueWithoutAuthorInputSchema), z.lazy(() => LessonPlanUpsertWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LessonPlanCreateManyAuthorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LessonPlanUpdateWithWhereUniqueWithoutAuthorInputSchema), z.lazy(() => LessonPlanUpdateWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LessonPlanUpdateManyWithWhereWithoutAuthorInputSchema), z.lazy(() => LessonPlanUpdateManyWithWhereWithoutAuthorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LessonPlanScalarWhereInputSchema), z.lazy(() => LessonPlanScalarWhereInputSchema).array() ]).optional(),
});

export const LessonPlanUncheckedUpdateManyWithoutAuthorNestedInputSchema: z.ZodType<Prisma.LessonPlanUncheckedUpdateManyWithoutAuthorNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema).array(), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => LessonPlanCreateOrConnectWithoutAuthorInputSchema), z.lazy(() => LessonPlanCreateOrConnectWithoutAuthorInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => LessonPlanUpsertWithWhereUniqueWithoutAuthorInputSchema), z.lazy(() => LessonPlanUpsertWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  createMany: z.lazy(() => LessonPlanCreateManyAuthorInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => LessonPlanWhereUniqueInputSchema), z.lazy(() => LessonPlanWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => LessonPlanUpdateWithWhereUniqueWithoutAuthorInputSchema), z.lazy(() => LessonPlanUpdateWithWhereUniqueWithoutAuthorInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => LessonPlanUpdateManyWithWhereWithoutAuthorInputSchema), z.lazy(() => LessonPlanUpdateManyWithWhereWithoutAuthorInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => LessonPlanScalarWhereInputSchema), z.lazy(() => LessonPlanScalarWhereInputSchema).array() ]).optional(),
});

export const LessonPlanCreateoperativeGoalsInputSchema: z.ZodType<Prisma.LessonPlanCreateoperativeGoalsInput> = z.strictObject({
  set: z.string().array(),
});

export const LessonPlanCreateteachingAidsInputSchema: z.ZodType<Prisma.LessonPlanCreateteachingAidsInput> = z.strictObject({
  set: z.string().array(),
});

export const LessonPlanCreatereferencesInputSchema: z.ZodType<Prisma.LessonPlanCreatereferencesInput> = z.strictObject({
  set: z.string().array(),
});

export const UserCreateNestedOneWithoutLessonPlansInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutLessonPlansInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutLessonPlansInputSchema), z.lazy(() => UserUncheckedCreateWithoutLessonPlansInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutLessonPlansInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const EnumFrameFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumFrameFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => FrameSchema).optional(),
});

export const EnumAgeGroupFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAgeGroupFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => AgeGroupSchema).optional(),
});

export const LessonPlanUpdateoperativeGoalsInputSchema: z.ZodType<Prisma.LessonPlanUpdateoperativeGoalsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const LessonPlanUpdateteachingAidsInputSchema: z.ZodType<Prisma.LessonPlanUpdateteachingAidsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const LessonPlanUpdatereferencesInputSchema: z.ZodType<Prisma.LessonPlanUpdatereferencesInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const UserUpdateOneRequiredWithoutLessonPlansNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutLessonPlansNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutLessonPlansInputSchema), z.lazy(() => UserUncheckedCreateWithoutLessonPlansInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutLessonPlansInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutLessonPlansInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutLessonPlansInputSchema), z.lazy(() => UserUpdateWithoutLessonPlansInputSchema), z.lazy(() => UserUncheckedUpdateWithoutLessonPlansInputSchema) ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedEnumRoleFilterSchema: z.ZodType<Prisma.NestedEnumRoleFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleFilterSchema) ]).optional(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedEnumRoleWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumRoleWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => RoleSchema).optional(),
  in: z.lazy(() => RoleSchema).array().optional(),
  notIn: z.lazy(() => RoleSchema).array().optional(),
  not: z.union([ z.lazy(() => RoleSchema), z.lazy(() => NestedEnumRoleWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumRoleFilterSchema).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedEnumFrameFilterSchema: z.ZodType<Prisma.NestedEnumFrameFilter> = z.strictObject({
  equals: z.lazy(() => FrameSchema).optional(),
  in: z.lazy(() => FrameSchema).array().optional(),
  notIn: z.lazy(() => FrameSchema).array().optional(),
  not: z.union([ z.lazy(() => FrameSchema), z.lazy(() => NestedEnumFrameFilterSchema) ]).optional(),
});

export const NestedEnumAgeGroupFilterSchema: z.ZodType<Prisma.NestedEnumAgeGroupFilter> = z.strictObject({
  equals: z.lazy(() => AgeGroupSchema).optional(),
  in: z.lazy(() => AgeGroupSchema).array().optional(),
  notIn: z.lazy(() => AgeGroupSchema).array().optional(),
  not: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => NestedEnumAgeGroupFilterSchema) ]).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedEnumFrameWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumFrameWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => FrameSchema).optional(),
  in: z.lazy(() => FrameSchema).array().optional(),
  notIn: z.lazy(() => FrameSchema).array().optional(),
  not: z.union([ z.lazy(() => FrameSchema), z.lazy(() => NestedEnumFrameWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFrameFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFrameFilterSchema).optional(),
});

export const NestedEnumAgeGroupWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAgeGroupWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => AgeGroupSchema).optional(),
  in: z.lazy(() => AgeGroupSchema).array().optional(),
  notIn: z.lazy(() => AgeGroupSchema).array().optional(),
  not: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => NestedEnumAgeGroupWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAgeGroupFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAgeGroupFilterSchema).optional(),
});

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const LessonPlanCreateWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanCreateWithoutAuthorInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  unit: z.string().min(2, { message: "נא להזין יחידת לימוד" }),
  frame: z.lazy(() => FrameSchema),
  ageGroup: z.lazy(() => AgeGroupSchema),
  superGoal: z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),
  operativeGoals: z.union([ z.lazy(() => LessonPlanCreateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  teachingAids: z.union([ z.lazy(() => LessonPlanCreateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanCreatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const LessonPlanUncheckedCreateWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanUncheckedCreateWithoutAuthorInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  unit: z.string().min(2, { message: "נא להזין יחידת לימוד" }),
  frame: z.lazy(() => FrameSchema),
  ageGroup: z.lazy(() => AgeGroupSchema),
  superGoal: z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),
  operativeGoals: z.union([ z.lazy(() => LessonPlanCreateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  teachingAids: z.union([ z.lazy(() => LessonPlanCreateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanCreatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const LessonPlanCreateOrConnectWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanCreateOrConnectWithoutAuthorInput> = z.strictObject({
  where: z.lazy(() => LessonPlanWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema) ]),
});

export const LessonPlanCreateManyAuthorInputEnvelopeSchema: z.ZodType<Prisma.LessonPlanCreateManyAuthorInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => LessonPlanCreateManyAuthorInputSchema), z.lazy(() => LessonPlanCreateManyAuthorInputSchema).array() ]),
  skipDuplicates: z.boolean().optional(),
});

export const LessonPlanUpsertWithWhereUniqueWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanUpsertWithWhereUniqueWithoutAuthorInput> = z.strictObject({
  where: z.lazy(() => LessonPlanWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => LessonPlanUpdateWithoutAuthorInputSchema), z.lazy(() => LessonPlanUncheckedUpdateWithoutAuthorInputSchema) ]),
  create: z.union([ z.lazy(() => LessonPlanCreateWithoutAuthorInputSchema), z.lazy(() => LessonPlanUncheckedCreateWithoutAuthorInputSchema) ]),
});

export const LessonPlanUpdateWithWhereUniqueWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanUpdateWithWhereUniqueWithoutAuthorInput> = z.strictObject({
  where: z.lazy(() => LessonPlanWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => LessonPlanUpdateWithoutAuthorInputSchema), z.lazy(() => LessonPlanUncheckedUpdateWithoutAuthorInputSchema) ]),
});

export const LessonPlanUpdateManyWithWhereWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanUpdateManyWithWhereWithoutAuthorInput> = z.strictObject({
  where: z.lazy(() => LessonPlanScalarWhereInputSchema),
  data: z.union([ z.lazy(() => LessonPlanUpdateManyMutationInputSchema), z.lazy(() => LessonPlanUncheckedUpdateManyWithoutAuthorInputSchema) ]),
});

export const LessonPlanScalarWhereInputSchema: z.ZodType<Prisma.LessonPlanScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => LessonPlanScalarWhereInputSchema), z.lazy(() => LessonPlanScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LessonPlanScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LessonPlanScalarWhereInputSchema), z.lazy(() => LessonPlanScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  topic: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  unit: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  frame: z.union([ z.lazy(() => EnumFrameFilterSchema), z.lazy(() => FrameSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => EnumAgeGroupFilterSchema), z.lazy(() => AgeGroupSchema) ]).optional(),
  superGoal: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  operativeGoals: z.lazy(() => StringNullableListFilterSchema).optional(),
  lessonFlow: z.lazy(() => JsonFilterSchema).optional(),
  teachingAids: z.lazy(() => StringNullableListFilterSchema).optional(),
  references: z.lazy(() => StringNullableListFilterSchema).optional(),
  isPublished: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  authorId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
});

export const UserCreateWithoutLessonPlansInputSchema: z.ZodType<Prisma.UserCreateWithoutLessonPlansInput> = z.strictObject({
  id: z.cuid().optional(),
  email: z.string(),
  fullName: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const UserUncheckedCreateWithoutLessonPlansInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutLessonPlansInput> = z.strictObject({
  id: z.cuid().optional(),
  email: z.string(),
  fullName: z.string(),
  role: z.lazy(() => RoleSchema).optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const UserCreateOrConnectWithoutLessonPlansInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutLessonPlansInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutLessonPlansInputSchema), z.lazy(() => UserUncheckedCreateWithoutLessonPlansInputSchema) ]),
});

export const UserUpsertWithoutLessonPlansInputSchema: z.ZodType<Prisma.UserUpsertWithoutLessonPlansInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutLessonPlansInputSchema), z.lazy(() => UserUncheckedUpdateWithoutLessonPlansInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutLessonPlansInputSchema), z.lazy(() => UserUncheckedCreateWithoutLessonPlansInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutLessonPlansInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutLessonPlansInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutLessonPlansInputSchema), z.lazy(() => UserUncheckedUpdateWithoutLessonPlansInputSchema) ]),
});

export const UserUpdateWithoutLessonPlansInputSchema: z.ZodType<Prisma.UserUpdateWithoutLessonPlansInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const UserUncheckedUpdateWithoutLessonPlansInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutLessonPlansInput> = z.strictObject({
  id: z.union([ z.cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fullName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => RoleSchema), z.lazy(() => EnumRoleFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanCreateManyAuthorInputSchema: z.ZodType<Prisma.LessonPlanCreateManyAuthorInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  unit: z.string().min(2, { message: "נא להזין יחידת לימוד" }),
  frame: z.lazy(() => FrameSchema),
  ageGroup: z.lazy(() => AgeGroupSchema),
  superGoal: z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),
  operativeGoals: z.union([ z.lazy(() => LessonPlanCreateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]),
  teachingAids: z.union([ z.lazy(() => LessonPlanCreateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanCreatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.boolean().optional(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const LessonPlanUpdateWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanUpdateWithoutAuthorInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string().min(2, { message: "נא להזין יחידת לימוד" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  frame: z.union([ z.lazy(() => FrameSchema), z.lazy(() => EnumFrameFieldUpdateOperationsInputSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => EnumAgeGroupFieldUpdateOperationsInputSchema) ]).optional(),
  superGoal: z.union([ z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  operativeGoals: z.union([ z.lazy(() => LessonPlanUpdateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  teachingAids: z.union([ z.lazy(() => LessonPlanUpdateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanUpdatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanUncheckedUpdateWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanUncheckedUpdateWithoutAuthorInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string().min(2, { message: "נא להזין יחידת לימוד" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  frame: z.union([ z.lazy(() => FrameSchema), z.lazy(() => EnumFrameFieldUpdateOperationsInputSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => EnumAgeGroupFieldUpdateOperationsInputSchema) ]).optional(),
  superGoal: z.union([ z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  operativeGoals: z.union([ z.lazy(() => LessonPlanUpdateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  teachingAids: z.union([ z.lazy(() => LessonPlanUpdateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanUpdatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanUncheckedUpdateManyWithoutAuthorInputSchema: z.ZodType<Prisma.LessonPlanUncheckedUpdateManyWithoutAuthorInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  unit: z.union([ z.string().min(2, { message: "נא להזין יחידת לימוד" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  frame: z.union([ z.lazy(() => FrameSchema), z.lazy(() => EnumFrameFieldUpdateOperationsInputSchema) ]).optional(),
  ageGroup: z.union([ z.lazy(() => AgeGroupSchema), z.lazy(() => EnumAgeGroupFieldUpdateOperationsInputSchema) ]).optional(),
  superGoal: z.union([ z.string().min(5, { message: "מטרת העל חייבת להכיל לפחות 5 תווים" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  operativeGoals: z.union([ z.lazy(() => LessonPlanUpdateoperativeGoalsInputSchema), z.string().array() ]).optional(),
  lessonFlow: z.union([ z.lazy(() => JsonNullValueInputSchema), InputJsonValueSchema ]).optional(),
  teachingAids: z.union([ z.lazy(() => LessonPlanUpdateteachingAidsInputSchema), z.string().array() ]).optional(),
  references: z.union([ z.lazy(() => LessonPlanUpdatereferencesInputSchema), z.string().array() ]).optional(),
  isPublished: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const LessonPlanFindFirstArgsSchema: z.ZodType<Prisma.LessonPlanFindFirstArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  where: LessonPlanWhereInputSchema.optional(), 
  orderBy: z.union([ LessonPlanOrderByWithRelationInputSchema.array(), LessonPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: LessonPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LessonPlanScalarFieldEnumSchema, LessonPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LessonPlanFindFirstOrThrowArgsSchema: z.ZodType<Prisma.LessonPlanFindFirstOrThrowArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  where: LessonPlanWhereInputSchema.optional(), 
  orderBy: z.union([ LessonPlanOrderByWithRelationInputSchema.array(), LessonPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: LessonPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LessonPlanScalarFieldEnumSchema, LessonPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LessonPlanFindManyArgsSchema: z.ZodType<Prisma.LessonPlanFindManyArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  where: LessonPlanWhereInputSchema.optional(), 
  orderBy: z.union([ LessonPlanOrderByWithRelationInputSchema.array(), LessonPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: LessonPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LessonPlanScalarFieldEnumSchema, LessonPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LessonPlanAggregateArgsSchema: z.ZodType<Prisma.LessonPlanAggregateArgs> = z.object({
  where: LessonPlanWhereInputSchema.optional(), 
  orderBy: z.union([ LessonPlanOrderByWithRelationInputSchema.array(), LessonPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: LessonPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const LessonPlanGroupByArgsSchema: z.ZodType<Prisma.LessonPlanGroupByArgs> = z.object({
  where: LessonPlanWhereInputSchema.optional(), 
  orderBy: z.union([ LessonPlanOrderByWithAggregationInputSchema.array(), LessonPlanOrderByWithAggregationInputSchema ]).optional(),
  by: LessonPlanScalarFieldEnumSchema.array(), 
  having: LessonPlanScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const LessonPlanFindUniqueArgsSchema: z.ZodType<Prisma.LessonPlanFindUniqueArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  where: LessonPlanWhereUniqueInputSchema, 
}).strict();

export const LessonPlanFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.LessonPlanFindUniqueOrThrowArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  where: LessonPlanWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const LessonPlanCreateArgsSchema: z.ZodType<Prisma.LessonPlanCreateArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  data: z.union([ LessonPlanCreateInputSchema, LessonPlanUncheckedCreateInputSchema ]),
}).strict();

export const LessonPlanUpsertArgsSchema: z.ZodType<Prisma.LessonPlanUpsertArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  where: LessonPlanWhereUniqueInputSchema, 
  create: z.union([ LessonPlanCreateInputSchema, LessonPlanUncheckedCreateInputSchema ]),
  update: z.union([ LessonPlanUpdateInputSchema, LessonPlanUncheckedUpdateInputSchema ]),
}).strict();

export const LessonPlanCreateManyArgsSchema: z.ZodType<Prisma.LessonPlanCreateManyArgs> = z.object({
  data: z.union([ LessonPlanCreateManyInputSchema, LessonPlanCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const LessonPlanCreateManyAndReturnArgsSchema: z.ZodType<Prisma.LessonPlanCreateManyAndReturnArgs> = z.object({
  data: z.union([ LessonPlanCreateManyInputSchema, LessonPlanCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict();

export const LessonPlanDeleteArgsSchema: z.ZodType<Prisma.LessonPlanDeleteArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  where: LessonPlanWhereUniqueInputSchema, 
}).strict();

export const LessonPlanUpdateArgsSchema: z.ZodType<Prisma.LessonPlanUpdateArgs> = z.object({
  select: LessonPlanSelectSchema.optional(),
  include: LessonPlanIncludeSchema.optional(),
  data: z.union([ LessonPlanUpdateInputSchema, LessonPlanUncheckedUpdateInputSchema ]),
  where: LessonPlanWhereUniqueInputSchema, 
}).strict();

export const LessonPlanUpdateManyArgsSchema: z.ZodType<Prisma.LessonPlanUpdateManyArgs> = z.object({
  data: z.union([ LessonPlanUpdateManyMutationInputSchema, LessonPlanUncheckedUpdateManyInputSchema ]),
  where: LessonPlanWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const LessonPlanUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.LessonPlanUpdateManyAndReturnArgs> = z.object({
  data: z.union([ LessonPlanUpdateManyMutationInputSchema, LessonPlanUncheckedUpdateManyInputSchema ]),
  where: LessonPlanWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const LessonPlanDeleteManyArgsSchema: z.ZodType<Prisma.LessonPlanDeleteManyArgs> = z.object({
  where: LessonPlanWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();