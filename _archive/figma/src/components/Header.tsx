import Logo from "./Logo";
import type { Lang } from "../hooks/useLang";

interface HeaderProps {
  partnerBadge: string;
  langRu: string;
  langKz: string;
  lang: Lang;
  onLangChange: (l: Lang) => void;
}

export default function Header({
  partnerBadge,
  langRu,
  langKz,
  lang,
  onLangChange,
}: HeaderProps) {
  return (
    <header
      style={{
        background: "var(--surface)",
        borderBottom: "1px solid rgba(18,38,58,0.07)",
        position: "sticky",
        top: 0,
        zIndex: 50,
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <Logo />

        {/* Partner badge — desktop only */}
        <div
          style={{
            background: "var(--brand-soft)",
            color: "var(--brand-dark)",
            fontSize: "11px",
            fontWeight: 600,
            padding: "4px 10px",
            borderRadius: "6px",
            lineHeight: "1.4",
            flexShrink: 0,
            display: "none",
          }}
          className="partner-badge"
        >
          {partnerBadge}
        </div>

        <div style={{ flex: 1 }} />

        {/* Language switcher */}
        <div
          style={{
            display: "flex",
            gap: "2px",
            background: "var(--bg)",
            borderRadius: "8px",
            padding: "3px",
            flexShrink: 0,
          }}
        >
          <LangButton
            label={langRu}
            active={lang === "ru"}
            onClick={() => onLangChange("ru")}
          />
          <LangButton
            label={langKz}
            active={lang === "kk"}
            onClick={() => onLangChange("kk")}
          />
        </div>
      </div>

      {/* Partner badge — mobile strip */}
      <div
        style={{
          background: "var(--brand-soft)",
          padding: "6px 20px",
          borderTop: "1px solid rgba(0,163,173,0.12)",
        }}
        className="partner-badge-mobile"
      >
        <span
          style={{
            color: "var(--brand-dark)",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          {partnerBadge}
        </span>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .partner-badge { display: block !important; }
          .partner-badge-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}

function LangButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      style={{
        padding: "5px 12px",
        borderRadius: "6px",
        border: "none",
        background: active ? "var(--brand)" : "transparent",
        color: active ? "white" : "var(--ink-muted)",
        fontSize: "13px",
        fontWeight: 600,
        cursor: active ? "default" : "pointer",
        transition: "background 0.15s ease, color 0.15s ease",
        fontFamily: "inherit",
        minHeight: "32px",
      }}
    >
      {label}
    </button>
  );
}
