import { faker } from '@faker-js/faker';
import type { Prisma } from '../../db/prisma/generated/client';

export const buildMockUser = (overrides?: Partial<Prisma.UserUncheckedCreateInput>): Prisma.UserUncheckedCreateInput => ({
  id: faker.string.uuid(),
  email: faker.internet.email(),
  fullName: faker.person.fullName(),
  role: 'KINDERGARTEN',
  passwordHash: faker.internet.password(),
  ...overrides,
});