import { config } from "dotenv";
import { defineConfig } from "prisma/config";
import { createDbConnectUrl } from "./src/db/helpers";

config();

export default defineConfig({
  schema: "src/db/prisma/schema.prisma",
  migrations: {
    path: "src/db/prisma/migrations",
  },
  datasource: {
    url: createDbConnectUrl(),
  },
});
