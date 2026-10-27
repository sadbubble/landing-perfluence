<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import { useLang } from "./composables/useLang";
import { useReveal } from "./composables/useReveal";
import { content as ru } from "./content/ru";
import { content as kk } from "./content/kk";
import SiteHeader from "./components/SiteHeader.vue";
import HeroBanner from "./components/HeroBanner.vue";
import TariffsSection from "./components/TariffsSection.vue";
import HowItWorks from "./components/HowItWorks.vue";
import PageBackground from "./components/PageBackground.vue";
import CtaBanner from "./components/CtaBanner.vue";
import ModalDialog from "./components/ModalDialog.vue";
import SiteFooter from "./components/SiteFooter.vue";
import { captureAttribution } from "./lib/dealer";
import { buildEmbedUrl, buildFormUrl, canEmbedForm, resolveProduct, type TariffSelection } from "./lib/qbox";

const contentMap = { ru, kk };

const { lang, setLang } = useLang();
const c = computed(() => contentMap[lang.value]);

// Пересобираем список блоков при смене языка: секции перерисовываются
useReveal(lang);

// Заголовок вкладки на языке страницы: раньше он всегда оставался русским.
watchEffect(() => {
  document.title = c.value.pageTitle;
});

/**
 * Менеджер, по чьей ссылке пришёл посетитель (ТЗ п.5). Считывается один
 * раз при старте: код нужен ровно в момент первого нажатия на кнопку.
 */
const attribution = captureAttribution();

/**
 * Форма Qbox открывается рамкой прямо на странице — человек с лендинга
 * не уходит, и параметры в адресной строке не мелькают. Здесь лежат её
 * адрес и заголовок окна, пока окно открыто; null — окно закрыто.
 */
const form = ref<{ embed: string; title: string } | null>(null);

/**
 * Открыть форму Qbox.
 *
 * Заявку лендинг не отправляет сам: её принимает форма Qbox, а менеджер и
 * тариф едут туда параметрами адреса. Из-за этого отпали CORS, ключ
 * доступа в коде страницы и обработчик на сервере КТ — подробности
 * в src/lib/qbox.ts.
 *
 * Способов два, и выбор не косметический. Qbox разрешает показывать форму
 * в рамке только с перечисленных у него доменов: telecom.kz там есть, а
 * витрина на Vercel и тестовые стенды — нет, и на них рамка была бы пустой.
 * Поэтому там, где встраивание запрещено, кнопка честно уводит на форму
 * переходом: заявка доедет одинаково, разница только в удобстве.
 */
function goToForm(product: string | null, title: string) {
  const manager = attribution.dealerCode;

  if (canEmbedForm()) {
    form.value = {
      embed: buildEmbedUrl(product, manager, lang.value),
      title,
    };
    return;
  }

  const url = buildFormUrl(product, manager, lang.value);

  /*
   * Крючок для проверки привязки на запасном пути, только в режиме
   * разработки — в сборку не попадает. Без него проверить, какой тариф
   * уходит, можно лишь покинув страницу. Ошибка тут самая дорогая из
   * возможных: заявка молча уедет не на того менеджера, и всплывёт это
   * только при расчёте с дилерами в конце месяца.
   */
  if (import.meta.env.DEV) {
    /*
     * Объясняем, почему форма открылась переходом, а не окном. Симптом
     * выглядит поломкой, а причина невидима: чаще всего страницу открыли
     * по 127.0.0.1 или по адресу в локальной сети вместо localhost.
     * Для Qbox это разные домены, и рамку он на них не разрешает.
     */
    console.warn(
      `Форма откроется переходом: ${window.location.origin} не в списке ` +
        "доменов, которым Qbox разрешает встраивание. Откройте страницу " +
        "по http://localhost:8080 — см. EMBED_ALLOWED_ORIGINS в lib/qbox.ts.",
    );
    console.info("Qbox →", url);
    const hook = (window as unknown as Record<string, unknown>).__qboxHook;
    if (typeof hook === "function") {
      (hook as (u: string) => void)(url);
      return;
    }
  }

  window.location.href = url;
}

/** Кнопка нижнего баннера: форма без тарифа, в шапке окна «Оставить заявку». */
function openForm() {
  goToForm(null, c.value.formTitle);
}

/**
 * Кнопка на карточке: тариф, режим цены и число SIM уже известны. В шапке
 * окна — название выбранного тарифа, как на сайте Казахтелекома.
 */
function handleTariffSelect(sel: TariffSelection) {
  goToForm(resolveProduct(sel), sel.title ?? c.value.formTitle);
}

/**
 * Переход к выбору тарифа.
 *
 * Сюда ведут кнопки в шапке и в верхнем баннере. Раньше они открывали
 * форму сразу, и заявка уходила без тарифа: человек до карточек не дошёл
 * и ничего не выбирал. Теперь он сначала выбирает, а форма открывается
 * уже с готовым тарифом.
 *
 * Кнопка нижнего баннера намеренно осталась прежней — она открывает форму
 * без тарифа. Это путь для тех, кто тарифы смотреть не хочет: баннер прямо
 * обещает «перезвоним и подскажем», и отправлять таких людей обратно
 * к карточкам значило бы не выполнить обещание.
 */
function scrollToTariffs() {
  const section = document.getElementById("tariffs");
  if (!section) return;

  section.scrollIntoView({ behavior: "smooth", block: "start" });

  /*
   * Короткая подсветка секции. Нужна не для красоты: с кнопки в шапке
   * тарифы часто уже на экране, прокрутка получается нулевой, и нажатие
   * выглядит так, будто кнопка сломана.
   *
   * Класс снимается и ставится заново, между этим читается offsetWidth —
   * без принудительного пересчёта раскладки браузер не заметит, что класс
   * убирали, и анимация не перезапустится при повторном нажатии.
   */
  section.classList.remove("is-called");
  void section.offsetWidth;
  section.classList.add("is-called");
  window.setTimeout(() => section.classList.remove("is-called"), 1400);
}
</script>

<template>
  <div :style="{ minHeight: '100vh' }">
    <PageBackground />

    <SiteHeader
      :lang-ru="c.langRu"
      :lang-kz="c.langKz"
      :lang="lang"
      :cta-label="c.chooseTariffLabel"
      @cta="scrollToTariffs"
      @lang-change="setLang"
    />

    <main>
      <HeroBanner
        :partner-label="c.partnerLabel"
        :logo-alt="c.ktLogoAlt"
        :title="c.heroTitle"
        :subtitle="c.heroSubtitle"
        :cta-label="c.chooseTariffLabel"
        :image-alt="c.heroImageAlt"
        :highlights="c.heroHighlights"
        :scroll-hint="c.heroScrollHint"
        @cta="scrollToTariffs"
      />

      <TariffsSection
        :title="c.tariffsTitle"
        :tariffs="c.tariffs"
        :connect-label="c.connectLabel"
        :currency="c.currency"
        :per-month-short="c.perMonthShort"
        :toggle-contract="c.toggleContract"
        :toggle-no-contract="c.toggleNoContract"
        :saving-label="c.savingLabel"
        :price-mode-hint="c.priceModeHint"
        :rent-label="c.rentLabel"
        :rent-note="c.rentNote"
        :details-more="c.detailsMore"
        :details-less="c.detailsLess"
        @select="handleTariffSelect"
      />

      <HowItWorks :title="c.howTitle" :subtitle="c.howSubtitle" :steps="c.steps" />

      <CtaBanner
        :title="c.ctaTitle"
        :accent="c.ctaAccent"
        :note="c.ctaNote"
        :button-label="c.ctaButton"
        @cta="openForm"
      />
    </main>

    <!-- В шапке окна — выбранный тариф (или «Оставить заявку» с нижнего
         баннера): так же, как в окнах заявки на сайте Казахтелекома. -->
    <ModalDialog
      :open="form !== null"
      :title="form?.title ?? c.formTitle"
      :close-label="c.closeLabel"
      @close="form = null"
    >
      <!--
        Форма Qbox чужая и живёт на их домене, поэтому здесь рамка, а не
        наша разметка. Из этого следуют два ограничения, которые починить
        с нашей стороны нельзя:
          • Esc не закрывает окно, пока курсор внутри формы — события
            клавиатуры остаются в чужой рамке и до нас не доходят;
          • Tab выводит фокус из окна на страницу — ловушка фокуса
            не видит содержимое чужого домена.
        Крестик и клик по затемнению работают всегда.

        sandbox намеренно не ставим. В коде, присланном из Qbox, его нет, а
        проверить, не ломает ли он отрисовку формы, мы не можем: содержимое
        чужой рамки нам не видно. Домен доверенный — свой же у заказчика.
      -->
      <!-- Как заголовок формы в окнах КТ. Наш, потому что у нашей формы в
           Qbox заголовок не показывается. -->
      <p class="qbox-lead">{{ c.formLead }}</p>
      <iframe v-if="form" class="qbox-frame" :src="form.embed" :title="form.title" />
      <!--
        Запасной ссылки «Форма не загрузилась? Откройте её отдельно» здесь
        больше нет — убрана по слову заказчика (23.10.2026). Если форма в
        рамке не загрузится (сайт запретит встраивание, браузер запретит
        форме хранить данные), у человека остаётся только крестик. Вернуть:
        buildFormUrl() даёт тот же адрес без embed=true, разметка — в
        истории git (коммит ac8c4c7).
      -->
    </ModalDialog>

    <SiteFooter
      :company="c.footerCompany"
      :partner-badge="c.partnerBadge"
      :info="{
        rent: c.footerRent,
        btsTitle: c.footerBtsTitle,
        btsItems: c.footerBtsItems,
        licensesTitle: c.footerLicensesTitle,
        licenses: c.footerLicenses,
        offerBefore: c.footerOfferBefore,
        offerLink: c.footerOfferLink,
        offerAfter: c.footerOfferAfter,
        offerUrl: c.footerOfferUrl,
        aiNote: c.footerAiNote,
        copyright: c.footerCopyright,
      }"
    />
  </div>
</template>
