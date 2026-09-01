export interface Benefit {
  /** Ключ иконки из набора ниже. Тексты приходят из content, иконки — отсюда. */
  icon: BenefitIcon;
  title: string;
  text: string;
  /** Крупное число: «1–2», «0 ₸». Есть не у всех преимуществ. */
  metric?: string;
  metricUnit?: string;
  /**
   * Объёмная иконка-плитка. Пока файла нет, карточка показывает
   * нарисованную иконку — страница цела и до появления картинок.
   */
  image?: string;
}

export type BenefitIcon =
  | "speed"
  | "shield"
  | "tv"
  | "wallet"
  | "support"
  | "install";

interface BenefitsProps {
  title: string;
  subtitle: string;
  items: Benefit[];
}

/**
 * «Преимущества» — секция доверия между тарифами и формой.
 *
 * Отвечает на возражения, которые возникают у человека, пришедшего по
 * рекламе у блогера: не мошенники ли это, кто реально проводит интернет,
 * не будет ли скрытых доплат.
 */
export default function Benefits({ title, subtitle, items }: BenefitsProps) {
  return (
    <section className="benefits" id="benefits">
      <div className="benefits-inner">
        <div className="benefits-head reveal">
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>

        <div className="benefits-grid">
          {items.map((b, i) => (
            <article
              className={"benefit reveal" + (b.metric ? " benefit-metric" : "")}
              style={{ transitionDelay: `${i * 60}ms` }}
              key={b.title}
            >
              <div className="benefit-top">
                {/*
                  * Объёмная иконка ставится фоном, а не тегом <img>: она
                  * декоративна (смысл несут заголовок и текст), и пока файла
                  * нет, отсутствующий фон просто не рисуется — остаётся
                  * нарисованная иконка. С <img> здесь был бы значок «битой
                  * картинки»: обработчик onError не успевает, загрузка
                  * начинается раньше, чем React его вешает.
                  */}
                {b.image ? (
                  <div
                    className="benefit-art"
                    style={{ backgroundImage: `url(${b.image})` }}
                    aria-hidden="true"
                  />
                ) : (
                  <div className="benefit-icon">{ICONS[b.icon]}</div>
                )}
                {/* Цифра вместо украшения: она сама по себе аргумент,
                    и взгляд цепляется за неё раньше, чем за заголовок. */}
                {b.metric && (
                  <div className="benefit-figure">
                    <span className="benefit-figure-value">{b.metric}</span>
                    {b.metricUnit && (
                      <span className="benefit-figure-unit">{b.metricUnit}</span>
                    )}
                  </div>
                )}
              </div>
              <h3>{b.title}</h3>
              <p>{b.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Иконки нарисованы вручную, а не подключены библиотекой: их всего шесть,
   а любой icon-пакет добавил бы к мобильному бандлу больше, чем весит
   вся секция. Все используют currentColor и следуют теме. */
const s = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const ICONS: Record<BenefitIcon, React.ReactNode> = {
  speed: (
    <svg {...s}>
      <path d="M12 21a9 9 0 1 1 9-9" />
      <path d="M12 12l5-3.5" />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  ),
  shield: (
    <svg {...s}>
      <path d="M12 3l7 3v5.5c0 4.2-2.9 7.9-7 9.5-4.1-1.6-7-5.3-7-9.5V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  ),
  tv: (
    <svg {...s}>
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M10 9.5l4 1.5-4 1.5z" fill="currentColor" stroke="none" />
    </svg>
  ),
  wallet: (
    <svg {...s}>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="14.5" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  ),
  support: (
    <svg {...s}>
      <path d="M5 13v-1a7 7 0 0 1 14 0v1" />
      <rect x="3" y="13" width="4" height="6" rx="1.6" />
      <rect x="17" y="13" width="4" height="6" rx="1.6" />
      <path d="M19 19v.5a2.5 2.5 0 0 1-2.5 2.5H13" />
    </svg>
  ),
  install: (
    <svg {...s}>
      <path d="M3 20h18" />
      <path d="M6 20v-6l6-4 6 4v6" />
      <path d="M10.5 20v-3.5h3V20" />
      <path d="M12 3v3" />
    </svg>
  ),
};
