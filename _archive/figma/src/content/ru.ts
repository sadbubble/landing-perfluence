export const content = {
  partnerBadge: "Официальный партнёр АО «Казахтелеком»",
  langRu: "RU",
  langKz: "KZ",

  heroTitle: "Домашний интернет и ТВ от Казахтелекома",
  heroSubtitle:
    "Быстрое подключение в удобное время. Надёжная сеть крупнейшего оператора Казахстана — уже в вашем доме.",
  heroCtaLabel: "Оставить заявку",
  heroImageAlt: "Иллюстрация домашнего интернета",
  heroImageCaption: "Место под иллюстрацию",

  tariffsTitle: "Выберите тариф",
  tariffsSubtitle:
    "Подберите оптимальный тариф для вашей семьи. Подключение бесплатно.",

  tariffs: [
    {
      slug: "internet-200",
      name: "Интернет 200",
      description: "Домашний интернет со скоростью до 200 Мбит/с.",
      descriptionList: null,
      priceMain: "от 7 249 ₸/мес.",
      priceDetails: [
        "Без контракта — 7 999 ₸/мес.",
        "Контракт на 1 год — 7 249 ₸/мес.",
      ],
      badge: null,
      recommended: false,
    },
    {
      slug: "internet-500",
      name: "Интернет 500",
      description: "Домашний интернет со скоростью до 500 Мбит/с.",
      descriptionList: null,
      priceMain: "от 9 320 ₸/мес.",
      priceDetails: [
        "Без контракта — 9 999 ₸/мес.",
        "Контракт на 1 год — 9 320 ₸/мес.",
      ],
      badge: null,
      recommended: false,
    },
    {
      slug: "keremet-tv-promo",
      name: "Keremet TV PROMO",
      description:
        "Интернет 200 Мбит/с + ТВ 160+ каналов + 7 онлайн-кинотеатров.",
      descriptionList: null,
      priceMain: "5 699 ₸/мес.",
      priceDetails: ["Акционная цена действует 1 год."],
      badge: "Акция",
      recommended: true,
    },
    {
      slug: "bereket",
      name: "Bereket",
      description: null,
      descriptionList: [
        "2 SIM: интернет + ТВ + мобильная связь",
        "4 SIM: до 500 Мбит/с + TV+ Full + моб. связь на 4 SIM",
      ],
      priceMain: "от 12 999 ₸/мес.",
      priceDetails: [
        "2 SIM: 12 999 (3 г.) / 13 999 ₸/мес.",
        "4 SIM: 16 999 (3 г.) / 17 999 ₸/мес.",
      ],
      badge: "Всё включено",
      recommended: false,
    },
  ],

  connectLabel: "Подключить",

  howTitle: "Как подключить",
  howSubtitle: "Три простых шага — и вы в сети.",
  steps: [
    {
      number: "1",
      title: "Оставьте заявку",
      description:
        "Заполните форму ниже — это займёт не более двух минут.",
    },
    {
      number: "2",
      title: "Мы перезвоним и уточним адрес",
      description:
        "Менеджер свяжется с вами в течение рабочего дня и согласует детали.",
    },
    {
      number: "3",
      title: "Подключим в удобное время",
      description:
        "Технический специалист приедет в согласованное время. Подключение бесплатно.",
    },
  ],

  formTitle: "Оставить заявку",
  formSubtitle:
    "Заполните форму — мы свяжемся с вами и оформим подключение.",
  labelPhone: "Номер мобильного телефона",
  placeholderPhone: "+7 (___) ___-__-__",
  labelName: "ФИО",
  placeholderName: "Иванов Иван Иванович",
  labelAddress: "Адрес подключения",
  placeholderAddress: "Город, улица, дом, квартира",
  labelTariff: "Выбранный тариф",
  placeholderTariff: "Выберите тариф",
  labelComment: "Комментарий",
  placeholderComment: "Дополнительные пожелания (необязательно)",
  consentText: "Согласен на обработку ",
  consentLink: "персональных данных",
  privacyPath: "/privacy",
  submitLabel: "Отправить заявку",
  submittingLabel: "Отправка...",
  successTitle: "Спасибо!",
  successText:
    "Менеджер свяжется с вами в течение рабочего дня.",

  errorRequired: "Это поле обязательно",
  errorPhone: "Введите корректный казахстанский номер (+7 7XX XXX XX XX)",
  errorConsent: "Необходимо дать согласие",
  errorSubmit: "Не удалось отправить заявку. Попробуйте ещё раз или позвоните нам.",
  resetLabel: "Отправить ещё одну заявку",

  footerCompany: "ТОО «Perfluence»",
  footerPrivacy: "Политика обработки персональных данных",
  footerRights: "Все права защищены.",
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
