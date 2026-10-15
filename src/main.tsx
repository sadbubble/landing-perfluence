import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./pages/Landing";
import { ROUTER_BASENAME } from "./lib/base";
import "./index.css";


/**
 * Роуты.
 *
 * /d/:dealerCode — персональная ссылка дилера (ТЗ п.5). Показывает тот же
 * лендинг: код читается из адреса и уходит в заявку автоматически, клиент
 * никакого дилера не выбирает.
 *
 * Только там, где сервер отдаёт index.html на любой путь (SPA-rewrite):
 * на Vercel это настроено в vercel.json. Сборка для telecom.kz кладётся в
 * папку без всякой настройки сервера и с относительными путями, поэтому
 * там /d/КОД не работает — менеджерам раздаются ссылки ?manager=КОД.
 *
 * basename — папка лендинга: "/" на Vercel, "/perfluence" (или любая
 * другая) на сайте КТ, см. lib/base.ts. Без него маршрутизатор принял бы
 * папку за неизвестный адрес и по правилу «*» увёл бы на "/" — на главную
 * страницу сайта.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={ROUTER_BASENAME}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/d/:dealerCode" element={<Landing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
