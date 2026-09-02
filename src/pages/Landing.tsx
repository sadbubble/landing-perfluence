import { useState } from "react";
import { useLang } from "../hooks/useLang";
import { useReveal } from "../hooks/useReveal";
import { content as ru } from "../content/ru";
import { content as kk } from "../content/kk";
import Header from "../components/Header";
import Hero from "../components/Hero";
import TariffsSection from "../components/TariffsSection";
import HowItWorks from "../components/HowItWorks";
import PageBackground from "../components/PageBackground";
import CtaBanner from "../components/CtaBanner";
import Footer from "../components/Footer";
import ThemePicker from "../components/ThemePicker";
import { captureAttribution, type Attribution } from "../lib/dealer";
import { buildFormUrl, resolveProduct, type TariffSelection } from "../lib/qbox";
import { applyTheme, readTheme, isPickerEnabled, type ThemeId } from "../lib/theme";

const contentMap = { ru, kk };

export default function Landing() {
  const { lang, setLang } = useLang();
  const c = contentMap[lang];

  // Оформление применяется до первой отрисовки, чтобы не мигнуть исходной
  // палитрой при открытии ссылки на конкретный вариант.
  const [theme] = useState<ThemeId>(() => {
    const t = readTheme();
    applyTheme(t);
    return t;
  });
  const showPicker = isPickerEnabled();

  // Пересобираем список блоков при смене языка: секции перерисовываются
  useReveal([lang]);

  /**
   * Менеджер, по чьей ссылке пришёл посетитель (ТЗ п.5).
   *
   * Считывается лениво при первой отрисовке, а не в useEffect: раньше форма
   * открывалась окном и до отправки проходили секунды, теперь же кнопка
   * уводит на другой сайт сразу. Эффект успел бы отработать и так, но при
   * таком сценарии зависеть от этого незачем — код нужен ровно в момент
   * первого клика.
   */
  const [attribution] = useState<Attribution>(() => captureAttribution());

  /**
   * Уход на форму Qbox.
   *
   * Заявку лендинг больше не отправляет сам: человек уходит на форму Qbox,
   * а менеджер и тариф едут туда параметрами адреса. Из-за этого отпали
   * CORS, ключ доступа в коде страницы и обработчик на сервере КТ —
   * подробности в src/lib/qbox.ts.
   *
   * Наша форма (Modal + LeadForm) из цепочки убрана, но не удалена: вопрос
   * о том, чью форму дорабатывать, ещё открыт.
   */
  function goToForm(product: string | null) {
    const url = buildFormUrl(product, attribution.dealerCode);

    /*
     * Крючок для проверки привязки, только в режиме разработки — в сборку
     * не попадает, `import.meta.env.DEV` вырезается при минификации.
     *
     * Без него проверить, что кнопка отправляет тот тариф, на который нажали,
     * можно лишь уйдя на сайт Qbox — то есть потеряв страницу и вместе с ней
     * возможность посмотреть результат. А ошибка тут самая дорогая из
     * возможных: заявка молча уедет не на того менеджера или не с тем тарифом,
     * и всплывёт это только при расчёте с дилерами в конце месяца.
     */
    if (import.meta.env.DEV) {
      console.info("Qbox →", url);
      const hook = (window as unknown as Record<string, unknown>).__qboxHook;
      if (typeof hook === "function") {
        (hook as (u: string) => void)(url);
        return;
      }
    }

    window.location.href = url;
  }

  /** Кнопки без тарифа: шапка, верхний баннер, нижний баннер. */
  function openForm() {
    goToForm(null);
  }

  /** Кнопка на карточке: тариф, режим цены и число SIM уже известны. */
  function handleTariffSelect(sel: TariffSelection) {
    goToForm(resolveProduct(sel));
  }

  function scrollToTariffs() {
    document.getElementById("tariffs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <PageBackground />

      <Header
        langRu={c.langRu}
        langKz={c.langKz}
        lang={lang}
        ctaLabel={c.heroCtaLabel}
        onCta={openForm}
        onLangChange={setLang}
      />

      <main>
        <Hero
          title={c.heroTitle}
          subtitle={c.heroSubtitle}
          ctaLabel={c.heroCtaLabel}
          secondaryCtaLabel={c.heroSecondaryCtaLabel}
          imageAlt={c.heroImageAlt}
          highlights={c.heroHighlights}
          scrollHint={c.heroScrollHint}
          onCta={openForm}
          onSecondaryCta={scrollToTariffs}
        />

        <TariffsSection
          title={c.tariffsTitle}
          tariffs={c.tariffs}
          connectLabel={c.connectLabel}
          currency={c.currency}
          perMonthShort={c.perMonthShort}
          toggleContract={c.toggleContract}
          toggleNoContract={c.toggleNoContract}
          savingLabel={c.savingLabel}
          priceModeHint={c.priceModeHint}
          onSelect={handleTariffSelect}
        />

        <HowItWorks title={c.howTitle} subtitle={c.howSubtitle} steps={c.steps} />

        <CtaBanner
          title={c.ctaTitle}
          accent={c.ctaAccent}
          note={c.ctaNote}
          buttonLabel={c.ctaButton}
          onCta={openForm}
        />
      </main>

      {showPicker && <ThemePicker current={theme} />}

      <Footer
        company={c.footerCompany}
        partnerBadge={c.partnerBadge}
        privacyLabel={c.footerPrivacy}
        privacyPath={c.privacyPath}
      />
    </div>
  );
}
