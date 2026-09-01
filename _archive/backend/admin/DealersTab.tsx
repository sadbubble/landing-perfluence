import { useEffect, useState, type FormEvent } from "react";
import { fetchDealers, createDealer, setDealerActive, type Dealer } from "../../lib/leads";
import { buildDealerLink, generateDealerCode } from "../../lib/dealer";

/**
 * Дилеры и их персональные ссылки (ТЗ п.5).
 * Код генерируется системой, а не вводится руками: коды должны быть
 * уникальны и не должны выдавать порядок или количество сотрудников.
 */
export default function DealersTab({ isAdmin }: { isAdmin: boolean }) {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [channel, setChannel] = useState("dealer");
  const [code, setCode] = useState(generateDealerCode());
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      setDealers(await fetchDealers());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить дилеров");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createDealer({
        code,
        full_name: name.trim(),
        phone: phone.trim() || null,
        channel,
      });
      setName("");
      setPhone("");
      setCode(generateDealerCode());
      await load();
    } catch (e) {
      // Самая вероятная причина — коллизия кода. Просто выдаём новый.
      setError(e instanceof Error ? e.message : "Не удалось добавить дилера");
      setCode(generateDealerCode());
    } finally {
      setSaving(false);
    }
  }

  async function copyLink(d: Dealer) {
    await navigator.clipboard.writeText(buildDealerLink(d.code));
    setCopied(d.id);
    setTimeout(() => setCopied(null), 1500);
  }

  async function toggle(d: Dealer) {
    // Отключённый дилер перестаёт «ловить» заявки по своей ссылке, но
    // все его прошлые заявки остаются в отчётах — удалять его нельзя.
    await setDealerActive(d.id, !d.is_active);
    await load();
  }

  return (
    <>
      {isAdmin && (
        <div className="card">
          <h2 style={{ fontSize: 16, marginTop: 0 }}>Добавить дилера</h2>
          <form className="filters" onSubmit={onCreate}>
            <div className="field" style={{ flex: 1, minWidth: 200 }}>
              <label htmlFor="d-name">ФИО сотрудника или блогера</label>
              <input id="d-name" value={name} required
                onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="d-phone">Телефон</label>
              <input id="d-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="d-channel">Тип</label>
              <select id="d-channel" value={channel} onChange={(e) => setChannel(e.target.value)}>
                <option value="dealer">Дилер</option>
                <option value="blogger">Блогер</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="d-code">Код (сгенерирован)</label>
              <input id="d-code" value={code} readOnly style={{ width: 110 }} />
            </div>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? "Добавляем…" : "Добавить"}
            </button>
          </form>
        </div>
      )}

      {error && <p className="error" role="alert">{error}</p>}

      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <p className="empty">Загружаем…</p>
        ) : dealers.length === 0 ? (
          <p className="empty">Дилеров пока нет</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Дилер</th>
                  <th className="nowrap">Код</th>
                  <th>Тип</th>
                  <th>Телефон</th>
                  <th>Персональная ссылка</th>
                  <th className="nowrap">Статус</th>
                  {isAdmin && <th></th>}
                </tr>
              </thead>
              <tbody>
                {dealers.map((d) => (
                  <tr key={d.id} style={{ opacity: d.is_active ? 1 : 0.5 }}>
                    <td>{d.full_name}</td>
                    <td className="nowrap"><code>{d.code}</code></td>
                    <td>{d.channel === "blogger" ? "Блогер" : "Дилер"}</td>
                    <td className="nowrap">{d.phone ?? <span className="muted">—</span>}</td>
                    <td>
                      <span className="muted" style={{ fontSize: 13 }}>
                        {buildDealerLink(d.code)}
                      </span>
                      <button className="btn btn-ghost btn-sm" style={{ marginLeft: 8 }}
                        onClick={() => void copyLink(d)}>
                        {copied === d.id ? "Скопировано" : "Копировать"}
                      </button>
                    </td>
                    <td className="nowrap">
                      {d.is_active
                        ? <span className="badge st-sale">Активен</span>
                        : <span className="badge st-no_answer">Отключён</span>}
                    </td>
                    {isAdmin && (
                      <td className="nowrap">
                        <button className="btn btn-ghost btn-sm" onClick={() => void toggle(d)}>
                          {d.is_active ? "Отключить" : "Включить"}
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="muted" style={{ fontSize: 13 }}>
        Ссылка выдаётся дилеру как есть — он размещает её в рекламе. Клиент
        дилера не выбирает и не видит: код читается из адреса страницы
        автоматически.
      </p>
    </>
  );
}
