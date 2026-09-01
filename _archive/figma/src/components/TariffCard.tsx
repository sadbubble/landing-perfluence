interface TariffCardProps {
  slug: string;
  name: string;
  description?: string | null;
  descriptionList?: string[] | null;
  priceMain: string;
  priceDetails: string[];
  badge?: string | null;
  recommended?: boolean;
  connectLabel: string;
  onSelect: (slug: string) => void;
}

export default function TariffCard({
  slug,
  name,
  description,
  descriptionList,
  priceMain,
  priceDetails,
  badge,
  recommended = false,
  connectLabel,
  onSelect,
}: TariffCardProps) {
  return (
    <article
      style={{
        background: "var(--surface)",
        borderRadius: "var(--radius)",
        border: recommended
          ? "2px solid var(--brand)"
          : "1.5px solid rgba(18,38,58,0.08)",
        boxShadow: recommended ? "0 4px 24px rgba(0,163,173,0.12)" : "var(--shadow-sm)",
        padding: "28px 24px 24px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "box-shadow 0.2s ease, transform 0.15s ease",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = "0 8px 32px rgba(18,38,58,0.13)";
        el.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement;
        el.style.boxShadow = recommended
          ? "0 4px 24px rgba(0,163,173,0.12)"
          : "var(--shadow-sm)";
        el.style.transform = "translateY(0)";
      }}
    >
      {/* Badge */}
      {badge && (
        <div
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: recommended ? "var(--brand)" : "var(--ink)",
            color: "white",
            fontSize: "11px",
            fontWeight: 700,
            padding: "3px 10px",
            borderRadius: "20px",
            letterSpacing: "0.2px",
            whiteSpace: "nowrap",
          }}
        >
          {badge}
        </div>
      )}

      {/* Name */}
      <h3
        style={{
          fontSize: "19px",
          fontWeight: 700,
          color: "var(--ink)",
          lineHeight: 1.2,
          paddingRight: badge ? "84px" : "0",
          marginBottom: "12px",
        }}
      >
        {name}
      </h3>

      {/* Description — grows to push price to bottom */}
      <div style={{ flex: 1, marginBottom: "20px" }}>
        {description && (
          <p
            style={{
              fontSize: "13px",
              color: "var(--ink-muted)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {description}
          </p>
        )}
        {descriptionList && (
          <ul
            style={{
              margin: 0,
              padding: 0,
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {descriptionList.map((item, i) => (
              <li
                key={i}
                style={{
                  fontSize: "13px",
                  color: "var(--ink-muted)",
                  lineHeight: 1.5,
                  display: "flex",
                  gap: "7px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "var(--brand)",
                    fontWeight: 700,
                    flexShrink: 0,
                    marginTop: "1px",
                  }}
                >
                  ·
                </span>
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Price block */}
      <div style={{ marginBottom: "16px" }}>
        <div
          style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "var(--ink)",
            letterSpacing: "-0.3px",
            lineHeight: 1.2,
            marginBottom: "6px",
          }}
        >
          {priceMain}
        </div>
        {priceDetails.map((line, i) => (
          <div
            key={i}
            style={{
              fontSize: "12px",
              color: "var(--ink-muted)",
              lineHeight: 1.5,
            }}
          >
            {line}
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={() => onSelect(slug)}
        style={{
          background: recommended ? "var(--brand)" : "transparent",
          color: recommended ? "white" : "var(--brand)",
          border: recommended ? "none" : "2px solid var(--brand)",
          borderRadius: "12px",
          padding: "13px 20px",
          fontSize: "15px",
          fontWeight: 700,
          cursor: "pointer",
          width: "100%",
          minHeight: "48px",
          transition: "background 0.15s ease, color 0.15s ease, border-color 0.15s ease",
          fontFamily: "inherit",
          marginTop: "auto",
        }}
        onMouseEnter={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = "var(--brand-dark)";
          btn.style.color = "white";
          btn.style.borderColor = "var(--brand-dark)";
        }}
        onMouseLeave={(e) => {
          const btn = e.currentTarget as HTMLButtonElement;
          btn.style.background = recommended ? "var(--brand)" : "transparent";
          btn.style.color = recommended ? "white" : "var(--brand)";
          btn.style.borderColor = recommended ? "transparent" : "var(--brand)";
        }}
      >
        {connectLabel}
      </button>
    </article>
  );
}
