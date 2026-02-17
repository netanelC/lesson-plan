import config from "config";
import { buildApp } from "./app";

const PORT = config.get<number>("server.port");

const start = async (): Promise<void> => {
  const app = buildApp();
  await app.listen({ port: PORT, host: "0.0.0.0" });
};

void start()
  .then(() => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
