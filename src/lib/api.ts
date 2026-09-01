import { SUBMIT_LEAD_URL, assertSupabaseConfigured } from "./config";
import { readStored } from "./dealer";
import type { Attribution } from "./dealer";

/** Версия текста согласия. Меняется вместе с текстом на /privacy. */
export const CONSENT_VERSION = "v1";

export type LeadFormData = {
  phone: string;
  fullName: string;
  address: string;
  tariffSlug: string | null;
  comment?: string;
  consent: boolean;
  /** Скрытая ловушка для ботов. Человек это поле не видит и не заполняет. */
  company?: string;
};

/**
 * Отправка заявки. Идёт в Edge Function, а не прямым insert:
 * там валидация, антиспам, дедуп и резолв дилера.
 */
export async function submitLead(
  form: LeadFormData,
  attribution: Attribution,
  lang: "ru" | "kk",
): Promise<void> {
  // Падаем здесь, а не при загрузке страницы: без бэкенда лендинг всё равно
  // должен открываться, а форма — честно сообщать об ошибке отправки.
  assertSupabaseConfigured();

  const res = await fetch(SUBMIT_LEAD_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: form.phone,
      full_name: form.fullName,
      address: form.address,
      tariff_slug: form.tariffSlug,
      comment: form.comment ?? null,
      consent: form.consent,
      consent_version: CONSENT_VERSION,
      company: form.company ?? "",
      // Код дилера берём из атрибуции, а если её потеряли при навигации —
      // из sessionStorage. Пользователь дилера не выбирает и не видит (ТЗ п.5).
      dealer_code: attribution.dealerCode ?? readStored(),
      utm_source: attribution.utmSource,
      utm_medium: attribution.utmMedium,
      utm_campaign: attribution.utmCampaign,
      lang,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `submit_failed_${res.status}`);
  }
}
