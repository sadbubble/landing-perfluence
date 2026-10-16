/**
 * Определение менеджера (дилера/блогера), по чьей ссылке пришёл посетитель.
 *
 * Основной формат задан ТЗ «Передача менеджера и тарифа»:
 *
 *     https://telecom.kz/perfluence/?manager=anna
 *
 * Дополнительно понимаются ?ref=CODE и ?d=CODE: блогеры пересобирают
 * ссылки в своих сервисах и переименовывают параметр.
 *
 * Формата /d/КОД из исходного ТЗ п.5 больше нет (решение заказчика, октябрь
 * 2026): он требовал, чтобы сервер отдавал index.html на любой адрес, а
 * лендинг выкладывают в папку без всякой настройки сервера.
 */

import { BASE } from "./base";

/** Ключ менеджера в адресе: ?manager=anna. Задан ТЗ. */
const URL_KEY = "manager";

/**
 * Ключ хранения в localStorage.
 *
 * ТЗ «Передача менеджера и тарифа» предлагает хранить под тем же именем,
 * что и в адресе, — «manager». Но на telecom.kz localStorage общий для
 * всего сайта Казахтелекома, и голое «manager» могло совпасть с их
 * собственным ключом: тогда заявка ушла бы с чужим значением. Поэтому с
 * приставкой — решение заказчика (октябрь 2026). Ключ в адресе прежний.
 */
const STORAGE_KEY = "perfluence.manager";

/** Ключ прежней версии. Читается, чтобы не потерять уже привязанных людей. */
const LEGACY_KEY = "perfluence.dealer_code";

export type Attribution = {
  dealerCode: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

/**
 * Проверка кода менеджера.
 *
 * Регистр НЕ меняется. Раньше здесь стоял `toUpperCase()` — под коды вида
 * `AG-K7F21` из ТЗ п.5. Но коды менеджеров в Qbox строчные (`anna`, `test`),
 * и тестовая заявка распозналась именно как `test`. Приведи мы её к `TEST` —
 * менеджер в CRM не нашёлся бы. Поэтому код уходит ровно таким, каким его
 * дали, а сверка регистра остаётся на стороне Qbox.
 */
function clean(code: string | null | undefined): string | null {
  if (!code) return null;
  const c = code.trim().slice(0, 64);
  return /^[A-Za-z0-9_-]{2,}$/.test(c) ? c : null;
}

/**
 * Читает менеджера из адреса, запоминает и возвращает.
 * Вызывать один раз при старте приложения.
 */
export function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);

  const fromManager = params.get(URL_KEY);
  const fromQuery = params.get("ref") ?? params.get("d");

  const fromUrl = clean(fromManager) ?? clean(fromQuery);

  /*
   * Если в адресе менеджера нет — сохранённого НЕ трогаем. Так велит ТЗ, и
   * смысл в этом есть: человек мог прийти по ссылке блогера, уйти, а потом
   * вернуться уже без параметра — привязка при этом теряться не должна.
   *
   * Обратная сторона: хранение в localStorage не истекает никогда, и пришедший
   * по ссылке одного менеджера остаётся за ним, пока не придёт по ссылке
   * другого. Это решение заказчика, а не наша забывчивость.
   */
  const code = fromUrl ?? readStored();

  if (fromUrl) {
    try {
      localStorage.setItem(STORAGE_KEY, fromUrl);
    } catch {
      // приватный режим браузера — код останется в памяти страницы
    }
  }

  return {
    dealerCode: code,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
  };
}

export function readStored(): string | null {
  try {
    // sessionStorage читается ради тех, кто уже открыл страницу до перехода
    // на localStorage: их привязка иначе пропала бы посреди сессии.
    return (
      clean(localStorage.getItem(STORAGE_KEY)) ??
      clean(sessionStorage.getItem(LEGACY_KEY))
    );
  } catch {
    return null;
  }
}

/** Собрать персональную ссылку менеджера. */
export function buildDealerLink(code: string, origin = window.location.origin): string {
  return `${origin}${BASE}?${URL_KEY}=${encodeURIComponent(code)}`;
}

/**
 * Генератор кода в формате из ТЗ п.5: XX-XXXXX.
 * Алфавит без 0/O/1/I/L — коды диктуют по телефону и переписывают с бумаги.
 */
export function generateDealerCode(): string {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const pick = (n: number) =>
    Array.from({ length: n }, () => A[Math.floor(Math.random() * A.length)]).join("");
  return `${pick(2)}-${pick(5)}`;
}
