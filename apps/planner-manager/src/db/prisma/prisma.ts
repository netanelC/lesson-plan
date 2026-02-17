import { PrismaPg } from "@prisma/adapter-pg";
import { createDbConnectUrl } from "../helpers";
import { PrismaClient } from "./generated/client";

const connectionString = createDbConnectUrl();

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export { prisma };
