/**
 * Определение менеджера (дилера/блогера), по чьей ссылке пришёл посетитель.
 *
 * Основной формат задан ТЗ «Передача менеджера и тарифа»:
 *
 *     https://partner.telecom.kz/?manager=anna
 *
 * Дополнительно поддерживаются форматы из исходного ТЗ п.5 и сокращалок:
 *
 *     /d/AG-K7F21      путь из ТЗ п.5
 *     ?ref=CODE        блогеры пересобирают ссылки в своих сервисах
 *     ?d=CODE          и теряют путь
 *
 * ВНИМАНИЕ: путь `/d/КОД` требует, чтобы сервер отдавал index.html на любой
 * адрес. На Vercel это задано в vercel.json, а на сервере Казахтелекома
 * придётся настраивать отдельно. Формат `?manager=` работает без всякой
 * серверной настройки — на первом этапе он надёжнее.
 */

/** Ключ хранения. Совпадает с ключом в адресе — так велит ТЗ. */
const STORAGE_KEY = "manager";

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

  const fromManager = params.get(STORAGE_KEY);
  const fromPath = window.location.pathname.match(/^\/d\/([^/?#]+)/i)?.[1] ?? null;
  const fromQuery = params.get("ref") ?? params.get("d");

  const fromUrl = clean(fromManager) ?? clean(fromPath) ?? clean(fromQuery);

  /*
   * Если в адресе менеджера нет — сохранённого НЕ трогаем. Так велит ТЗ, и
   * смысл в этом есть: человек мог прийти по ссылке блогера, уйти читать
   * политику, вернуться уже без параметра — привязка при этом теряться не
   * должна.
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
  return `${origin}/?${STORAGE_KEY}=${encodeURIComponent(code)}`;
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
