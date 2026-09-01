import { useState } from "react";
import { useLang } from "./hooks/useLang";
import { content as ru } from "./content/ru";
import { content as kk } from "./content/kk";
import Header from "./components/Header";
import Hero from "./components/Hero";
import TariffsSection from "./components/TariffsSection";
import HowItWorks from "./components/HowItWorks";
import LeadForm from "./components/LeadForm";
import Footer from "./components/Footer";
import type { FormData } from "./components/LeadForm";

const contentMap = { ru, kk };

export default function App() {
  const { lang, setLang } = useLang();
  const c = contentMap[lang];

  const [selectedTariff, setSelectedTariff] = useState<string>("");

  function scrollToForm() {
    const el = document.getElementById("lead-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // Focus phone input after scroll animation (~600ms)
      setTimeout(() => {
        const phone = document.getElementById("phone") as HTMLInputElement | null;
        phone?.focus();
      }, 650);
    }
  }

  function handleTariffSelect(slug: string) {
    setSelectedTariff(slug);
    setTimeout(scrollToForm, 50);
  }

  async function handleSubmit(data: FormData) {
    // Backend integration point — wire up here
    console.log("Lead form submitted:", data);
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Header
        partnerBadge={c.partnerBadge}
        langRu={c.langRu}
        langKz={c.langKz}
        lang={lang}
        onLangChange={setLang}
      />

      <main>
        <Hero
          title={c.heroTitle}
          subtitle={c.heroSubtitle}
          ctaLabel={c.heroCtaLabel}
          imageAlt={c.heroImageAlt}
          imageCaption={c.heroImageCaption}
          onCta={scrollToForm}
        />

        <TariffsSection
          title={c.tariffsTitle}
          subtitle={c.tariffsSubtitle}
          tariffs={c.tariffs}
          connectLabel={c.connectLabel}
          onSelect={handleTariffSelect}
        />

        <HowItWorks
          title={c.howTitle}
          subtitle={c.howSubtitle}
          steps={c.steps}
        />

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
          tariffs={c.tariffs}
          selectedTariffSlug={selectedTariff}
          onSubmit={handleSubmit}
        />
      </main>

      <Footer
        company={c.footerCompany}
        partnerBadge={c.partnerBadge}
        privacyLabel={c.footerPrivacy}
        privacyPath={c.privacyPath}
        rights={c.footerRights}
      />
    </div>
  );
}
