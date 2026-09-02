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
              onClick={() => setMode("contract")}
            >
              {toggleContract}
            </button>
            <button
              className={"price-toggle-btn" + (mode === "noContract" ? " is-active" : "")}
              aria-pressed={mode === "noContract"}
              onClick={() => setMode("noContract")}
            >
              {toggleNoContract}
            </button>
          </div>
          <p className="price-toggle-hint">{priceModeHint}</p>
        </div>

        <div className="tariffs-grid">
          {tariffs.map((tariff, i) => (
            <div className="reveal" style={{ transitionDelay: `${i * 70}ms` }} key={tariff.slug}>
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
