/**
 * Адрес, под которым лежит лендинг.
 *
 * На Vercel — корень домена ("/"), на сайте Казахтелекома — подпапка
 * ("/perfluence/", https://telecom.kz/perfluence). Задаётся при сборке:
 * `npm run build` собирает под корень, `npm run build:telecom` — под
 * подпапку (vite --base). Код читает значение из Vite и сам ничего не знает
 * о конкретном адресе: если КТ выдаст другой, достаточно пересобрать.
 *
 * Абсолютные пути вида "/hero.jpg" в подпапке не работают: браузер ищет
 * их в корне telecom.kz. Поэтому всё, что ссылается на файлы и страницы
 * лендинга из кода, идёт через withBase(). Пути в CSS (url(...)) Vite
 * переписывает сам.
 */
export const BASE = import.meta.env.BASE_URL;

/** Путь внутри лендинга с учётом префикса: "/privacy" → "/perfluence/privacy". */
export function withBase(path: string): string {
  return BASE + path.replace(/^\//, "");
}

/** basename для маршрутизатора: тот же префикс без завершающего слэша. */
export const ROUTER_BASENAME = BASE.replace(/\/$/, "") || "/";

/** Путь страницы без префикса — для разбора /d/КОД. */
export function pathWithinBase(pathname: string = window.location.pathname): string {
  return pathname.startsWith(BASE) ? "/" + pathname.slice(BASE.length) : pathname;
}
