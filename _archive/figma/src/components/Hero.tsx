interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  imageAlt: string;
  imageCaption: string;
  onCta: () => void;
}

export default function Hero({
  title,
  subtitle,
  ctaLabel,
  imageAlt,
  imageCaption,
  onCta,
}: HeroProps) {
  return (
    <section
      style={{
        background: "var(--surface)",
        padding: "60px 20px 64px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "48px",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        {/* Text */}
        <div style={{ maxWidth: "600px" }}>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 800,
              color: "var(--ink)",
              lineHeight: 1.15,
              letterSpacing: "-0.5px",
              marginBottom: "20px",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "var(--ink-muted)",
              lineHeight: 1.65,
              marginBottom: "36px",
              maxWidth: "480px",
            }}
          >
            {subtitle}
          </p>
          <button
            onClick={onCta}
            style={{
              background: "var(--brand)",
              color: "white",
              border: "none",
              borderRadius: "var(--radius)",
              padding: "16px 36px",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              minHeight: "52px",
              letterSpacing: "0.1px",
              boxShadow: "0 4px 16px rgba(0,163,173,0.3)",
              transition: "background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--brand-dark)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(0,163,173,0.35)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--brand)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 16px rgba(0,163,173,0.3)";
            }}
          >
            {ctaLabel}
          </button>
        </div>

        {/* Illustration placeholder */}
        <div
          style={{
            background: "var(--brand-soft)",
            borderRadius: "var(--radius)",
            aspectRatio: "4/3",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            border: "1.5px dashed rgba(0,163,173,0.3)",
          }}
          aria-label={imageAlt}
        >
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="4" y="14" width="56" height="36" rx="6" stroke="var(--brand)" strokeWidth="2.5" />
            <rect x="22" y="50" width="20" height="4" fill="var(--brand)" opacity="0.3" />
            <rect x="16" y="54" width="32" height="3" rx="1.5" fill="var(--brand)" opacity="0.2" />
            <path d="M16 28 Q24 20 32 28 Q40 36 48 28" stroke="var(--brand)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <circle cx="32" cy="28" r="4" fill="var(--brand)" opacity="0.4" />
          </svg>
          <span
            style={{
              fontSize: "13px",
              color: "var(--brand)",
              fontWeight: 500,
              opacity: 0.7,
            }}
          >
            {imageCaption}
          </span>
        </div>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
