/**
 * Адрес, под которым лежит лендинг.
 *
 * На Vercel — корень домена ("/"). На сайте Казахтелекома — подпапка,
 * и какая именно, заранее не известно: папку сначала кладут на тестовый
 * стенд, потом на telecom.kz, и человек, который это делает, инструкций не
 * читает. Поэтому сборка для КТ (`npm run build:telecom`) — с относительными
 * путями (vite --base ./) и работает из любой папки без пересборки.
 *
 * В относительной сборке Vite отдаёт BASE_URL как "./", а маршрутизатору и
 * ссылкам нужен настоящий путь. Его даёт адрес самого скрипта: он всегда
 * лежит в assets/, значит папка лендинга — на уровень выше.
 *
 * Абсолютные пути вида "/hero.jpg" в подпапке не работают: браузер ищет
 * их в корне сайта. Поэтому всё, что ссылается на файлы лендинга из кода,
 * идёт через withBase(). Пути в CSS (url(...)) Vite переписывает сам.
 */
function detectBase(): string {
  const base = import.meta.env.BASE_URL;
  if (base.startsWith("/")) return base;
  return new URL("../", import.meta.url).pathname;
}

export const BASE = detectBase();

/** Путь внутри лендинга с учётом папки: "/hero.jpg" → "/perfluence/hero.jpg". */
export function withBase(path: string): string {
  return BASE + path.replace(/^\//, "");
}

/** basename для маршрутизатора: тот же путь без завершающего слэша. */
export const ROUTER_BASENAME = BASE.replace(/\/$/, "") || "/";

/** Путь страницы без папки — для разбора /d/КОД. */
export function pathWithinBase(pathname: string = window.location.pathname): string {
  return pathname.startsWith(BASE) ? "/" + pathname.slice(BASE.length) : pathname;
}
