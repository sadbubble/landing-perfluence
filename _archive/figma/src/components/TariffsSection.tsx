import TariffCard from "./TariffCard";
import type { Tariff } from "../content/ru";

interface TariffsSectionProps {
  title: string;
  subtitle: string;
  tariffs: Tariff[];
  connectLabel: string;
  onSelect: (slug: string) => void;
}

export default function TariffsSection({
  title,
  subtitle,
  tariffs,
  connectLabel,
  onSelect,
}: TariffsSectionProps) {
  return (
    <section
      style={{
        background: "var(--brand-soft)",
        padding: "72px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <h2
            style={{
              fontSize: "clamp(24px, 4vw, 36px)",
              fontWeight: 800,
              color: "var(--ink)",
              letterSpacing: "-0.3px",
              marginBottom: "12px",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              fontSize: "16px",
              color: "var(--ink-muted)",
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "20px",
          }}
          className="tariffs-grid"
        >
          {tariffs.map((tariff) => (
            <TariffCard
              key={tariff.slug}
              {...tariff}
              connectLabel={connectLabel}
              onSelect={onSelect}
            />
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 600px) {
          .tariffs-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (min-width: 1024px) {
          .tariffs-grid {
            grid-template-columns: repeat(4, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}
