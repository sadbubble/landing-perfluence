interface HeroProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  secondaryCtaLabel: string;
  imageAlt: string;
  /** Опорные факты под кнопкой: «Подключение за 1–2 дня» и подобные. */
  highlights: string[];
  scrollHint: string;
  onCta: () => void;
  onSecondaryCta: () => void;
}

/**
 * Баннер на первый экран.
 *
 * Занимает всю высоту окна и служит обложкой лендинга: человек приходит сюда
 * по рекламной ссылке блогера и за пару секунд должен понять, что предлагают
 * и что делать дальше.
 *
 * Композиция собрана вёрсткой: заливка, графика и текст. Фотография —
 * необязательный слой через --hero-image, и она именно фон, а не вырезанная
 * фигура: вырезка требует исходника от 1200px, иначе на первом экране сразу
 * видно мыло. Текст при этом остаётся чётким и переключается на казахский.
 *
 * Высота задана в svh, а не vh: на мобильных vh считается по развёрнутому
 * окну, и низ баннера вместе с кнопкой уезжает под панель браузера.
 */
export default function Hero({
  title,
  subtitle,
  ctaLabel,
  secondaryCtaLabel,
  imageAlt,
  highlights,
  scrollHint,
  onCta,
  onSecondaryCta,
}: HeroProps) {
  return (
    <section className="hero" aria-label={imageAlt}>
      {/* Слой необязательной фоновой фотографии (--hero-image) */}
      <div className="hero-photo" aria-hidden="true" />

      {/* Затемнение: без него текст на светлых участках фона нечитаем */}
      <div className="hero-scrim" aria-hidden="true" />

      {/* Концентрические круги — «сигнал», держат правую часть композиции */}
      <svg className="hero-art" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="hero-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g fill="none" stroke="url(#hero-arc)">
          <circle cx="1180" cy="240" r="180" strokeWidth="1.5" />
          <circle cx="1180" cy="240" r="300" strokeWidth="1.5" />
          <circle cx="1180" cy="240" r="440" strokeWidth="1.5" />
          <circle cx="1180" cy="240" r="600" strokeWidth="1.5" />
        </g>
        <circle cx="1180" cy="240" r="10" fill="var(--brand)" opacity="0.7" />
      </svg>

      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>

          <div className="hero-actions">
            <button className="hero-btn hero-btn-primary" onClick={onCta}>
              {ctaLabel}
            </button>
            <button className="hero-btn hero-btn-ghost" onClick={onSecondaryCta}>
              {secondaryCtaLabel}
            </button>
          </div>

          <ul className="hero-highlights">
            {highlights.map((h) => (
              <li key={h}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8.5 L6.3 11.8 L13 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button className="hero-scroll" onClick={onSecondaryCta} aria-label={scrollHint}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}
