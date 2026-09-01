import { useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

/**
 * Вход для сотрудников. Публичной регистрации нет намеренно —
 * аккаунты заводит админ (см. docs/setup-supabase.md, шаг 4).
 */
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      // Не уточняем, что именно неверно — почта или пароль: иначе форма
      // превращается в способ проверять, кто из сотрудников заведён.
      setError("Неверная почта или пароль");
      setBusy(false);
    }
    // При успехе useAuth подхватит сессию и роутер сам уведёт в админку.
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Вход в панель</h1>
        <p className="muted" style={{ margin: 0, fontSize: 14 }}>
          Заявки и отчётность Perfluence
        </p>

        <div className="field">
          <label htmlFor="email">Рабочая почта</label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="field">
          <label htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="error" style={{ marginBottom: 0 }} role="alert">
            {error}
          </p>
        )}

        <button className="btn" type="submit" disabled={busy}>
          {busy ? "Входим…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
