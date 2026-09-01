export const content = {
  partnerBadge: "АО «Қазақтелеком»-ның ресми серіктесі",
  langRu: "RU",
  langKz: "KZ",

  heroTitle: "Қазақтелекомнан үй интернеті және теледидар",
  heroSubtitle:
    "Ыңғайлы уақытта жылдам қосылу. Қазақстанның ең ірі операторының сенімді желісі — сіздің үйіңізде.",
  heroCtaLabel: "Өтінім қалдыру",
  heroSecondaryCtaLabel: "Тарифтерді көру",
  heroHighlights: [
    "1–2 күнде қосу",
    "Қазақтелеком желісі",
    "Жасырын төлемдерсіз",
  ],
  heroScrollHint: "Тарифтерге өту",
  heroImageAlt: "Үй интернеті иллюстрациясы",
  heroImageCaption: "Иллюстрация үшін орын",

  tariffsTitle: "Тарифті таңдаңыз",
  perMonth: "₸/ай",
  currency: "₸",
  perMonthShort: "/ай",
  toggleContract: "Келісімшартпен",
  toggleNoContract: "Келісімшартсыз",
  savingLabel: "үнемдеу",
  priceModeHint: "Келісімшарт айлық төлемді азайтады",

  tariffs: [
    {
      slug: "internet-200",
      headline: "200 Мбит/с дейін",
      tagline: "Үй мен оқуға",
      name: "Интернет 200",
      description: "200 Мбит/с дейінгі жылдамдықтағы үй интернеті.",
      descriptionList: null,
      price: {
        contract: "7 249",
        noContract: "7 999",
        contractLabel: "1 жылға келісімшарт",
        extra: [],
      },
      badge: null,
      recommended: false,
    },
    {
      slug: "internet-500",
      headline: "500 Мбит/с дейін",
      tagline: "Жылдамдық қажет болғандарға",
      name: "Интернет 500",
      description: "500 Мбит/с дейінгі жылдамдықтағы үй интернеті.",
      descriptionList: null,
      price: {
        contract: "9 320",
        noContract: "9 999",
        contractLabel: "1 жылға келісімшарт",
        extra: [],
      },
      badge: null,
      recommended: false,
    },
    {
      slug: "keremet-tv-promo",
      headline: "200 Мбит/с + ТВ",
      tagline: "Кино мен ТВ сүйетіндерге",
      name: "Keremet TV PROMO",
      description:
        "200 Мбит/с интернет + 160-тан астам арна ТВ + 7 онлайн-кинотеатр.",
      descriptionList: null,
      price: {
        contract: null,
        noContract: "5 699",
        contractLabel: null,
        extra: ["Акция бағасы 1 жыл бойы жарамды"],
      },
      badge: "Акция",
      recommended: true,
    },
    {
      slug: "bereket",
      headline: "интернет + ТВ + 2 SIM",
      tagline: "Отбасыға — бәрі бір жерде",
      name: "Bereket",
      description: null,
      descriptionList: [
        "2 SIM: интернет + ТВ + ұялы байланыс",
        "4 SIM: 500 Мбит/с дейін + TV+ Full + 4 SIM ұялы байланыс",
      ],
      price: {
        contract: "12 999",
        noContract: "13 999",
        contractLabel: "3 жылға келісімшарт, 2 SIM",
        extra: ["4 SIM: келісімшартпен 16 999 ₸, келісімшартсыз 17 999 ₸"],
      },
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
  privacyPath: "/privacy",
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
  footerPrivacy: "Дербес деректерді өңдеу саясаты",
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
