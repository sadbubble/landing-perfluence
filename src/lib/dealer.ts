/**
 * Определение дилера, по чьей ссылке пришёл посетитель.
 *
 * Ссылка из ТЗ п.5:  https://partner.telecom.kz/d/AG-K7F21
 * Дополнительно поддерживаются ?ref=CODE и ?d=CODE — блогеры часто
 * пересобирают ссылки в своих сервисах сокращения и теряют путь.
 *
 * Код кладётся в sessionStorage: посетитель может уйти на /privacy и
 * вернуться, и атрибуция при этом не должна теряться.
 */

const STORAGE_KEY = "perfluence.dealer_code";

export type Attribution = {
  dealerCode: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
};

/** Коды выдаются в верхнем регистре; ссылку могли набрать строчными. */
function clean(code: string | null | undefined): string | null {
  if (!code) return null;
  const c = code.trim().toUpperCase().slice(0, 64);
  return /^[A-Z0-9-]{2,}$/.test(c) ? c : null;
}

/**
 * Читает атрибуцию из текущего URL, запоминает код дилера и возвращает его.
 * Вызывать один раз при старте приложения.
 */
export function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);

  // /d/AG-K7F21 — основной формат
  const fromPath = window.location.pathname.match(/^\/d\/([^/?#]+)/i)?.[1] ?? null;
  const fromQuery = params.get("ref") ?? params.get("d");

  const code = clean(fromPath) ?? clean(fromQuery) ?? readStored();

  if (code) {
    try {
      sessionStorage.setItem(STORAGE_KEY, code);
    } catch {
      // приватный режим браузера — не критично, код останется в памяти страницы
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
    return clean(sessionStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

/** Собрать персональную ссылку дилера — используется в админке. */
export function buildDealerLink(code: string, origin = window.location.origin): string {
  return `${origin}/d/${code}`;
}

/**
 * Генератор кода в формате из ТЗ: XX-XXXXX.
 * Алфавит без 0/O/1/I/L — коды диктуют по телефону и переписывают с бумаги.
 */
export function generateDealerCode(): string {
  const A = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const pick = (n: number) =>
    Array.from({ length: n }, () => A[Math.floor(Math.random() * A.length)]).join("");
  return `${pick(2)}-${pick(5)}`;
}
