import { Link } from "react-router-dom";
import { PRIVACY_RU, PRIVACY_UPDATED, PRIVACY_VERSION } from "../content/privacy";

/**
 * Страница политики обработки персональных данных.
 *
 * Вёрстка намеренно простая и самостоятельная: на неё ссылается чекбокс
 * согласия в форме, и она должна открываться, даже если дизайн лендинга
 * ещё меняется. Под фирменный стиль причёсывается после интеграции Figma.
 */
export default function Privacy() {
  const c = PRIVACY_RU;

  return (
    <div className="doc">
      <Link to="/" className="doc-back">← На главную</Link>

      <h1>{c.title}</h1>
      <p className="muted doc-meta">
        Редакция {PRIVACY_VERSION} от {new Date(PRIVACY_UPDATED).toLocaleDateString("ru-RU")}
      </p>

      <p className="doc-intro">{c.intro}</p>

      {c.sections.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          {s.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </section>
      ))}

      <Link to="/" className="btn" style={{ display: "inline-block", marginTop: 24 }}>
        Вернуться на главную
      </Link>
    </div>
  );
}
