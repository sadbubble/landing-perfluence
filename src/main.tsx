import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Privacy from "./pages/Privacy";
import { ROUTER_BASENAME } from "./lib/base";
import "./index.css";


/**
 * Роуты.
 *
 * /d/:dealerCode — персональная ссылка дилера (ТЗ п.5). Показывает тот же
 * лендинг: код читается из адреса и уходит в заявку автоматически, клиент
 * никакого дилера не выбирает.
 *
 * Важно: на хостинге должен быть SPA-rewrite всех путей на index.html,
 * иначе /d/AG-K7F21 вернёт 404. Для Vercel это настроено в vercel.json,
 * для telecom.kz — в README выгрузки (C:\work\perfluence-telecom-kz).
 *
 * basename — префикс адреса: "/" на Vercel, "/perfluence" на telecom.kz
 * (см. lib/base.ts). Без него маршрутизатор принял бы /perfluence за
 * неизвестный адрес и по правилу «*» увёл бы на "/" — на главную
 * страницу Казахтелекома.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/d/:dealerCode" element={<Landing />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
