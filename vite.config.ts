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
  /*
   * Порт 8080, а не 5173, и это не вкусовщина.
   *
   * Форма Qbox встраивается в страницу рамкой, а её сервер отдаёт заголовок
   * Content-Security-Policy со списком разрешённых доменов (frame-ancestors).
   * Из этого списка для локальной разработки годятся только 4200, 4502 и 8080 —
   * на 5173 рамка блокируется, и встроенную форму не проверить вообще.
   *
   * Боевой домен из ТЗ п.5, https://partner.telecom.kz, в том списке уже есть.
   */
  server: { port: 8080 },
  build: { outDir: "dist", sourcemap: false },
});
