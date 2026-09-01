import * as XLSX from "xlsx";
import { formatPhone } from "./phone";

/**
 * Выгрузка для руководства (ТЗ п.7).
 * Книга из двух листов: подробные заявки и итоги по дилерам за месяц —
 * именно по второму листу считаются результаты сотрудников и формируется АВР.
 */

export type LeadReportRow = {
  lead_date: string;
  dealer_name: string;
  dealer_code: string | null;
  client_phone: string;
  client_name: string;
  client_address: string;
  tariff_name: string | null;
  connected_at: string | null;
  status_label: string;
  utm_source: string | null;
  manager_note: string | null;
};

export type DealerMonthlyRow = {
  dealer_code: string;
  dealer_name: string;
  leads_total: number;
  sales: number;
  refused: number;
  no_answer: number;
  duplicates: number;
  in_work: number;
  conversion_pct: number | null;
};

export function exportLeadsWorkbook(
  leads: LeadReportRow[],
  summary: DealerMonthlyRow[],
  periodLabel: string,
): void {
  const wb = XLSX.utils.book_new();

  // --- Лист 1: заявки. Поля ровно по ТЗ п.7 -------------------------------
  const leadsSheet = XLSX.utils.json_to_sheet(
    leads.map((r) => ({
      "Дата заявки": r.lead_date,
      "Дилер": r.dealer_name,
      "Код дилера": r.dealer_code ?? "—",
      "Телефон клиента": formatPhone(r.client_phone),
      "ФИО клиента": r.client_name,
      "Адрес подключения": r.client_address,
      "Тариф": r.tariff_name ?? "—",
      "Дата подключения": r.connected_at ?? "",
      "Статус": r.status_label,
      "Источник": r.utm_source ?? "",
      "Комментарий менеджера": r.manager_note ?? "",
    })),
  );
  leadsSheet["!cols"] = [
    { wch: 12 }, { wch: 24 }, { wch: 12 }, { wch: 18 }, { wch: 26 },
    { wch: 40 }, { wch: 20 }, { wch: 16 }, { wch: 12 }, { wch: 14 }, { wch: 30 },
  ];
  leadsSheet["!autofilter"] = { ref: leadsSheet["!ref"] as string };
  XLSX.utils.book_append_sheet(wb, leadsSheet, "Заявки");

  // --- Лист 2: итоги по дилерам -------------------------------------------
  const summarySheet = XLSX.utils.json_to_sheet(
    summary.map((r) => ({
      "Дилер": r.dealer_name,
      "Код": r.dealer_code,
      "Всего заявок": r.leads_total,
      "Продажи": r.sales,
      "Отказы": r.refused,
      "Недозвон": r.no_answer,
      "Дубликаты": r.duplicates,
      "В работе": r.in_work,
      "Конверсия, %": r.conversion_pct ?? 0,
    })),
  );
  summarySheet["!cols"] = [
    { wch: 26 }, { wch: 12 }, { wch: 14 }, { wch: 10 },
    { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 14 },
  ];
  XLSX.utils.book_append_sheet(wb, summarySheet, "Итоги по дилерам");

  XLSX.writeFile(wb, `Perfluence_заявки_${periodLabel}.xlsx`);
}
