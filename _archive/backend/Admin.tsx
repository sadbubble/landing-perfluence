import { useState } from "react";
import { useAuth, isStaff, signOut } from "../lib/auth";
import { isSupabaseConfigured } from "../lib/config";
import Login from "./Login";
import LeadsTab from "../components/admin/LeadsTab";
import DealersTab from "../components/admin/DealersTab";
import ReportTab from "../components/admin/ReportTab";

type Tab = "leads" | "dealers" | "report";

export default function Admin() {
  const { session, profile, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("leads");

  // Без ключей Supabase панель работать не может — говорим об этом прямо,
  // а не показываем бесконечную загрузку или пустой экран входа.
  if (!isSupabaseConfigured) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1>Бэкенд не настроен</h1>
          <p className="muted">
            Не заданы ключи Supabase. Скопируйте <code>.env.example</code> в{" "}
            <code>.env.local</code>, подставьте значения и перезапустите
            <code> npm run dev</code>. Порядок настройки — в{" "}
            <code>docs/setup-supabase.md</code>.
          </p>
          <p className="muted">Лендинг при этом открывается и работает.</p>
        </div>
      </div>
    );
  }

  if (loading) return <p className="empty">Загружаем…</p>;
  if (!session) return <Login />;

  // Пользователь есть, а профиля нет — значит, роль ему не выдали.
  // Это не сотрудник: доступ к персданным клиентов ему не положен.
  if (!isStaff(profile)) {
    return (
      <div className="login-wrap">
        <div className="login-card">
          <h1>Нет доступа</h1>
          <p className="muted">
            Учётной записи не выдана роль сотрудника. Обратитесь к администратору.
          </p>
          <button className="btn" onClick={() => void signOut()}>Выйти</button>
        </div>
      </div>
    );
  }

  const isAdmin = profile?.role === "admin";

  return (
    <div className="adm">
      <div className="adm-top">
        <h1>Заявки Perfluence</h1>
        <span className="adm-user">
          {profile?.full_name ?? session.user.email}
          {isAdmin ? " · администратор" : " · менеджер"}
        </span>
        <div className="spacer" />
        <button className="btn btn-ghost btn-sm" onClick={() => void signOut()}>Выйти</button>
      </div>

      <div className="adm-tabs" role="tablist">
        <button role="tab" aria-selected={tab === "leads"} className="adm-tab"
          onClick={() => setTab("leads")}>Заявки</button>
        <button role="tab" aria-selected={tab === "dealers"} className="adm-tab"
          onClick={() => setTab("dealers")}>Дилеры и ссылки</button>
        <button role="tab" aria-selected={tab === "report"} className="adm-tab"
          onClick={() => setTab("report")}>Отчёт за месяц</button>
      </div>

      {tab === "leads" && <LeadsTab />}
      {tab === "dealers" && <DealersTab isAdmin={isAdmin} />}
      {tab === "report" && <ReportTab />}
    </div>
  );
}
