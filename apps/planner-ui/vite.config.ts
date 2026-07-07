import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    commonjsOptions: {
      include: [
        /node_modules/,
        /apps\/planner-manager\/src\/db\/prisma\/generated/,
      ],
    },
  },
  optimizeDeps: {
    include: ["@repo/types"],
  },
  server: {
    port: 3000,
    proxy: {
      // Any request starting with /api will be forwarded to your backend
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
