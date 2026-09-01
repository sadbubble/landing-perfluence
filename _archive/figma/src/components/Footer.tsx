interface FooterProps {
  company: string;
  partnerBadge: string;
  privacyLabel: string;
  privacyPath: string;
  rights: string;
}

export default function Footer({
  company,
  partnerBadge,
  privacyLabel,
  privacyPath,
  rights,
}: FooterProps) {
  return (
    <footer
      style={{
        background: "var(--ink)",
        color: "rgba(255,255,255,0.55)",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
        className="footer-inner"
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
          className="footer-left"
        >
          <span
            style={{ color: "white", fontWeight: 700, fontSize: "16px" }}
          >
            {company}
          </span>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0,163,173,0.15)",
              border: "1px solid rgba(0,163,173,0.3)",
              borderRadius: "6px",
              padding: "4px 10px",
              alignSelf: "flex-start",
            }}
          >
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--brand)",
              }}
            />
            <span
              style={{
                fontSize: "11px",
                fontWeight: 600,
                color: "var(--brand)",
                letterSpacing: "0.2px",
              }}
            >
              {partnerBadge}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
          className="footer-right"
        >
          <a
            href={privacyPath}
            style={{
              color: "rgba(255,255,255,0.6)",
              textDecoration: "underline",
              fontSize: "13px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "white"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.6)"; }}
          >
            {privacyLabel}
          </a>
          <span style={{ fontSize: "12px" }}>
            © {new Date().getFullYear()} {company}. {rights}
          </span>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .footer-inner {
            flex-direction: row !important;
            align-items: center;
            justify-content: space-between;
          }
          .footer-right {
            align-items: flex-end !important;
          }
        }
      `}</style>
    </footer>
  );
}
