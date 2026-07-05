import { faker } from '@faker-js/faker';
import type { Prisma } from '../../db/prisma/generated/client';

export const buildMockLessonPlan = (overrides?: Partial<Prisma.LessonPlanUncheckedCreateInput>): Prisma.LessonPlanUncheckedCreateInput => ({
  id: faker.string.uuid(),
  topic: faker.lorem.words(),
  unit: faker.lorem.word(),
  frame: 'PLENARY',
  ageGroup: 'THREE_TO_FOUR',
  superGoal: faker.lorem.sentence(),
  operativeGoals: [faker.lorem.sentence()],
  priorKnowledge: faker.lorem.sentence(),
  lessonFlow: [{ stage: "Intro", durationMinutes: 10, description: "Detailed test description" }],
  authorId: faker.string.uuid(),
  teachingAids: [],
  references: [],
  ...overrides,
});