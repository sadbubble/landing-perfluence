export const content = {
  partnerBadge: "АО «Қазақтелеком»-ның ресми серіктесі",
  langRu: "RU",
  langKz: "KZ",

  heroTitle: "Қазақтелекомнан үй интернеті және теледидар",
  heroSubtitle:
    "Ыңғайлы уақытта жылдам қосылу. Қазақстанның ең ірі операторының сенімді желісі — сіздің үйіңізде.",
  heroCtaLabel: "Өтінім қалдыру",
  heroImageAlt: "Үй интернеті иллюстрациясы",
  heroImageCaption: "Иллюстрация үшін орын",

  tariffsTitle: "Тарифті таңдаңыз",
  tariffsSubtitle:
    "Отбасыңызға оңтайлы тариф таңдаңыз. Қосылу тегін.",

  tariffs: [
    {
      slug: "internet-200",
      name: "Интернет 200",
      description: "200 Мбит/с дейінгі жылдамдықтағы үй интернеті.",
      descriptionList: null,
      priceMain: "7 249 ₸/ай-дан.",
      priceDetails: [
        "Келісімшартсыз — 7 999 ₸/ай.",
        "1 жылға келісімшарт — 7 249 ₸/ай.",
      ],
      badge: null,
      recommended: false,
    },
    {
      slug: "internet-500",
      name: "Интернет 500",
      description: "500 Мбит/с дейінгі жылдамдықтағы үй интернеті.",
      descriptionList: null,
      priceMain: "9 320 ₸/ай-дан.",
      priceDetails: [
        "Келісімшартсыз — 9 999 ₸/ай.",
        "1 жылға келісімшарт — 9 320 ₸/ай.",
      ],
      badge: null,
      recommended: false,
    },
    {
      slug: "keremet-tv-promo",
      name: "Keremet TV PROMO",
      description:
        "200 Мбит/с үй интернеті + 160-тан астам арна теледидар + 7 онлайн-кинотеатр.",
      descriptionList: null,
      priceMain: "5 699 ₸/ай.",
      priceDetails: ["Акция бағасы 1 жыл бойы жарамды."],
      badge: "Акция",
      recommended: true,
    },
    {
      slug: "bereket",
      name: "Bereket",
      description: null,
      descriptionList: [
        "2 SIM: үй интернеті + теледидар + 2 SIM-ге ұялы байланыс",
        "4 SIM: 500 Мбит/с дейін үй интернеті + TV+ Full + 4 SIM-ге ұялы байланыс",
      ],
      priceMain: "12 999 ₸/ай-дан.",
      priceDetails: [
        "2 SIM: 12 999 (3 ж.) / 13 999 ₸/ай.",
        "4 SIM: 16 999 (3 ж.) / 17 999 ₸/ай.",
      ],
      badge: "Барлығы кіреді",
      recommended: false,
    },
  ],

  connectLabel: "Қосу",

  howTitle: "Қалай қосуға болады",
  howSubtitle: "Үш қарапайым қадам — және сіз желідесіз.",
  steps: [
    {
      number: "1",
      title: "Өтінім қалдырыңыз",
      description:
        "Төмендегі форманы толтырыңыз — бұл екі минуттан аспайды.",
    },
    {
      number: "2",
      title: "Біз қоңырау шалып, мекенжайды нақтылаймыз",
      description:
        "Менеджер жұмыс күні ішінде сізбен хабарласып, мәліметтерді келіседі.",
    },
    {
      number: "3",
      title: "Ыңғайлы уақытта қосамыз",
      description:
        "Техник маман келісілген уақытта келеді. Қосылу тегін.",
    },
  ],

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

  footerCompany: "«Perfluence» ЖШС",
  footerPrivacy: "Дербес деректерді өңдеу саясаты",
  footerRights: "Барлық құқықтар қорғалған.",
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
