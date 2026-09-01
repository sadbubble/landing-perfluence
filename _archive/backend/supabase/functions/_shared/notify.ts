/**
 * Уведомления о новой заявке.
 *
 * Сейчас по решению заказчика выключены. Включаются БЕЗ правки кода —
 * достаточно задать секреты в Supabase (Settings → Edge Functions → Secrets):
 *
 *   Telegram:  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
 *   Вебхук:    LEAD_WEBHOOK_URL          (любой приёмник: n8n, CRM, Make)
 *
 * Правило: уведомление никогда не должно ронять приём заявки. Любая ошибка
 * здесь только логируется — клиент всё равно получает «спасибо».
 */

export type LeadNotification = {
  id: string;
  phone: string;
  fullName: string;
  address: string;
  tariffName: string | null;
  dealerName: string | null;
  dealerCode: string | null;
  isDuplicate: boolean;
};

export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  await Promise.allSettled([sendTelegram(lead), sendWebhook(lead)]);
}

async function sendTelegram(lead: LeadNotification): Promise<void> {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return; // не настроено — молча пропускаем

  const lines = [
    lead.isDuplicate ? "♻️ <b>Повторная заявка</b>" : "🔔 <b>Новая заявка</b>",
    "",
    `📞 <b>${escapeHtml(lead.phone)}</b>`,
    `👤 ${escapeHtml(lead.fullName)}`,
    `📍 ${escapeHtml(lead.address)}`,
    lead.tariffName ? `📦 ${escapeHtml(lead.tariffName)}` : null,
    lead.dealerName
      ? `🤝 ${escapeHtml(lead.dealerName)} (${escapeHtml(lead.dealerCode ?? "—")})`
      : `🤝 дилер не определён${lead.dealerCode ? ` (код в ссылке: ${escapeHtml(lead.dealerCode)})` : ""}`,
  ].filter(Boolean);

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: lines.join("\n"),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });
    if (!res.ok) console.error("Telegram вернул ошибку:", res.status, await res.text());
  } catch (e) {
    console.error("Не удалось отправить в Telegram:", e);
  }
}

async function sendWebhook(lead: LeadNotification): Promise<void> {
  const url = Deno.env.get("LEAD_WEBHOOK_URL");
  if (!url) return;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
    });
    if (!res.ok) console.error("Вебхук вернул ошибку:", res.status);
  } catch (e) {
    console.error("Не удалось вызвать вебхук:", e);
  }
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
