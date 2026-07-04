import { beforeAll, afterAll } from "vitest";
import { prisma } from "../db/prisma/prisma";
import { clearDb } from "./helpers";

beforeAll(async () => {
  await clearDb();
});

afterAll(async () => {
  await prisma.$disconnect();
});
