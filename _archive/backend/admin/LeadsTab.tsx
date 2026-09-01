import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchLeads, fetchDealers, updateLead,
  LEAD_STATUSES, STATUS_LABELS,
  type LeadRow, type LeadFilters, type LeadStatus, type Dealer,
} from "../../lib/leads";
import { formatPhone } from "../../lib/phone";

const today = () => new Date().toISOString().slice(0, 10);
const monthStart = () => today().slice(0, 8) + "01";

export default function LeadsTab() {
  const [filters, setFilters] = useState<LeadFilters>({ from: monthStart(), to: today() });
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDealers().then(setDealers).catch(() => setDealers([]));
  }, []);

  const load = useCallback(async (f: LeadFilters) => {
    setLoading(true);
    setError(null);
    try {
      setLeads(await fetchLeads(f));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить заявки");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Небольшая задержка, чтобы ввод в поле поиска не бил в базу на каждую букву.
    const t = setTimeout(() => void load(filters), 300);
    return () => clearTimeout(t);
  }, [filters, load]);

  const stats = useMemo(() => {
    const by = (s: LeadStatus) => leads.filter((l) => l.status === s).length;
    return {
      total: leads.length,
      sales: by("sale"),
      inWork: by("new") + by("in_progress"),
      duplicates: by("duplicate"),
    };
  }, [leads]);

  /**
   * Оптимистично меняем строку в списке: ждать перезагрузки всей таблицы
   * ради одного селекта — лишняя пауза в работе оператора.
   */
  async function patch(id: string, p: Partial<LeadRow>) {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, ...p } : l)));
    try {
      await updateLead(id, {
        status: p.status,
        connected_at: p.connected_at,
        manager_note: p.manager_note,
      });
    } catch (e) {
      setLeads(prev); // откат, чтобы на экране не осталось несохранённое
      setError(e instanceof Error ? e.message : "Не удалось сохранить изменение");
    }
  }

  const set = (p: Partial<LeadFilters>) => setFilters((f) => ({ ...f, ...p }));

  return (
    <>
      <div className="stats">
        <div className="stat"><b>{stats.total}</b><span>заявок за период</span></div>
        <div className="stat"><b>{stats.sales}</b><span>продаж</span></div>
        <div className="stat"><b>{stats.inWork}</b><span>в работе</span></div>
        <div className="stat"><b>{stats.duplicates}</b><span>дубликатов</span></div>
      </div>

      <div className="card">
        <div className="filters">
          <div className="field">
            <label htmlFor="f-from">Период с</label>
            <input id="f-from" type="date" value={filters.from ?? ""}
              onChange={(e) => set({ from: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="f-to">по</label>
            <input id="f-to" type="date" value={filters.to ?? ""}
              onChange={(e) => set({ to: e.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="f-status">Статус</label>
            <select id="f-status" value={filters.status ?? ""}
              onChange={(e) => set({ status: e.target.value as LeadStatus | "" })}>
              <option value="">Все</option>
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="f-dealer">Дилер</label>
            <select id="f-dealer" value={filters.dealerId ?? ""}
              onChange={(e) => set({ dealerId: e.target.value })}>
              <option value="">Все</option>
              {dealers.map((d) => (
                <option key={d.id} value={d.id}>{d.full_name} ({d.code})</option>
              ))}
            </select>
          </div>
          <div className="field" style={{ flex: 1, minWidth: 200 }}>
            <label htmlFor="f-search">Поиск по телефону или ФИО</label>
            <input id="f-search" value={filters.search ?? ""}
              onChange={(e) => set({ search: e.target.value })}
              placeholder="7071234567 или Иванов" />
          </div>
        </div>
      </div>

      {error && <p className="error" role="alert">{error}</p>}

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <p className="empty">Загружаем заявки…</p>
        ) : leads.length === 0 ? (
          <p className="empty">За выбранный период заявок нет</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th className="nowrap">Дата</th>
                  <th className="nowrap">Телефон</th>
                  <th>ФИО</th>
                  <th>Адрес</th>
                  <th>Тариф</th>
                  <th>Дилер</th>
                  <th className="nowrap">Статус</th>
                  <th className="nowrap">Подключение</th>
                  <th>Комментарий</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <tr key={l.id}>
                    <td className="nowrap">
                      {new Date(l.created_at).toLocaleDateString("ru-RU")}
                      <br />
                      <span className="muted" style={{ fontSize: 12 }}>
                        {new Date(l.created_at).toLocaleTimeString("ru-RU", {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </td>
                    <td className="nowrap">
                      <a href={"tel:" + l.phone}>{formatPhone(l.phone)}</a>
                    </td>
                    <td>{l.full_name}</td>
                    <td style={{ maxWidth: 260 }}>{l.address}</td>
                    <td>{l.tariffs?.name_ru ?? <span className="muted">—</span>}</td>
                    <td>
                      {l.dealers ? (
                        <>
                          {l.dealers.full_name}
                          <br />
                          <span className="muted" style={{ fontSize: 12 }}>{l.dealers.code}</span>
                        </>
                      ) : (
                        // Код в ссылке был, но такого дилера нет — обычно опечатка
                        // или отключённый дилер. Показываем явно, чтобы разобрались.
                        <span className="muted">
                          не определён
                          {l.dealer_code_raw ? " (" + l.dealer_code_raw + ")" : ""}
                        </span>
                      )}
                    </td>
                    <td className="nowrap">
                      <select
                        className={"badge st-" + l.status}
                        value={l.status}
                        onChange={(e) => patch(l.id, { status: e.target.value as LeadStatus })}
                        aria-label="Статус заявки"
                      >
                        {LEAD_STATUSES.map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="nowrap">
                      {/* Дата подключения нужна только у состоявшихся продаж —
                          именно она попадает в отчёт и в АВР. */}
                      {l.status === "sale" ? (
                        <input
                          type="date"
                          value={l.connected_at ?? ""}
                          onChange={(e) => patch(l.id, { connected_at: e.target.value || null })}
                          aria-label="Дата подключения"
                        />
                      ) : (
                        <span className="muted">—</span>
                      )}
                    </td>
                    <td style={{ minWidth: 180 }}>
                      <input
                        defaultValue={l.manager_note ?? ""}
                        placeholder="заметка"
                        onBlur={(e) => {
                          const v = e.target.value.trim() || null;
                          if (v !== (l.manager_note ?? null)) patch(l.id, { manager_note: v });
                        }}
                        aria-label="Комментарий менеджера"
                        style={{ width: "100%" }}
                      />
                      {l.comment && (
                        <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                          от клиента: {l.comment}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
