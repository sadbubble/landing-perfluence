import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Privacy from "./pages/Privacy";
import "./index.css";


/**
 * Роуты.
 *
 * /d/:dealerCode — персональная ссылка дилера (ТЗ п.5). Показывает тот же
 * лендинг: код читается из адреса и уходит в заявку автоматически, клиент
 * никакого дилера не выбирает.
 *
 * Важно: на хостинге должен быть SPA-rewrite всех путей на index.html,
 * иначе /d/AG-K7F21 вернёт 404. Для Vercel это настроено в vercel.json.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/d/:dealerCode" element={<Landing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
