/**
 * CORS. Список разрешённых источников задаётся секретом ALLOWED_ORIGINS
 * (через запятую), например:
 *   https://partner.telecom.kz,https://landing-perfluence.vercel.app
 * Если секрет не задан — режим разработки, пускаем всех, но пишем в лог.
 */
const configured = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

export function corsHeaders(origin: string | null): Record<string, string> {
  let allow = "*";

  if (configured.length > 0) {
    if (origin && configured.includes(origin)) {
      allow = origin;
    } else {
      allow = configured[0]; // источник не в списке — браузер отсечёт запрос сам
    }
  } else {
    console.warn("ALLOWED_ORIGINS не задан — CORS открыт. Задайте секрет перед продом.");
  }

  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Vary": "Origin",
  };
}

export function isOriginAllowed(origin: string | null): boolean {
  if (configured.length === 0) return true;
  return !!origin && configured.includes(origin);
}
