import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // Алиас из экспорта Figma Make — компоненты могут им пользоваться.
    alias: { "@": path.resolve(__dirname, "./src") },
  },
  server: { port: 5173 },
  build: { outDir: "dist", sourcemap: false },
});
