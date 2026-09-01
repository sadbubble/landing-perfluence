interface CtaBannerProps {
  title: string;
  /** Слово под жёлтой подсветкой — приём из баннеров оператора. */
  accent: string;
  note: string;
  buttonLabel: string;
  onCta: () => void;
}

/**
 * Нижний баннер вместо секции с формой.
 *
 * Собран по примерам из гайда заказчика (for landing.pdf, раздел 1):
 * сплошная фирменная синева, крупный заголовок с жёлтой подсветкой и одна
 * кнопка.
 *
 * Ряда «пилюль» с цифрами здесь намеренно нет: скорость и цену человек уже
 * прочитал в карточках тарифов выше, а повтор только удлинял баннер. По
 * той же причине заголовок не повторяет надпись на кнопке — он даёт повод
 * нажать, а не называет действие дважды.
 *
 * Форма отсюда открывается модальным окном, а не лежит на странице:
 * длинная форма в конце лендинга отпугивает, а окно человек открывает
 * уже приняв решение.
 */
export default function CtaBanner({
  title,
  accent,
  note,
  buttonLabel,
  onCta,
}: CtaBannerProps) {
  return (
    <section className="cta-banner" id="cta">
      {/* Декоративные круги — тот же «сигнал», что и в верхнем баннере */}
      <svg className="cta-art" viewBox="0 0 1200 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="rgba(255,255,255,0.16)" strokeWidth="1.5">
          <circle cx="1050" cy="200" r="120" />
          <circle cx="1050" cy="200" r="200" />
          <circle cx="1050" cy="200" r="290" />
        </g>
        <circle cx="1050" cy="200" r="7" fill="rgba(255,255,255,0.5)" />
      </svg>

      <div className="cta-inner reveal">
        <h2 className="cta-title">
          {title} <span className="cta-accent">{accent}</span>
        </h2>

        <button className="cta-btn" onClick={onCta}>
          {buttonLabel}
        </button>
        <p className="cta-note">{note}</p>
      </div>
    </section>
  );
}
