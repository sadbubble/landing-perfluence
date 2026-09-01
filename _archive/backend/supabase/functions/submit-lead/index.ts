/**
 * submit-lead — единственная точка приёма заявки с лендинга.
 *
 * Почему не прямой insert с anon-ключом: anon-ключ публичен, прямая запись
 * открыла бы спам в таблицу с персональными данными и не дала бы серверной
 * валидации. Здесь же — валидация, антиспам, дедуп, резолв дилера и
 * единственное место, куда подключаются уведомления.
 *
 * Деплой:  supabase functions deploy submit-lead --no-verify-jwt
 * (--no-verify-jwt обязателен: форму заполняет неавторизованный посетитель)
 */
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { normalizePhone } from "../_shared/phone.ts";
import { corsHeaders, isOriginAllowed } from "../_shared/cors.ts";
import { notifyNewLead } from "../_shared/notify.ts";

/** Не больше стольких заявок с одного IP за окно ниже. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MIN = 10;
/** Тот же телефон в этом окне считается дубликатом (ТЗ п.7). */
const DEDUP_WINDOW_HOURS = 24;

const MAX = { phone: 32, fullName: 200, address: 500, comment: 1000, code: 64 } as const;

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);

Deno.serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = corsHeaders(origin);

  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return fail(405, "method_not_allowed", cors);
  if (!isOriginAllowed(origin)) return fail(403, "origin_not_allowed", cors);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail(400, "invalid_json", cors);
  }

  // --- 1. Honeypot -----------------------------------------------------
  // Скрытое поле, невидимое человеку. Заполнено — это бот. Отвечаем 200,
  // чтобы он не понял, что отсеян, и не начал подбирать обход.
  if (str(body.company)) {
    console.log("honeypot сработал, заявка отброшена");
    return ok(cors, { ok: true });
  }

  // --- 2. Валидация ----------------------------------------------------
  const phone = normalizePhone(str(body.phone));
  if (!phone) return fail(400, "invalid_phone", cors);

  const fullName = str(body.full_name).slice(0, MAX.fullName);
  if (fullName.length < 2) return fail(400, "invalid_name", cors);

  const address = str(body.address).slice(0, MAX.address);
  if (address.length < 3) return fail(400, "invalid_address", cors);

  // Согласие на обработку ПДн — обязательное условие, без него не пишем.
  if (body.consent !== true) return fail(400, "consent_required", cors);

  const comment = str(body.comment).slice(0, MAX.comment) || null;
  const tariffSlug = str(body.tariff_slug).slice(0, MAX.code) || null;
  const dealerCodeRaw = str(body.dealer_code).slice(0, MAX.code).toUpperCase() || null;
  const pageLang = str(body.lang) === "kk" ? "kk" : "ru";

  // --- 3. Антиспам по IP ----------------------------------------------
  const ipHash = await hashIp(clientIp(req));
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MIN * 60_000).toISOString();
  const { count: recent } = await admin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if ((recent ?? 0) >= RATE_LIMIT_MAX) {
    console.warn("rate limit: ip_hash", ipHash);
    return fail(429, "too_many_requests", cors);
  }

  // --- 4. Резолв дилера ------------------------------------------------
  // Неизвестный код НЕ отклоняем: опечатка в ссылке не повод терять лид.
  // Пишем dealer_id = null и сохраняем сырой код, менеджер разберётся вручную.
  let dealerId: string | null = null;
  let dealerName: string | null = null;
  if (dealerCodeRaw) {
    const { data } = await admin
      .from("dealers")
      .select("id, full_name")
      .eq("code", dealerCodeRaw)
      .eq("is_active", true)
      .maybeSingle();
    dealerId = data?.id ?? null;
    dealerName = data?.full_name ?? null;
    if (!dealerId) console.warn("неизвестный код дилера в ссылке:", dealerCodeRaw);
  }

  // --- 5. Резолв тарифа ------------------------------------------------
  let tariffId: string | null = null;
  let tariffName: string | null = null;
  if (tariffSlug) {
    const { data } = await admin
      .from("tariffs")
      .select("id, name_ru")
      .eq("slug", tariffSlug)
      .maybeSingle();
    tariffId = data?.id ?? null;
    tariffName = data?.name_ru ?? null;
  }

  // --- 6. Дедупликация -------------------------------------------------
  const dedupSince = new Date(Date.now() - DEDUP_WINDOW_HOURS * 3_600_000).toISOString();
  const { count: samePhone } = await admin
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("phone", phone)
    .gte("created_at", dedupSince);

  const isDuplicate = (samePhone ?? 0) > 0;

  // --- 7. Запись -------------------------------------------------------
  const { data: inserted, error } = await admin
    .from("leads")
    .insert({
      phone,
      full_name: fullName,
      address,
      comment,
      dealer_id: dealerId,
      dealer_code_raw: dealerCodeRaw,
      tariff_id: tariffId,
      status: isDuplicate ? "duplicate" : "new",
      consent: true,
      consent_version: str(body.consent_version) || "v1",
      consent_at: new Date().toISOString(),
      utm_source: str(body.utm_source).slice(0, 200) || null,
      utm_medium: str(body.utm_medium).slice(0, 200) || null,
      utm_campaign: str(body.utm_campaign).slice(0, 200) || null,
      page_lang: pageLang,
      user_agent: (req.headers.get("user-agent") ?? "").slice(0, 500) || null,
      ip_hash: ipHash,
    })
    .select("id")
    .single();

  if (error) {
    console.error("не удалось записать заявку:", error);
    return fail(500, "storage_error", cors);
  }

  // --- 8. Уведомления --------------------------------------------------
  // Выключены, пока не заданы секреты. Ошибки внутри не влияют на ответ.
  await notifyNewLead({
    id: inserted.id,
    phone,
    fullName,
    address,
    tariffName,
    dealerName,
    dealerCode: dealerCodeRaw,
    isDuplicate,
  });

  // Наружу отдаём только факт успеха: ни id, ни статуса дубликата —
  // это внутренняя кухня, клиенту в любом случае показываем «спасибо».
  return ok(cors, { ok: true });
});

// ---------------------------------------------------------------------------

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd ? fwd.split(",")[0] : "").trim() || "unknown";
}

/**
 * Сам IP не храним — только соль+хеш. Этого достаточно для антиспама
 * и не создаёт лишних персональных данных в базе.
 */
async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get("IP_HASH_SALT") ?? "perfluence-default-salt";
  const bytes = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function ok(cors: Record<string, string>, payload: unknown): Response {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

function fail(status: number, code: string, cors: Record<string, string>): Response {
  return new Response(JSON.stringify({ ok: false, error: code }), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}
