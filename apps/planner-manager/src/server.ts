import * as dotenv from "dotenv";
import { buildApp } from "./app.js"; // Note the .js extension! Required in ESM

// 1. Load environment variables (.env file)
dotenv.config();

const start = async () => {
  const app = buildApp();
  const PORT = Number(process.env.PORT) || 3000;

  try {
    await app.listen({ port: PORT });
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
