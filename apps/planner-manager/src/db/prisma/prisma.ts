import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { createDbConnectUrl } from "../helpers";
import { PrismaClient } from "./generated/client";

const connectionString = createDbConnectUrl();

// 1. Initialize the native pg connection pool with strict limits
const pool = new Pool({
  connectionString,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Fail fast: timeout after 2 seconds if a connection cannot be established
});

// 2. Bind the pool to the Prisma adapter
const adapter = new PrismaPg(pool);

// 3. Instantiate the Prisma Client with conditional logging based on the environment
const prisma = new PrismaClient({
  adapter,
  log:
    process.env.NODE_ENV === "production"
      ? ["error"]
      : ["query", "error", "warn"],
});

export { prisma };
