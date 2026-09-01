import { useState } from "react";
import { THEMES, applyTheme, type ThemeId } from "../lib/theme";

/**
 * Плавающая панель выбора оформления. Появляется только при ?themes=1.
 * Нужна, чтобы показать несколько направлений на одном экране и получить
 * решение, а не обсуждать оформление словами.
 */
export default function ThemePicker({ current }: { current: ThemeId }) {
  const [active, setActive] = useState<ThemeId>(current);
  const [open, setOpen] = useState(true);

  function pick(id: ThemeId) {
    setActive(id);
    applyTheme(id);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{ ...fab, width: 48, height: 48, padding: 0 }}
        aria-label="Показать варианты оформления"
      >
        🎨
      </button>
    );
  }

  return (
    <div style={panel} role="region" aria-label="Варианты оформления">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
        <strong style={{ fontSize: 13, color: "var(--ink)" }}>Вариант оформления</strong>
        <span style={{ flex: 1 }} />
        <button onClick={() => setOpen(false)} style={closeBtn} aria-label="Свернуть">
          ×
        </button>
      </div>

      {THEMES.map((t) => {
        const on = t.id === active;
        return (
          <button
            key={t.id}
            onClick={() => pick(t.id)}
            aria-pressed={on}
            style={{
              ...row,
              borderColor: on ? "var(--brand)" : "var(--line)",
              background: on ? "var(--brand-soft)" : "transparent",
            }}
          >
            <span style={{ ...dot, background: t.swatch }} />
            <span style={{ textAlign: "left" }}>
              <span style={{ display: "block", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                {t.name}
              </span>
              <span style={{ display: "block", fontSize: 11, color: "var(--ink-muted)", lineHeight: 1.35 }}>
                {t.hint}
              </span>
            </span>
          </button>
        );
      })}

      <p style={{ fontSize: 11, color: "var(--ink-muted)", margin: "10px 0 0", lineHeight: 1.4 }}>
        Панель видна только по ссылке с <code>?themes=1</code>. На боевом сайте её нет.
      </p>
    </div>
  );
}

const fab: React.CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 100,
  borderRadius: 999,
  border: "1px solid var(--line)",
  background: "var(--surface)",
  boxShadow: "var(--shadow-md)",
  cursor: "pointer",
  fontSize: 20,
};

const panel: React.CSSProperties = {
  position: "fixed",
  right: 16,
  bottom: 16,
  zIndex: 100,
  width: 268,
  maxWidth: "calc(100vw - 32px)",
  maxHeight: "calc(100vh - 32px)",
  overflowY: "auto",
  padding: 14,
  borderRadius: 14,
  border: "1px solid var(--line)",
  background: "var(--surface)",
  boxShadow: "var(--shadow-md)",
  fontFamily: "var(--font)",
};

const row: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  width: "100%",
  padding: "9px 10px",
  marginBottom: 6,
  borderRadius: 10,
  border: "1.5px solid var(--line)",
  cursor: "pointer",
  fontFamily: "inherit",
  minHeight: 44,
};

const dot: React.CSSProperties = {
  width: 18,
  height: 18,
  minWidth: 18,
  borderRadius: 999,
  marginTop: 2,
  border: "1px solid color-mix(in srgb, var(--ink) 15%, transparent)",
};

const closeBtn: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "var(--ink-muted)",
  fontSize: 20,
  lineHeight: 1,
  cursor: "pointer",
  // Крестик легко промахнуться пальцем — держим цель 44x44,
  // отрицательный отступ не даёт ей раздвинуть заголовок панели.
  width: 44,
  height: 44,
  margin: "-10px -10px -10px 0",
};
