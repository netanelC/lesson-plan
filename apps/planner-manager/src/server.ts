import { buildApp } from "./app";
import config from "config";

const start = async () => {
  const app = buildApp();
  const PORT = config.get<number>("server.port");

  try {
    await app.listen({ port: PORT, host: "0.0.0.0" });
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
