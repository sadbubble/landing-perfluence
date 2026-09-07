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
  server: {
    port: 8080,
    /*
     * strictPort обязателен, а не для порядка.
     *
     * Без него Vite при занятом 8080 молча берёт 8081 — и встроенная форма
     * Qbox перестаёт открываться окном, потому что 8081 в их списке
     * доверенных доменов нет. Сайт при этом работает, кнопки нажимаются,
     * ошибок нет: просто форма вдруг уводит на чужую страницу вместо того
     * чтобы открыться на месте. Искать причину в такой ситуации долго.
     *
     * Теперь Vite честно откажется стартовать и назовёт занятый порт.
     */
    strictPort: true,
  },
  build: { outDir: "dist", sourcemap: false },
});
