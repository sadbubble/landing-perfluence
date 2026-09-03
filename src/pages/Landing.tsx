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
import Modal from "../components/Modal";
import Footer from "../components/Footer";
import ThemePicker from "../components/ThemePicker";
import { captureAttribution, type Attribution } from "../lib/dealer";
import {
  buildEmbedUrl,
  buildFormUrl,
  canEmbedForm,
  resolveProduct,
  type TariffSelection,
} from "../lib/qbox";
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
   * Форма Qbox открывается рамкой прямо на странице — человек с лендинга
   * не уходит, и параметры в адресной строке не мелькают. Здесь лежит её
   * адрес, пока окно открыто; null — окно закрыто.
   */
  const [formUrl, setFormUrl] = useState<string | null>(null);

  /**
   * Открыть форму Qbox.
   *
   * Заявку лендинг не отправляет сам: её принимает форма Qbox, а менеджер и
   * тариф едут туда параметрами адреса. Из-за этого отпали CORS, ключ
   * доступа в коде страницы и обработчик на сервере КТ — подробности
   * в src/lib/qbox.ts.
   *
   * Способов два, и выбор не косметический. Qbox разрешает показывать форму
   * в рамке только с перечисленных у него доменов. Боевой partner.telecom.kz
   * там есть, а витрина на Vercel — нет, и на ней рамка была бы пустой.
   * Поэтому там, где встраивание запрещено, кнопка честно уводит на форму
   * переходом: заявка доедет одинаково, разница только в удобстве.
   */
  function goToForm(product: string | null) {
    const manager = attribution.dealerCode;

    if (canEmbedForm()) {
      setFormUrl(buildEmbedUrl(product, manager));
      return;
    }

    const url = buildFormUrl(product, manager);

    /*
     * Крючок для проверки привязки на запасном пути, только в режиме
     * разработки — в сборку не попадает. Без него проверить, какой тариф
     * уходит, можно лишь покинув страницу. Ошибка тут самая дорогая из
     * возможных: заявка молча уедет не на того менеджера, и всплывёт это
     * только при расчёте с дилерами в конце месяца.
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

      <Modal open={formUrl !== null} onClose={() => setFormUrl(null)} closeLabel={c.closeLabel}>
        <h2 className="qbox-title">{c.formTitle}</h2>
        {/*
          * Форма Qbox чужая и живёт на их домене, поэтому здесь рамка, а не
          * наша разметка. Из этого следуют два ограничения, которые починить
          * с нашей стороны нельзя:
          *   • Esc не закрывает окно, пока курсор внутри формы — события
          *     клавиатуры остаются в чужой рамке и до нас не доходят;
          *   • Tab выводит фокус из окна на страницу — ловушка фокуса
          *     не видит содержимое чужого домена.
          * Крестик и клик по затемнению работают всегда.
          */}
        {formUrl && (
          <iframe
            className="qbox-frame"
            src={formUrl}
            title={c.formTitle}
            /*
              * sandbox намеренно не ставим. В коде, присланном из Qbox, его
              * нет, а проверить, не ломает ли он отрисовку формы, мы не можем:
              * содержимое чужой рамки нам не видно. Домен доверенный — свой же
              * у заказчика, — так что запрет ради запрета тут только риск.
              */
          />
        )}
      </Modal>

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
