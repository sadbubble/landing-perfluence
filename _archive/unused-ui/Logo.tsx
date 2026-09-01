/**
 * Знак и название компании.
 *
 * `light` — вариант для тёмной подложки: пока шапка прозрачная и лежит
 * поверх баннера, синий знак на синем фоне терялся бы, поэтому плашка
 * становится белой, а рисунок внутри — цветным.
 */
export default function Logo({ light = false }: { light?: boolean }) {
  const plate = light ? "#FFFFFF" : "var(--brand)";
  const glyph = light ? "var(--brand)" : "#FFFFFF";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Логотип Perfluence"
      >
        <rect width="40" height="40" rx="10" fill={plate} />
        <circle cx="20" cy="20" r="7" fill={glyph} opacity="0.2" />
        <circle cx="20" cy="20" r="4" fill={glyph} />
        <path
          d="M20 8 C20 8 28 14 28 20 C28 26 20 32 20 32"
          stroke={glyph}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M20 8 C20 8 12 14 12 20 C12 26 20 32 20 32"
          stroke={glyph}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      {/* На узком экране остаётся только знак: строка шапки короткая,
          а название компании повторено в подвале. */}
      <span
        className="logo-wordmark"
        style={{
          fontWeight: 700,
          fontSize: "18px",
          color: light ? "#FFFFFF" : "var(--ink)",
          letterSpacing: "-0.3px",
        }}
      >
        Perfluence
      </span>
    </div>
  );
}
