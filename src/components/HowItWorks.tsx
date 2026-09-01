interface Step {
  number: string;
  title: string;
  description: string;
  /**
   * Круглый медальон шага. Оформление намеренно отличается от квадратных
   * плиток в «Преимуществах»: если повторить их один в один, две соседние
   * секции сольются в одну длинную ленту одинаковых карточек.
   * Пока файла нет, остаётся крупный номер шага — секция цела.
   */
  image?: string;
}

interface HowItWorksProps {
  title: string;
  subtitle: string;
  steps: Step[];
}

export default function HowItWorks({ title, subtitle, steps }: HowItWorksProps) {
  return (
    <section className="how">
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: "52px" }}>
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
            <div
              className="reveal"
              style={{ transitionDelay: `${index * 90}ms`, display: "flex" }}
              key={step.number}
            >
              <StepCard step={step} isLast={index === steps.length - 1} />
            </div>
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
    <div className="step">
      <div className="step-art-wrap">
        {step.image ? (
          /* Фоном, а не <img>: изображение декоративно, а при отсутствии
             файла фон просто не рисуется — остаётся номер шага. */
          <div
            className="step-art"
            style={{ backgroundImage: `url(${step.image})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="step-art step-art-empty" aria-hidden="true" />
        )}
        <span className="step-num">{step.number}</span>
      </div>

      <h3 className="step-title">{step.title}</h3>
      <p className="step-text">{step.description}</p>

      {/* Пунктир к следующему шагу — только на широком экране, где шаги
          стоят в ряд. В колонке он вёл бы вбок, в пустоту. */}
      {!isLast && <span className="step-link" aria-hidden="true" />}
    </div>
  );
}
