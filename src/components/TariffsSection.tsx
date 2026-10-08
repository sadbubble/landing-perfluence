import { useState } from "react";
import TariffCard, { type PriceMode } from "./TariffCard";
import type { Tariff } from "../content/ru";
import type { TariffSelection } from "../lib/qbox";

interface TariffsSectionProps {
  title: string;
  tariffs: Tariff[];
  connectLabel: string;
  currency: string;
  perMonthShort: string;
  toggleContract: string;
  toggleNoContract: string;
  savingLabel: string;
  priceModeHint: string;
  onSelect: (sel: TariffSelection) => void;
}

/**
 * Секция тарифов с переключателем «с контрактом / без контракта».
 *
 * Переключатель не украшение: у трёх из четырёх тарифов две разные цены,
 * и раньше обе лежали мелким текстом под карточкой — человек должен был
 * сам сравнивать. Теперь крупная цена меняется, а рядом появляется
 * посчитанная выгода, то есть выбор виден, а не вычисляется.
 */
export default function TariffsSection({
  title,
  tariffs,
  connectLabel,
  currency,
  perMonthShort,
  toggleContract,
  toggleNoContract,
  savingLabel,
  priceModeHint,
  onSelect,
}: TariffsSectionProps) {
  // По умолчанию показываем цену с контрактом: она ниже, и именно её
  // человек видит в рекламе у блогера.
  const [mode, setMode] = useState<PriceMode>("contract");

  /*
   * Переключали ли уже вкладку. Нужно ради анимации появления: скрипт
   * useReveal собирает элементы .reveal один раз при загрузке, и карточка,
   * появившаяся после переключения (Интернет 200, Keremet TV 2026), так и
   * осталась бы с прозрачностью 0. Раз человек нажал переключатель, секцию
   * он уже видит — новые карточки показываем сразу.
   */
  const [switched, setSwitched] = useState(false);
  const choose = (m: PriceMode) => {
    setMode(m);
    setSwitched(true);
  };

  /*
   * На каждой вкладке свой набор: тариф показывается, только если у него
   * есть цена в этом режиме. У Bereket цены лежат в вариантах SIM.
   */
  const visible = tariffs.filter((t) => {
    const prices = t.simVariants ? t.simVariants.map((v) => v.price) : [t.price];
    return prices.some((p) => (mode === "contract" ? p.contract : p.noContract) !== null);
  });

  return (
    <section id="tariffs" className="tariffs">
      <div className="tariffs-inner">
        <div className="tariffs-head reveal">
          <h2>{title}</h2>

          <div
            className="price-toggle"
            role="group"
            aria-label={priceModeHint}
          >
            <button
              className={"price-toggle-btn" + (mode === "contract" ? " is-active" : "")}
              aria-pressed={mode === "contract"}
              onClick={() => choose("contract")}
            >
              {toggleContract}
            </button>
            <button
              className={"price-toggle-btn" + (mode === "noContract" ? " is-active" : "")}
              aria-pressed={mode === "noContract"}
              onClick={() => choose("noContract")}
            >
              {toggleNoContract}
            </button>
          </div>
          <p className="price-toggle-hint">{priceModeHint}</p>
        </div>

        {/* Число карточек в классе: сетка подстраивает колонки под 3 или 4 */}
        <div className={`tariffs-grid is-${visible.length}`}>
          {visible.map((tariff, i) => (
            <div
              className={"reveal" + (switched ? " is-visible" : "")}
              style={{ transitionDelay: switched ? "0ms" : `${i * 70}ms` }}
              key={tariff.slug}
            >
              <TariffCard
                {...tariff}
                mode={mode}
                currency={currency}
                perMonthShort={perMonthShort}
                savingLabel={savingLabel}
                noContractLabel={toggleNoContract}
                connectLabel={connectLabel}
                onSelect={onSelect}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
