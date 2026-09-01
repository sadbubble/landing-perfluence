import { useEffect, useRef, useState } from "react";
import { useLang } from "../hooks/useLang";
import { useReveal } from "../hooks/useReveal";
import { content as ru } from "../content/ru";
import { content as kk } from "../content/kk";
import Header from "../components/Header";
import Hero from "../components/Hero";
import TariffsSection from "../components/TariffsSection";
import HowItWorks from "../components/HowItWorks";
import PageBackground from "../components/PageBackground";
import LeadForm from "../components/LeadForm";
import CtaBanner from "../components/CtaBanner";
import Modal from "../components/Modal";
import Footer from "../components/Footer";
import type { FormData } from "../components/LeadForm";
import ThemePicker from "../components/ThemePicker";
import { captureAttribution, type Attribution } from "../lib/dealer";
import { submitLead } from "../lib/api";
import { applyTheme, readTheme, isPickerEnabled, type ThemeId } from "../lib/theme";

const contentMap = { ru, kk };

export default function Landing() {
  const { lang, setLang } = useLang();
  const c = contentMap[lang];

  const [selectedTariff, setSelectedTariff] = useState<string>("");
  const [formOpen, setFormOpen] = useState(false);

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
   * Атрибуция дилера (ТЗ п.5). Считывается один раз при монтировании и
   * дальше не меняется: код нужен ровно в момент отправки формы, а между
   * этими событиями пользователь мог уйти на /privacy и вернуться.
   *
   * Держим в ref, а не в state: перерисовывать лендинг из-за этого незачем.
   */
  const attribution = useRef<Attribution | null>(null);
  useEffect(() => {
    attribution.current = captureAttribution();
  }, []);

  /**
   * Форма открывается модальным окном, а не прокруткой к секции: секции с
   * формой на странице больше нет, вместо неё нижний баннер. Фокус в первое
   * поле ставит само окно.
   */
  function openForm() {
    setFormOpen(true);
  }

  function scrollToTariffs() {
    document.getElementById("tariffs")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleTariffSelect(slug: string) {
    setSelectedTariff(slug);
    openForm();
  }

  /**
   * Отправка заявки. Ошибку намеренно пробрасываем наверх: LeadForm по ней
   * показывает сообщение и разблокирует кнопку. Проглотить её здесь значило
   * бы показать «спасибо» на заявке, которой в базе нет.
   */
  async function handleSubmit(data: FormData) {
    await submitLead(
      {
        phone: data.phone,
        fullName: data.fullName,
        address: data.address,
        tariffSlug: data.tariff || null,
        comment: data.comment,
        consent: data.consent,
        company: data.company,
      },
      attribution.current ?? {
        dealerCode: null, utmSource: null, utmMedium: null, utmCampaign: null,
      },
      lang,
    );
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

      <Modal open={formOpen} onClose={() => setFormOpen(false)} closeLabel={c.closeLabel}>
        <LeadForm
          title={c.formTitle}
          subtitle={c.formSubtitle}
          labelPhone={c.labelPhone}
          placeholderPhone={c.placeholderPhone}
          labelName={c.labelName}
          placeholderName={c.placeholderName}
          labelAddress={c.labelAddress}
          placeholderAddress={c.placeholderAddress}
          labelTariff={c.labelTariff}
          placeholderTariff={c.placeholderTariff}
          labelComment={c.labelComment}
          placeholderComment={c.placeholderComment}
          consentText={c.consentText}
          consentLink={c.consentLink}
          privacyPath={c.privacyPath}
          submitLabel={c.submitLabel}
          submittingLabel={c.submittingLabel}
          successTitle={c.successTitle}
          successText={c.successText}
          errorRequired={c.errorRequired}
          errorPhone={c.errorPhone}
          errorConsent={c.errorConsent}
          errorSubmit={c.errorSubmit}
          resetLabel={c.resetLabel}
          chosenTariffLabel={c.chosenTariffLabel}
          changeTariffLabel={c.changeTariffLabel}
          tariffs={c.tariffs}
          selectedTariffSlug={selectedTariff}
          onSubmit={handleSubmit}
        />
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
