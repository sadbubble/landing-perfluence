import { useId, useState, type ReactNode } from "react";
import type { TariffPrice, SimVariant, TariffService } from "../content/ru";
import type { PriceMode, TariffSelection } from "../lib/qbox";

export type { PriceMode };

interface TariffCardProps {
  slug: string;
  name: string;
  tagline?: string | null;
  headline: string;
  /** Состав тарифа (ТЗ п.4). У Bereket берётся из выбранного варианта SIM. */
  descriptionList?: string[] | null;
  price: TariffPrice;
  /** Варианты по числу SIM. Есть только у Bereket, у остальных null. */
  simVariants?: SimVariant[] | null;
  badge?: string | null;
  recommended?: boolean;
  connectLabel: string;
  currency: string;
  perMonthShort: string;
  savingLabel: string;
  /** «Подробнее» / «Свернуть» у мелких условий в блоках услуг. */
  detailsMore: string;
  detailsLess: string;
  noContractLabel: string;
  mode: PriceMode;
  onSelect: (sel: TariffSelection) => void;
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

/** Иконки услуг. Свои, линейные, в цвет текста — не копия с сайта КТ. */
const SERVICE_ICONS: Record<string, ReactNode> = {
  internet: (
    <path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.5a9.5 9.5 0 0 1 13 0M8.6 16a5 5 0 0 1 6.8 0M12 19.5h.01" />
  ),
  tv: (
    <>
      <rect x="2.5" y="4.5" width="19" height="12.5" rx="2" />
      <path d="M8 20.5h8" />
    </>
  ),
  mobile: (
    <>
      <rect x="6.5" y="2.5" width="11" height="19" rx="2.2" />
      <path d="M11 18.5h2" />
    </>
  ),
};

/**
 * Значение в строке цифр. «∞» рисуется иконкой: в урезанных файлах
 * Helvetica Neue этого знака нет, и браузер брал его из запасного шрифта —
 * мелкий и бледный рядом с жирными цифрами. Сам знак остаётся текстом для
 * скринридеров.
 */
function FactValue({ value }: { value: string }) {
  if (!value.startsWith("∞")) return <>{value}</>;
  return (
    <>
      <svg className="tcard-inf" width="18" height="12" viewBox="0 0 24 16" fill="none"
        aria-hidden="true">
        <path d="M12 8C10 5.3 8.3 4 6.5 4a4 4 0 0 0 0 8c1.8 0 3.5-1.3 5.5-4zm0 0c2 2.7 3.7 4 5.5 4a4 4 0 0 0 0-8C15.7 4 14 5.3 12 8z"
          stroke="currentColor" strokeWidth="2.2" />
      </svg>
      <span className="visually-hidden">∞</span>
      {value.slice(1)}
    </>
  );
}

/**
 * Состав тарифа блоками по услугам — пока только у Bereket.
 *
 * Мелкие условия (скорость после лимита, подписка к номерам) спрятаны под
 * «Подробнее»: раскрытые, они вытянули бы карточку, а за ней весь ряд —
 * высота карточек в ряду общая. Кнопка 44px по высоте, как все цели под
 * палец в проекте.
 */
function ServiceBlocks({
  services,
  moreLabel,
  lessLabel,
}: {
  services: TariffService[];
  moreLabel: string;
  lessLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const detailsId = useId();
  const details = services.flatMap((s) => s.details);

  return (
    <div className="tcard-services">
      {services.map((s) => (
        <div className="tcard-service" key={s.icon}>
          {SERVICE_ICONS[s.icon] && (
            <span className="tcard-service-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                {SERVICE_ICONS[s.icon]}
              </svg>
            </span>
          )}
          <div className="tcard-service-body">
            <p className="tcard-service-title">{s.title}</p>
            <p className="tcard-service-summary">{boldNumbers(s.summary)}</p>
            {s.facts.length > 0 && (
              <dl className="tcard-facts">
                {s.facts.map((f) => (
                  <div key={f.value}>
                    <dt><FactValue value={f.value} /></dt>
                    <dd>{f.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </div>
      ))}

      {details.length > 0 && (
        <>
          <button
            type="button"
            className="tcard-more"
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? lessLabel : moreLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <ul className="tcard-details" id={detailsId} hidden={!open}>
            {details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </>
      )}
    </div>
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
 *
 * У Bereket добавлен второй переключатель — 2 SIM / 4 SIM. Он нужен не для
 * красоты: в Qbox это разные продукты, и без него лендинг не мог сообщить
 * форме, какой из них выбрали. Раньше 4 SIM был строчкой текста под ценой,
 * нажать на неё было нельзя.
 */
export default function TariffCard({
  slug,
  name,
  tagline,
  headline,
  descriptionList,
  price,
  simVariants,
  badge,
  recommended = false,
  connectLabel,
  currency,
  perMonthShort,
  savingLabel,
  detailsMore,
  detailsLess,
  noContractLabel,
  mode,
  onSelect,
}: TariffCardProps) {
  const [simId, setSimId] = useState<string | null>(simVariants?.[0]?.id ?? null);

  // Цена и строка сути берутся из выбранного варианта SIM, если он есть.
  const variant = simVariants?.find((v) => v.id === simId) ?? null;
  const activePrice = variant ? variant.price : price;
  const activeHeadline = variant ? variant.headline : headline;
  // Состав: у Bereket блоками по услугам, у остальных — списком строк.
  const services = variant ? variant.services : [];
  const features = variant ? [] : (descriptionList ?? []);

  /*
   * Цена строго из выбранного режима. Раньше у тарифа с одной ценой она
   * показывалась на обеих вкладках; теперь такой тариф живёт только на
   * своей вкладке, а секция отбирает карточки заранее (см. TariffsSection).
   * null сюда попасть не должен — проверка ниже лишь страховка.
   */
  const showContract = mode === "contract";
  const amount = showContract ? activePrice.contract : activePrice.noContract;
  if (amount === null) return null;

  const caption = showContract ? activePrice.contractLabel : noContractLabel;
  // Выгоду можно посчитать, только если у тарифа есть обе цены.
  const saving =
    showContract && activePrice.contract !== null && activePrice.noContract !== null
      ? toNumber(activePrice.noContract) - toNumber(activePrice.contract)
      : 0;

  return (
    <article className={"tcard" + (recommended ? " is-popular" : "")}>
      {badge && recommended && <span className="tcard-pill">{badge}</span>}

      <h3 className="tcard-name">{name}</h3>
      {badge && !recommended && <span className="tcard-chip">{badge}</span>}
      <p className="tcard-headline">{boldNumbers(activeHeadline)}</p>

      {simVariants && simVariants.length > 1 && (
        <div className="tcard-sim" role="group" aria-label={name}>
          {simVariants.map((v) => (
            <button
              key={v.id}
              type="button"
              className={"tcard-sim-btn" + (v.id === simId ? " is-active" : "")}
              aria-pressed={v.id === simId}
              onClick={() => setSimId(v.id)}
            >
              {v.label}
            </button>
          ))}
        </div>
      )}

      {/* key заставляет цену перерисоваться при смене режима — иначе
          подмена суммы проходит незаметно. */}
      <div className="tcard-price" key={amount}>
        <span className="tcard-price-num">{amount}</span>
        <span className="tcard-price-cur">{currency}</span>
      </div>
      <div className="tcard-per">{perMonthShort}</div>

      {services.length > 0 && (
        <ServiceBlocks services={services} moreLabel={detailsMore} lessLabel={detailsLess} />
      )}

      {features.length > 0 && (
        <ul className="tcard-features">
          {features.map((f) => (
            <li key={f}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M3 8.5 L6.3 11.8 L13 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {f}
            </li>
          ))}
        </ul>
      )}

      {showContract && saving > 0 && (
        <span className="tcard-saving">
          −{saving.toLocaleString("ru-RU")} {currency} {savingLabel}
        </span>
      )}
      {caption && <p className="tcard-caption">{caption}</p>}

      {activePrice.extra.length > 0 && (
        <ul className="tcard-extra">
          {activePrice.extra.map((d) => (
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

        <button
          className="tcard-btn"
          onClick={() => onSelect({ slug, mode, sim: simId })}
        >
          {connectLabel}
        </button>
      </div>
    </article>
  );
}
