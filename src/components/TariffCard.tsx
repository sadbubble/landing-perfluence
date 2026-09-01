import type { TariffPrice } from "../content/ru";

export type PriceMode = "contract" | "noContract";

interface TariffCardProps {
  slug: string;
  name: string;
  tagline?: string | null;
  headline: string;
  price: TariffPrice;
  badge?: string | null;
  recommended?: boolean;
  connectLabel: string;
  currency: string;
  perMonthShort: string;
  savingLabel: string;
  noContractLabel: string;
  mode: PriceMode;
  onSelect: (slug: string) => void;
}

/** «7 249» → 7249. Нужна только для подсчёта выгоды. */
function toNumber(s: string): number {
  return Number(s.replace(/\D/g, ""));
}

/**
 * Выделяет числа жирным: «до 200 Мбит/с» → «до <b>200</b> Мбит/с».
 * Так строка читается с одного взгляда — глаз цепляется за цифру, а не
 * за предлог. В макете заказчика сделано именно так.
 */
function boldNumbers(text: string) {
  return text.split(/(\d+)/).map((part, i) =>
    /^\d+$/.test(part) ? <b key={i}>{part}</b> : <span key={i}>{part}</span>,
  );
}

/**
 * Карточка тарифа.
 *
 * Оформление — по макету заказчика: белая карточка, всё по центру, никаких
 * цветных шапок. Различает карточки не заливка, а сама цена: она здесь
 * самый крупный элемент, потому что за ней человек и пришёл.
 *
 * Рекомендуемый тариф выделяется синей рамкой и плашкой на верхнем крае —
 * приём из макета, заодно решает старую проблему: раньше выделение было
 * малозаметным.
 */
export default function TariffCard({
  slug,
  name,
  tagline,
  headline,
  price,
  badge,
  recommended = false,
  connectLabel,
  currency,
  perMonthShort,
  savingLabel,
  noContractLabel,
  mode,
  onSelect,
}: TariffCardProps) {
  const hasContract = price.contract !== null;
  const showContract = mode === "contract" && hasContract;
  const amount = showContract ? price.contract! : price.noContract;
  const caption = showContract ? price.contractLabel : noContractLabel;
  const saving = hasContract ? toNumber(price.noContract) - toNumber(price.contract!) : 0;

  return (
    <article className={"tcard" + (recommended ? " is-popular" : "")}>
      {badge && recommended && <span className="tcard-pill">{badge}</span>}

      <h3 className="tcard-name">{name}</h3>
      {badge && !recommended && <span className="tcard-chip">{badge}</span>}
      <p className="tcard-headline">{boldNumbers(headline)}</p>

      {/* key заставляет цену перерисоваться при смене режима — иначе
          подмена суммы проходит незаметно. */}
      <div className="tcard-price" key={amount}>
        <span className="tcard-price-num">{amount}</span>
        <span className="tcard-price-cur">{currency}</span>
      </div>
      <div className="tcard-per">{perMonthShort}</div>

      {showContract && saving > 0 && (
        <span className="tcard-saving">
          −{saving.toLocaleString("ru-RU")} {currency} {savingLabel}
        </span>
      )}
      {caption && <p className="tcard-caption">{caption}</p>}

      {price.extra.length > 0 && (
        <ul className="tcard-extra">
          {price.extra.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      )}

      {/* Прижимаем низ к одной линии: карточки разной высоты, иначе кнопки
          не выстроятся в ряд. */}
      <div className="tcard-foot">
        {tagline && (
          <p className="tcard-note">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M4 6h16M4 12h16M4 18h10"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            {tagline}
          </p>
        )}

        <button className="tcard-btn" onClick={() => onSelect(slug)}>
          {connectLabel}
        </button>
      </div>
    </article>
  );
}
