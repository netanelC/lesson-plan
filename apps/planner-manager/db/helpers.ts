import config from "config";
import { DBConfig } from "./types";

/**
 * Extract and build DB connection url based on configuration
 * @returns string represent connection url according: https://www.prisma.io/docs/orm/overview/databases/postgresql#3-instantiate-prisma-client-using-the-driver-adapter
 */
export function createDbConnectUrl(): string {
  const { username, password, host, database, port, schema } =
    config.get<DBConfig>("db");

  let connectionUrl = `postgresql://${username}:${password}@${host}:${port}/${database}?schema=${schema}`;

  return connectionUrl;
}
