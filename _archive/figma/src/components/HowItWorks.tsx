interface Step {
  number: string;
  title: string;
  description: string;
}

interface HowItWorksProps {
  title: string;
  subtitle: string;
  steps: Step[];
}

export default function HowItWorks({ title, subtitle, steps }: HowItWorksProps) {
  return (
    <section style={{ background: "var(--surface)", padding: "72px 20px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
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
          <p style={{ fontSize: "16px", color: "var(--ink-muted)" }}>{subtitle}</p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "24px",
            position: "relative",
          }}
          className="steps-grid"
        >
          {steps.map((step, index) => (
            <StepCard key={step.number} step={step} isLast={index === steps.length - 1} />
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .steps-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}</style>
    </section>
  );
}

function StepCard({ step, isLast }: { step: Step; isLast: boolean }) {
  return (
    <div
      style={{
        background: "var(--bg)",
        borderRadius: "var(--radius)",
        padding: "32px 28px",
        position: "relative",
        border: "1.5px solid rgba(18,38,58,0.06)",
      }}
    >
      {/* Step number bubble */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "50%",
          background: "var(--brand)",
          color: "white",
          fontSize: "20px",
          fontWeight: 800,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "20px",
          flexShrink: 0,
        }}
      >
        {step.number}
      </div>

      {/* Arrow connector (desktop only, not last) */}
      {!isLast && (
        <div
          className="step-arrow"
          style={{
            display: "none",
            position: "absolute",
            right: "-20px",
            top: "40px",
            color: "var(--brand)",
            fontSize: "24px",
            zIndex: 2,
          }}
        >
          →
        </div>
      )}

      <h3
        style={{
          fontSize: "17px",
          fontWeight: 700,
          color: "var(--ink)",
          marginBottom: "10px",
          lineHeight: 1.3,
        }}
      >
        {step.title}
      </h3>
      <p style={{ fontSize: "14px", color: "var(--ink-muted)", lineHeight: 1.65 }}>
        {step.description}
      </p>

      <style>{`
        @media (min-width: 768px) {
          .step-arrow { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
