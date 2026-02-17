import { z } from 'zod';
import type { Prisma } from '../../../../apps/planner-manager/src/db/prisma/generated/client/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const LessonPlanScalarFieldEnumSchema = z.enum(['id','topic','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// LESSON PLAN SCHEMA
/////////////////////////////////////////

export const LessonPlanSchema = z.object({
  id: z.uuid(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type LessonPlan = z.infer<typeof LessonPlanSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// LESSON PLAN
//------------------------------------------------------

export const LessonPlanSelectSchema: z.ZodType<Prisma.LessonPlanSelect> = z.object({
  id: z.boolean().optional(),
  topic: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const LessonPlanWhereInputSchema: z.ZodType<Prisma.LessonPlanWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => LessonPlanWhereInputSchema), z.lazy(() => LessonPlanWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => LessonPlanWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => LessonPlanWhereInputSchema), z.lazy(() => LessonPlanWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  topic: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
});

export const LessonPlanOrderByWithRelationInputSchema: z.ZodType<Prisma.LessonPlanOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
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
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
}));

export const LessonPlanOrderByWithAggregationInputSchema: z.ZodType<Prisma.LessonPlanOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
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
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
});

export const LessonPlanCreateInputSchema: z.ZodType<Prisma.LessonPlanCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const LessonPlanUncheckedCreateInputSchema: z.ZodType<Prisma.LessonPlanUncheckedCreateInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const LessonPlanUpdateInputSchema: z.ZodType<Prisma.LessonPlanUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanUncheckedUpdateInputSchema: z.ZodType<Prisma.LessonPlanUncheckedUpdateInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanCreateManyInputSchema: z.ZodType<Prisma.LessonPlanCreateManyInput> = z.strictObject({
  id: z.uuid().optional(),
  topic: z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
});

export const LessonPlanUpdateManyMutationInputSchema: z.ZodType<Prisma.LessonPlanUpdateManyMutationInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const LessonPlanUncheckedUpdateManyInputSchema: z.ZodType<Prisma.LessonPlanUncheckedUpdateManyInput> = z.strictObject({
  id: z.union([ z.uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  topic: z.union([ z.string().min(3, { message: "הנושא חייב להכיל לפחות 3 תווים" }).max(100, { message: "הנושא ארוך מדי" }),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
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

export const LessonPlanCountOrderByAggregateInputSchema: z.ZodType<Prisma.LessonPlanCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const LessonPlanMaxOrderByAggregateInputSchema: z.ZodType<Prisma.LessonPlanMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
});

export const LessonPlanMinOrderByAggregateInputSchema: z.ZodType<Prisma.LessonPlanMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  topic: z.lazy(() => SortOrderSchema).optional(),
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

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
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

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const LessonPlanFindFirstArgsSchema: z.ZodType<Omit<Prisma.LessonPlanFindFirstArgs, "select">> = z.object({
  where: LessonPlanWhereInputSchema.optional(), 
  orderBy: z.union([ LessonPlanOrderByWithRelationInputSchema.array(), LessonPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: LessonPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LessonPlanScalarFieldEnumSchema, LessonPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LessonPlanFindFirstOrThrowArgsSchema: z.ZodType<Omit<Prisma.LessonPlanFindFirstOrThrowArgs, "select">> = z.object({
  where: LessonPlanWhereInputSchema.optional(), 
  orderBy: z.union([ LessonPlanOrderByWithRelationInputSchema.array(), LessonPlanOrderByWithRelationInputSchema ]).optional(),
  cursor: LessonPlanWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ LessonPlanScalarFieldEnumSchema, LessonPlanScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const LessonPlanFindManyArgsSchema: z.ZodType<Omit<Prisma.LessonPlanFindManyArgs, "select">> = z.object({
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

export const LessonPlanFindUniqueArgsSchema: z.ZodType<Omit<Prisma.LessonPlanFindUniqueArgs, "select">> = z.object({
  where: LessonPlanWhereUniqueInputSchema, 
}).strict();

export const LessonPlanFindUniqueOrThrowArgsSchema: z.ZodType<Omit<Prisma.LessonPlanFindUniqueOrThrowArgs, "select">> = z.object({
  where: LessonPlanWhereUniqueInputSchema, 
}).strict();

export const LessonPlanCreateArgsSchema: z.ZodType<Omit<Prisma.LessonPlanCreateArgs, "select">> = z.object({
  data: z.union([ LessonPlanCreateInputSchema, LessonPlanUncheckedCreateInputSchema ]),
}).strict();

export const LessonPlanUpsertArgsSchema: z.ZodType<Omit<Prisma.LessonPlanUpsertArgs, "select">> = z.object({
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

export const LessonPlanDeleteArgsSchema: z.ZodType<Omit<Prisma.LessonPlanDeleteArgs, "select">> = z.object({
  where: LessonPlanWhereUniqueInputSchema, 
}).strict();

export const LessonPlanUpdateArgsSchema: z.ZodType<Omit<Prisma.LessonPlanUpdateArgs, "select">> = z.object({
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