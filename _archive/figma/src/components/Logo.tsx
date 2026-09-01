export default function Logo() {
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
        <rect width="40" height="40" rx="10" fill="var(--brand)" />
        <circle cx="20" cy="20" r="7" fill="white" opacity="0.2" />
        <circle cx="20" cy="20" r="4" fill="white" />
        <path
          d="M20 8 C20 8 28 14 28 20 C28 26 20 32 20 32"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M20 8 C20 8 12 14 12 20 C12 26 20 32 20 32"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
      <span
        style={{
          fontWeight: 700,
          fontSize: "18px",
          color: "var(--ink)",
          letterSpacing: "-0.3px",
        }}
      >
        Perfluence
      </span>
    </div>
  );
}
