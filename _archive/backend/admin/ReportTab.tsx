import { useCallback, useEffect, useState } from "react";
import { fetchReport } from "../../lib/leads";
import { exportLeadsWorkbook, type DealerMonthlyRow, type LeadReportRow } from "../../lib/export";

/**
 * Отчёт для руководства (ТЗ п.7): результат каждого дилера за месяц
 * и выгрузка в Excel для расчёта результатов сотрудников и АВР.
 */
const currentMonth = () => new Date().toISOString().slice(0, 7); // YYYY-MM

/** Последний день месяца: 0-й день следующего месяца. */
function monthRange(month: string): { from: string; to: string } {
  const [y, m] = month.split("-").map(Number);
  const last = new Date(y, m, 0).getDate();
  return { from: `${month}-01`, to: `${month}-${String(last).padStart(2, "0")}` };
}

export default function ReportTab() {
  const [month, setMonth] = useState(currentMonth());
  const [leads, setLeads] = useState<LeadReportRow[]>([]);
  const [summary, setSummary] = useState<DealerMonthlyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (m: string) => {
    setLoading(true);
    setError(null);
    try {
      const { from, to } = monthRange(m);
      const data = await fetchReport(from, to);
      setLeads(data.leads);
      setSummary(data.summary);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось построить отчёт");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(month);
  }, [month, load]);

  const totals = summary.reduce(
    (a, r) => ({ leads: a.leads + r.leads_total, sales: a.sales + r.sales }),
    { leads: 0, sales: 0 },
  );

  return (
    <>
      <div className="card">
        <div className="filters">
          <div className="field">
            <label htmlFor="r-month">Отчётный месяц</label>
            <input id="r-month" type="month" value={month}
              onChange={(e) => setMonth(e.target.value)} />
          </div>
          <button
            className="btn"
            disabled={loading || leads.length === 0}
            onClick={() => exportLeadsWorkbook(leads, summary, month)}
          >
            Выгрузить в Excel
          </button>
          <span className="muted" style={{ fontSize: 13 }}>
            Два листа: подробные заявки и итоги по дилерам
          </span>
        </div>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="stats">
        <div className="stat"><b>{totals.leads}</b><span>заявок за месяц</span></div>
        <div className="stat"><b>{totals.sales}</b><span>подтверждённых продаж</span></div>
        <div className="stat"><b>{summary.length}</b><span>дилеров с заявками</span></div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <p className="empty">Считаем…</p>
        ) : summary.length === 0 ? (
          <p className="empty">За этот месяц заявок не было</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Дилер</th>
                  <th className="nowrap">Код</th>
                  <th className="nowrap">Всего заявок</th>
                  <th className="nowrap">Продажи</th>
                  <th className="nowrap">Отказы</th>
                  <th className="nowrap">Недозвон</th>
                  <th className="nowrap">Дубликаты</th>
                  <th className="nowrap">В работе</th>
                  <th className="nowrap">Конверсия</th>
                </tr>
              </thead>
              <tbody>
                {summary.map((r) => (
                  <tr key={r.dealer_code + r.dealer_name}>
                    <td>{r.dealer_name}</td>
                    <td className="nowrap"><code>{r.dealer_code}</code></td>
                    <td>{r.leads_total}</td>
                    <td><b>{r.sales}</b></td>
                    <td>{r.refused}</td>
                    <td>{r.no_answer}</td>
                    <td>{r.duplicates}</td>
                    <td>{r.in_work}</td>
                    <td>{r.conversion_pct ?? 0}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="muted" style={{ fontSize: 13 }}>
        Конверсия считается от заявок без дубликатов: повторное обращение
        того же клиента не должно ни улучшать, ни ухудшать результат дилера.
      </p>
    </>
  );
}
