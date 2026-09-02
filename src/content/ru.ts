export const content = {
  partnerBadge: "Официальный партнёр АО «Казахтелеком»",
  langRu: "RU",
  langKz: "KZ",

  heroTitle: "Домашний интернет и ТВ от Казахтелекома",
  heroSubtitle:
    "Быстрое подключение в удобное время. Надёжная сеть крупнейшего оператора Казахстана — уже в вашем доме.",
  heroCtaLabel: "Оставить заявку",
  heroSecondaryCtaLabel: "Смотреть тарифы",
  heroHighlights: [
    "Подключение за 1–2 дня",
    "Сеть Казахтелекома",
    "Без скрытых доплат",
  ],
  heroScrollHint: "Перейти к тарифам",
  heroImageAlt: "Иллюстрация домашнего интернета",
  heroImageCaption: "Место под иллюстрацию",

  tariffsTitle: "Выберите тариф",
  perMonth: "₸/мес.",
  currency: "₸",
  perMonthShort: "/мес.",
  toggleContract: "С контрактом",
  toggleNoContract: "Без контракта",
  savingLabel: "выгода",
  priceModeHint: "Контракт снижает ежемесячный платёж",

  tariffs: [
    {
      slug: "internet-200",
      headline: "до 200 Мбит/с",
      tagline: "Для дома и учёбы",
      name: "Интернет 200",
      description: "Домашний интернет со скоростью до 200 Мбит/с.",
      descriptionList: null,
      price: {
        contract: "7 249",
        noContract: "7 999",
        contractLabel: "Контракт на 1 год",
        extra: [],
      },
      simVariants: null,
      badge: null,
      recommended: false,
    },
    {
      slug: "internet-500",
      headline: "до 500 Мбит/с",
      tagline: "Для тех, кому нужна скорость",
      name: "Интернет 500",
      description: "Домашний интернет со скоростью до 500 Мбит/с.",
      descriptionList: null,
      price: {
        contract: "9 320",
        noContract: "9 999",
        contractLabel: "Контракт на 1 год",
        extra: [],
      },
      simVariants: null,
      badge: null,
      recommended: false,
    },
    {
      slug: "keremet-tv-promo",
      headline: "200 Мбит/с + ТВ",
      tagline: "Для любителей кино и ТВ",
      name: "Keremet TV PROMO",
      description:
        "Интернет 200 Мбит/с + ТВ 160+ каналов + 7 онлайн-кинотеатров.",
      descriptionList: null,
      price: {
        contract: null,
        noContract: "5 699",
        contractLabel: null,
        extra: ["Акционная цена действует 1 год"],
      },
      simVariants: null,
      badge: "Акция",
      recommended: true,
    },
    {
      slug: "bereket",
      headline: "интернет + ТВ + моб. связь",
      tagline: "Для семьи — всё в одном",
      name: "Bereket",
      description: null,
      descriptionList: [
        "2 SIM: интернет + ТВ + мобильная связь",
        "4 SIM: до 500 Мбит/с + TV+ Full + моб. связь на 4 SIM",
      ],
      price: {
        contract: "12 999",
        noContract: "13 999",
        contractLabel: "Контракт на 3 года",
        extra: [],
      },
      simVariants: [
        {
          id: "2sim",
          label: "2 SIM",
          headline: "интернет + ТВ + 2 SIM",
          price: {
            contract: "12 999",
            noContract: "13 999",
            contractLabel: "Контракт на 3 года",
            extra: [],
          },
        },
        {
          id: "4sim",
          label: "4 SIM",
          headline: "до 500 Мбит/с + TV+ Full + 4 SIM",
          price: {
            contract: "16 999",
            noContract: "17 999",
            contractLabel: "Контракт на 3 года",
            extra: [],
          },
        },
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
      image: "/step-form.png",
      title: "Оставьте заявку",
      description:
        "Заполните форму ниже — это займёт не более двух минут.",
    },
    {
      number: "2",
      image: "/step-call.png",
      title: "Мы перезвоним и уточним адрес",
      description:
        "Менеджер свяжется с вами в течение рабочего дня и согласует детали.",
    },
    {
      number: "3",
      image: "/step-install.png",
      title: "Подключим в удобное время",
      description:
        "Технический специалист приедет в согласованное время. Подключение бесплатно.",
    },
  ],

  benefitsTitle: "Почему подключают у нас",
  benefitsSubtitle: "Оформление и подключение берём на себя.",
  benefits: [
    {
      icon: "install",
      image: "/benefit-fast.png",
      metric: "1–2",
      metricUnit: "дня",
      title: "Быстрое подключение",
      text: "Проверим адрес и приедем в удобное время, включая выходные.",
    },
    {
      icon: "wallet",
      image: "/benefit-price.png",
      metric: "0 ₸",
      metricUnit: "за подключение",
      title: "Без скрытых доплат",
      text: "Цена на сайте окончательная. Навязанных услуг нет.",
    },
  ],

  ctaTitle: "Остались вопросы?",
  ctaAccent: "Перезвоним и подскажем",
  ctaNote: "Ответим в течение рабочего дня",
  ctaButton: "Оставить заявку",
  closeLabel: "Закрыть",
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
  chosenTariffLabel: "Выбранный тариф",
  changeTariffLabel: "Изменить",

  footerCompany: "ТОО «Perfluence»",
  footerPrivacy: "Политика обработки персональных данных",
};

export type TariffSlug = "internet-200" | "internet-500" | "keremet-tv-promo" | "bereket";

/**
 * Цена тарифа.
 *
 * Хранится числами-строками без валюты: подпись «₸/мес.» одна на все
 * карточки и меняется вместе с языком, а сумма — нет.
 * `contract: null` — у тарифа одна цена (акционный Keremet), переключатель
 * для него ничего не меняет.
 */
export interface TariffPrice {
  contract: string | null;
  noContract: string;
  contractLabel: string | null;
  /** Дополнительные условия: например, цены на 4 SIM у Bereket. */
  extra: string[];
}

/**
 * Вариант тарифа по числу SIM-карт — сейчас только у Bereket.
 *
 * Заведён не ради оформления: в Qbox девять продуктов, и четыре из них —
 * это Bereket на 2 и 4 SIM в двух режимах цены. Пока 4 SIM был строчкой
 * текста под ценой, лендинг физически не мог сообщить форме, что человек
 * выбрал именно его.
 */
export interface SimVariant {
  /** Совпадает с частью ключа в справочнике Qbox: «2sim» / «4sim». */
  id: string;
  /** Подпись на переключателе: «2 SIM». */
  label: string;
  /** Своя строка сути: у 4 SIM она отличается от 2 SIM. */
  headline: string;
  price: TariffPrice;
}

export interface Tariff {
  slug: string;
  name: string;
  /** Короткая подпись под названием: «Для семьи — всё в одном». */
  tagline: string;
  /** Строка сути под названием: «до 200 Мбит/с». Цифры выделяются жирным. */
  headline: string;
  description: string | null;
  descriptionList: string[] | null;
  price: TariffPrice;
  /** Варианты по числу SIM. null — у тарифа один вариант, переключателя нет. */
  simVariants: SimVariant[] | null;
  badge: string | null;
  recommended: boolean;
}
