export const content = {
  partnerBadge: "АО «Қазақтелеком»-ның ресми серіктесі",
  partnerLabel: "Ресми серіктес",
  ktLogoAlt: "Қазақтелеком",
  langRu: "RU",
  langKz: "KZ",

  pageTitle: "Интернет және ТВ қосу — АО «Қазақтелеком»-ның ресми серіктесі",

  heroTitle: "Қазақтелекомнан үй интернеті, ТВ және SIM-карта",
  heroSubtitle:
    "Ыңғайлы уақытта жылдам қосылу. Қазақстанның ең ірі операторының сенімді желісі — сіздің үйіңізде.",
  heroCtaLabel: "Өтінім қалдыру",
  heroSecondaryCtaLabel: "Тарифтерді көру",
  heroHighlights: [
    "1–2 күнде қосу",
    "Қазақтелеком желісі",
    "Жасырын төлемдерсіз",
  ],
  chooseTariffLabel: "Тарифті таңдау",
  heroScrollHint: "Тарифтерге өту",
  heroImageAlt: "Үй интернеті иллюстрациясы",
  heroImageCaption: "Иллюстрация үшін орын",

  tariffsTitle: "Тарифті таңдаңыз",
  perMonth: "₸/ай",
  currency: "₸",
  perMonthShort: "/ай",
  // Мягкий перенос (­): на телефоне кнопка в карточке уже слова, и без
  // него карточка распиралась шире экрана. Переносится, только если не влезает.
  toggleContract: "Келісім­шартпен",
  toggleNoContract: "Келісім­шартсыз",
  savingLabel: "үнемдеу",
  priceModeHint: "Келісімшарт айлық төлемді азайтады",
  detailsMore: "Толығырақ",
  detailsLess: "Жасыру",

  tariffs: [
    {
      slug: "internet-200",
      group: null,
      headline: "200 Мбит/с дейін",
      tagline: "Үй мен оқуға",
      name: "Интернет 200",
      services: [
        { icon: "internet", title: "Үй интернеті", summary: "200 Мбит/с дейін", facts: [], details: [] },
      ],
      price: {
        contract: null,
        noContract: "7 999",
        contractLabel: null,
        extra: [],
      },
      simVariants: null,
      badge: null,
      recommended: false,
    },
    {
      slug: "internet-500",
      group: null,
      headline: "500 Мбит/с дейін",
      tagline: "Жылдамдық қажет болғандарға",
      name: "Интернет 500",
      services: [
        { icon: "internet", title: "Үй интернеті", summary: "500 Мбит/с дейін", facts: [], details: [] },
      ],
      price: {
        contract: "9 320",
        noContract: "9 999",
        contractLabel: "1 жылға келісімшарт",
        extra: [],
      },
      simVariants: null,
      badge: null,
      recommended: false,
    },
    {
      slug: "keremet-tv-promo",
      group: "keremet",
      headline: "200 Мбит/с дейін + ТВ",
      tagline: "Кино мен ТВ сүйетіндерге",
      name: "Keremet TV PROMO",
      services: [
        { icon: "internet", title: "Үй интернеті", summary: "200 Мбит/с", facts: [], details: [] },
        { icon: "tv", title: "ТВ", summary: "160+ арна · 7 онлайн-кинотеатр", facts: [], details: [] },
      ],
      price: {
        contract: "5 699",
        noContract: null,
        contractLabel: "1 жылға келісімшарт",
        extra: ["Акция бағасы 1 жыл бойы жарамды"],
      },
      simVariants: null,
      badge: "Акция",
      recommended: true,
    },
    {
      slug: "keremet-tv-2026",
      group: "keremet",
      headline: "300 Мбит/с дейін + ТВ",
      tagline: "Кино мен ТВ сүйетіндерге",
      name: "Keremet TV 2026",
      services: [
        { icon: "internet", title: "Үй интернеті", summary: "300 Мбит/с дейін", facts: [], details: [] },
        { icon: "tv", title: "ТВ", summary: "160+ арна · 7 онлайн-кинотеатр", facts: [], details: [] },
      ],
      price: {
        contract: null,
        noContract: "8 999",
        contractLabel: null,
        extra: [],
      },
      simVariants: null,
      badge: null,
      recommended: false,
    },
    {
      slug: "bereket",
      group: null,
      headline: "интернет + ТВ + ұялы байланыс",
      tagline: "Отбасыға — бәрі бір жерде",
      name: "Bereket",
      // Bereket-тің құрамы SIM нұсқасына қарай әртүрлі — simVariants қараңыз.
      services: null,
      price: {
        contract: "12 999",
        noContract: "13 999",
        contractLabel: "3 жылға келісімшарт",
        extra: [],
      },
      simVariants: [
        {
          id: "2sim",
          label: "2 SIM",
          headline: "500 Мбит/с дейін + ТВ +\u00a02\u00a0SIM",
          services: [
            {
              icon: "internet",
              title: "Үй интернеті",
              summary: "500 Мбит/с дейін",
              facts: [],
              details: [],
            },
            {
              icon: "tv",
              title: "TV+ Full",
              summary: "160+ арна · 8 онлайн-кинотеатр",
              facts: [],
              details: [],
            },
            {
              icon: "mobile",
              title: "Altel/Activ ұялы байланысы",
              summary: "2 SIM, әрқайсысында:",
              facts: [
                { value: "60 ГБ", label: "интернет-трафик" },
                { value: "∞ мин", label: "желі ішінде" },
                { value: "250 мин", label: "басқа операторлар мен қалалық нөмірлерге" },
              ],
              details: [
                "60 ГБ-тан кейін жылдамдық 512 Кбит/с-қа дейін төмендейді",
                "Әр нөмірге TV+ жазылымы, мобильді трафик есептелмейді",
              ],
            },
          ],
          price: {
            contract: "12 999",
            noContract: "13 999",
            contractLabel: "3 жылға келісімшарт",
            extra: [],
          },
        },
        {
          id: "4sim",
          label: "4 SIM",
          headline: "500 Мбит/с дейін + ТВ +\u00a04\u00a0SIM",
          services: [
            {
              icon: "internet",
              title: "Үй интернеті",
              summary: "500 Мбит/с дейін",
              facts: [],
              details: [],
            },
            {
              icon: "tv",
              title: "TV+ Full",
              summary: "160+ арна · 8 онлайн-кинотеатр",
              facts: [],
              details: [],
            },
            {
              icon: "mobile",
              title: "Altel/Activ ұялы байланысы",
              summary: "4 SIM, әрқайсысында:",
              facts: [
                { value: "60 ГБ", label: "интернет-трафик" },
                { value: "∞ мин", label: "желі ішінде" },
                { value: "250 мин", label: "басқа операторлар мен қалалық нөмірлерге" },
              ],
              details: [
                "60 ГБ-тан кейін жылдамдық 512 Кбит/с-қа дейін төмендейді",
                "Әр нөмірге TV+ жазылымы, мобильді трафик есептелмейді",
              ],
            },
          ],
          price: {
            contract: "16 999",
            noContract: "17 999",
            contractLabel: "3 жылға келісімшарт",
            extra: [],
          },
        },
      ],
      badge: "Барлығы қосылған",
      recommended: false,
    },
  ],

  connectLabel: "Қосу",

  howTitle: "Қалай қосуға болады",
  howSubtitle: "Үш қарапайым қадам — және сіз желідесіз.",
  steps: [
    {
      number: "1",
      image: "/step-form.png",
      title: "Өтінім қалдырыңыз",
      description:
        "Төмендегі форманы толтырыңыз — бұл екі минуттан аспайды.",
    },
    {
      number: "2",
      image: "/step-call.png",
      title: "Біз қоңырау шалып, мекенжайды нақтылаймыз",
      description:
        "Менеджер жұмыс күні ішінде сізбен хабарласып, мәліметтерді келіседі.",
    },
    {
      number: "3",
      image: "/step-install.png",
      title: "Ыңғайлы уақытта қосамыз",
      description:
        "Техник маман келісілген уақытта келеді. Қосылу тегін.",
    },
  ],

  benefitsTitle: "Неліктен бізден қосады",
  benefitsSubtitle: "Рәсімдеу мен қосуды өзімізге аламыз.",
  benefits: [
    {
      icon: "install",
      image: "/benefit-fast.png",
      metric: "1–2",
      metricUnit: "күн",
      title: "Жылдам қосу",
      text: "Мекенжайды тексеріп, демалыс күндерін қоса, ыңғайлы уақытта келеміз.",
    },
    {
      icon: "wallet",
      image: "/benefit-price.png",
      metric: "0 ₸",
      metricUnit: "қосу үшін",
      title: "Жасырын төлемдерсіз",
      text: "Сайттағы баға түпкілікті. Таңылған қызметтер жоқ.",
    },
  ],

  ctaTitle: "Сұрақтарыңыз бар ма?",
  ctaAccent: "Қоңырау шалып көмектесеміз",
  ctaNote: "Жұмыс күні ішінде жауап береміз",
  ctaButton: "Өтінім қалдыру",
  closeLabel: "Жабу",
  formTitle: "Өтінім қалдыру",
  formFallbackLead: "Форма жүктелмеді ме?",
  formFallbackLink: "Оны бөлек ашыңыз",
  formSubtitle:
    "Форманы толтырыңыз — біз сізбен хабарласып, қосылуды рәсімдейміз.",
  labelPhone: "Ұялы телефон нөмірі",
  placeholderPhone: "+7 (___) ___-__-__",
  labelName: "Аты-жөні",
  placeholderName: "Иванов Иван Иванович",
  labelAddress: "Қосылу мекенжайы",
  placeholderAddress: "Қала, көше, үй, пәтер",
  labelTariff: "Таңдалған тариф",
  placeholderTariff: "Тарифті таңдаңыз",
  labelComment: "Пікір",
  placeholderComment: "Қосымша тілектер (міндетті емес)",
  consentText: "Мен ",
  consentLink: "дербес деректерді өңдеуге келісемін",
  submitLabel: "Өтінімді жіберу",
  submittingLabel: "Жіберілуде...",
  successTitle: "Рахмет!",
  successText:
    "Менеджер жұмыс күні ішінде сізбен хабарласады.",

  errorRequired: "Бұл өріс міндетті",
  errorPhone: "Дұрыс қазақстандық нөмір енгізіңіз (+7 7XX XXX XX XX)",
  errorConsent: "Келісім беру қажет",
  errorSubmit: "Өтінімді жіберу мүмкін болмады. Қайтадан көріңіз немесе бізге қоңырау шалыңыз.",
  resetLabel: "Тағы бір өтінім жіберу",
  chosenTariffLabel: "Таңдалған тариф",
  changeTariffLabel: "Өзгерту",

  footerCompany: "«Perfluence» ЖШС",
};

export type TariffSlug = "internet-200" | "internet-500" | "keremet-tv-promo" | "bereket";

export interface Tariff {
  slug: string;
  name: string;
  description: string | null;
  descriptionList: string[] | null;
  priceMain: string;
  priceDetails: string[];
  badge: string | null;
  recommended: boolean;
}
