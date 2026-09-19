import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Use BASE_PATH env var if set, otherwise default to '/'
const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: basePath,
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
});
