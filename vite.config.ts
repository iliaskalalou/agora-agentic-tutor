import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Front-end build is emitted to dist/public and served by the Express server in
// production. In development, Vite proxies API and SSE traffic to the Node server.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
    sourcemap: false,
  },
  server: {
    port: 5173,
    proxy: {
      "/api": "http://localhost:3000",
      "/events": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },
});
