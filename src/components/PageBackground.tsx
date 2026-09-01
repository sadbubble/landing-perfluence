/**
 * Фон всей страницы.
 *
 * Собран кодом, а не картинкой, намеренно: он тянется на любую высоту
 * страницы и любой экран без размытия, ничего не весит при загрузке
 * (важно для мобильного трафика из рекламы) и следует палитре — то есть
 * одинаково уместен и в светлых темах, и в тёмной.
 *
 * Слои снизу вверх:
 *   1. базовая заливка --bg;
 *   2. сетка из тонких линий — намёк на сеть связи, очень слабая;
 *   3. диагональные «волны» — след сигнала, крупная спокойная графика;
 *   4. два мягких пятна фирменного цвета сверху и снизу.
 *
 * Элемент фиксированный и не перехватывает события: содержимое страницы
 * прокручивается поверх него.
 */
export default function PageBackground() {
  return (
    <div aria-hidden="true" style={wrap}>
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 1440 900"
        style={{ display: "block" }}
      >
        <defs>
          {/* Сетка — 40px, линии едва различимы, работают как фактура бумаги */}
          <pattern id="pb-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M40 0 L0 0 0 40"
              fill="none"
              stroke="color-mix(in srgb, var(--ink) 5%, transparent)"
              strokeWidth="1"
            />
          </pattern>

          <radialGradient id="pb-glow-top" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.20" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="pb-glow-bottom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.13" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>

          {/* Волны затухают книзу, чтобы не спорить с текстом секций */}
          <linearGradient id="pb-wave" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.14" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        <rect width="1440" height="900" fill="var(--bg)" />
        <rect width="1440" height="900" fill="url(#pb-grid)" />

        <g fill="none" stroke="url(#pb-wave)" strokeWidth="1.5">
          <path d="M-100 700 C 240 560, 520 780, 820 620 S 1300 420, 1560 520" />
          <path d="M-100 760 C 240 620, 520 840, 820 680 S 1300 480, 1560 580" />
          <path d="M-100 820 C 240 680, 520 900, 820 740 S 1300 540, 1560 640" />
        </g>

        <ellipse cx="1150" cy="60" rx="620" ry="420" fill="url(#pb-glow-top)" />
        <ellipse cx="180" cy="880" rx="520" ry="360" fill="url(#pb-glow-bottom)" />
      </svg>
    </div>
  );
}

const wrap: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
  background: "var(--bg)",
};
