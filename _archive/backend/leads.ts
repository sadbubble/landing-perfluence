import { supabase } from "./supabase";
import type { LeadReportRow, DealerMonthlyRow } from "./export";

export const LEAD_STATUSES = [
  "new",
  "in_progress",
  "sale",
  "refused",
  "no_answer",
  "duplicate",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Новая",
  in_progress: "В работе",
  sale: "Продажа",
  refused: "Отказ",
  no_answer: "Недозвон",
  duplicate: "Дубликат",
};

export type LeadRow = {
  id: string;
  created_at: string;
  phone: string;
  full_name: string;
  address: string;
  comment: string | null;
  status: LeadStatus;
  connected_at: string | null;
  manager_note: string | null;
  dealer_code_raw: string | null;
  dealers: { code: string; full_name: string } | null;
  tariffs: { slug: string; name_ru: string } | null;
};

export type LeadFilters = {
  from?: string;        // YYYY-MM-DD включительно
  to?: string;          // YYYY-MM-DD включительно
  status?: LeadStatus | "";
  dealerId?: string;
  search?: string;      // поиск по телефону или ФИО
};

export type Dealer = {
  id: string;
  code: string;
  full_name: string;
  phone: string | null;
  channel: string | null;
  is_active: boolean;
  created_at: string;
};

/** Конец дня включительно: пользователь выбирает дату, а не момент времени. */
function endOfDay(date: string): string {
  return `${date}T23:59:59.999`;
}

export async function fetchLeads(filters: LeadFilters, limit = 500): Promise<LeadRow[]> {
  let q = supabase
    .from("leads")
    .select(
      "id, created_at, phone, full_name, address, comment, status, connected_at, manager_note, dealer_code_raw, dealers(code, full_name), tariffs(slug, name_ru)",
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (filters.from) q = q.gte("created_at", filters.from);
  if (filters.to) q = q.lte("created_at", endOfDay(filters.to));
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.dealerId) q = q.eq("dealer_id", filters.dealerId);
  if (filters.search) {
    const s = filters.search.trim();
    // Телефон в базе только в виде +7XXXXXXXXXX, поэтому по нему ищем
    // по фрагменту цифр, а по имени — по подстроке без учёта регистра.
    const digits = s.replace(/\D/g, "");
    q = digits.length >= 3
      ? q.or(`phone.ilike.%${digits}%,full_name.ilike.%${s}%`)
      : q.ilike("full_name", `%${s}%`);
  }

  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as LeadRow[];
}

export async function updateLead(
  id: string,
  patch: { status?: LeadStatus; connected_at?: string | null; manager_note?: string | null },
): Promise<void> {
  const { error } = await supabase
    .from("leads")
    .update({ ...patch, processed_by: (await supabase.auth.getUser()).data.user?.id })
    .eq("id", id);
  if (error) throw error;
}

export async function fetchDealers(): Promise<Dealer[]> {
  const { data, error } = await supabase
    .from("dealers")
    .select("*")
    .order("full_name");
  if (error) throw error;
  return (data ?? []) as Dealer[];
}

export async function createDealer(d: {
  code: string;
  full_name: string;
  phone?: string | null;
  channel?: string | null;
}): Promise<void> {
  const { error } = await supabase.from("dealers").insert(d);
  if (error) throw error;
}

export async function setDealerActive(id: string, is_active: boolean): Promise<void> {
  const { error } = await supabase.from("dealers").update({ is_active }).eq("id", id);
  if (error) throw error;
}

/** Данные для выгрузки — берутся из витрин, а не собираются на клиенте. */
export async function fetchReport(
  from: string,
  to: string,
): Promise<{ leads: LeadReportRow[]; summary: DealerMonthlyRow[] }> {
  const [leadsRes, summaryRes] = await Promise.all([
    supabase
      .from("v_leads_report")
      .select("*")
      .gte("created_at", from)
      .lte("created_at", endOfDay(to))
      .order("created_at", { ascending: false }),
    // month в витрине — первое число месяца по времени Алматы,
    // поэтому сравниваем с началом периода напрямую.
    supabase
      .from("v_dealer_monthly")
      .select("*")
      .eq("month", from)
      .order("sales", { ascending: false }),
  ]);

  if (leadsRes.error) throw leadsRes.error;
  if (summaryRes.error) throw summaryRes.error;

  return {
    leads: (leadsRes.data ?? []) as unknown as LeadReportRow[],
    summary: (summaryRes.data ?? []) as unknown as DealerMonthlyRow[],
  };
}
