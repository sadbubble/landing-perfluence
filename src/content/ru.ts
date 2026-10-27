export const content = {
  partnerBadge: "Официальный партнёр АО «Казахтелеком»",
  // Подпись рядом с логотипом в баннере: имя оператора уже в самом знаке.
  partnerLabel: "Официальный партнёр",
  ktLogoAlt: "Казахтелеком",
  langRu: "RU",
  langKz: "KZ",

  pageTitle: "Подключение интернета и ТВ — официальный партнёр АО «Казахтелеком»",

  heroTitle: "Домашний интернет, ТВ и SIM-карты от Казахтелекома",
  heroSubtitle:
    "Быстрое подключение в удобное время. Надёжная сеть крупнейшего оператора Казахстана — уже в вашем доме.",
  heroCtaLabel: "Оставить заявку",
  heroSecondaryCtaLabel: "Смотреть тарифы",
  heroHighlights: [
    "Подключение за 1–2 дня",
    "Высокоскоростной интернет",
  ],
  chooseTariffLabel: "Выбрать тариф",
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
  // Аренда оборудования в цену тарифа не входит (слово заказчика, октябрь
  // 2026): строка под ценой каждой карточки и примечание под карточками.
  rentLabel: "+ аренда оборудования",
  rentNote: "Примечание: стоимость аренды модема — от 414,29 ₸/месяц.",
  detailsMore: "Подробнее",
  detailsLess: "Свернуть",

  tariffs: [
    {
      slug: "internet-200",
      group: null,
      headline: "до 200 Мбит/с",
      tagline: "Для дома и учёбы",
      name: "Интернет 200",
      services: [
        { icon: "internet", title: "Домашний интернет", summary: "до 200 Мбит/с", facts: [], details: [] },
      ],
      // Только без контракта: вместо выбора режима в карточке надпись.
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
      headline: "до 500 Мбит/с",
      tagline: "Для тех, кому нужна скорость",
      name: "Интернет 500",
      services: [
        { icon: "internet", title: "Домашний интернет", summary: "до 500 Мбит/с", facts: [], details: [] },
      ],
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
      group: "keremet",
      headline: "до 200 Мбит/с + ТВ",
      tagline: "Для любителей кино и ТВ",
      name: "Keremet TV PROMO",
      services: [
        { icon: "internet", title: "Домашний интернет", summary: "200 Мбит/с", facts: [], details: [] },
        { icon: "tv", title: "Телевидение", summary: "160+ каналов · 7 онлайн-кинотеатров", facts: [], details: [] },
      ],
      // Только с контрактом на год. Делит карточку с Keremet TV 2026 (group):
      // «С контрактом» в ней — PROMO, «Без контракта» — TV 2026.
      price: {
        contract: "5 699",
        noContract: null,
        contractLabel: "Контракт на 1 год",
        extra: ["Акционная цена действует 1 год"],
      },
      simVariants: null,
      badge: "Акция",
      recommended: true,
    },
    {
      slug: "keremet-tv-2026",
      group: "keremet",
      headline: "до 300 Мбит/с + ТВ",
      tagline: "Для любителей кино и ТВ",
      name: "Keremet TV 2026",
      // Состав — с карточки Keremet TV на сайте Казахтелекома (октябрь 2026),
      // по слову заказчика: в ТЗ этого тарифа нет.
      services: [
        { icon: "internet", title: "Домашний интернет", summary: "до 300 Мбит/с", facts: [], details: [] },
        { icon: "tv", title: "Телевидение", summary: "160+ каналов · 7 онлайн-кинотеатров", facts: [], details: [] },
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
      headline: "интернет + ТВ + моб. связь",
      tagline: "Для семьи — всё в одном",
      name: "Bereket",
      // Состав у Bereket свой на каждый вариант SIM — см. simVariants.
      services: null,
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
          // Неразрывные пробелы: на узкой карточке «2» и «SIM» расходились
          // по разным строкам. Переносится «+ 2 SIM» целиком.
          headline: "до 500 Мбит/с + ТВ +\u00a02\u00a0SIM",
          services: [
            {
              icon: "internet",
              title: "Домашний интернет",
              summary: "до 500 Мбит/с",
              facts: [],
              details: [],
            },
            {
              icon: "tv",
              title: "TV+ Full",
              summary: "160+ каналов · 8 онлайн-кинотеатров",
              facts: [],
              details: [],
            },
            {
              icon: "mobile",
              title: "Мобильная связь Altel/Activ",
              summary: "2 SIM, в каждой:",
              facts: [
                { value: "60 ГБ", label: "интернет-трафик" },
                { value: "∞ мин", label: "внутри сети" },
                { value: "250 мин", label: "на номера других операторов и городские" },
              ],
              details: [
                "После 60 ГБ скорость снижается до 512 Кбит/с",
                "Подписка TV+ к каждому номеру без учёта мобильного трафика",
              ],
            },
          ],
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
          headline: "до 500 Мбит/с + ТВ +\u00a04\u00a0SIM",
          services: [
            {
              icon: "internet",
              title: "Домашний интернет",
              summary: "до 500 Мбит/с",
              facts: [],
              details: [],
            },
            {
              icon: "tv",
              title: "TV+ Full",
              summary: "160+ каналов · 8 онлайн-кинотеатров",
              facts: [],
              details: [],
            },
            {
              icon: "mobile",
              title: "Мобильная связь Altel/Activ",
              summary: "4 SIM, в каждой:",
              facts: [
                { value: "60 ГБ", label: "интернет-трафик" },
                { value: "∞ мин", label: "внутри сети" },
                { value: "250 мин", label: "на номера других операторов и городские" },
              ],
              details: [
                "После 60 ГБ скорость снижается до 512 Кбит/с",
                "Подписка TV+ к каждому номеру без учёта мобильного трафика",
              ],
            },
          ],
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
    {
      slug: "back-to-school",
      group: null,
      headline: "до 500 Мбит/с + ТВ + SIM + планшет",
      tagline: "Для учёбы — планшет в тарифе",
      name: "Back to School",
      // Состав и цена — с карточки Back to School на сайте Казахтелекома
      // (октябрь 2026), по слову заказчика. Только с контрактом на 3 года.
      services: [
        { icon: "internet", title: "Домашний интернет", summary: "до 500 Мбит/с", facts: [], details: [] },
        { icon: "tv", title: "TV+ Teens", summary: "18 каналов · 2 онлайн-кинотеатра · до 3 устройств", facts: [], details: [] },
        { icon: "mobile", title: "Мобильная связь", summary: "40 ГБ · 250 мин · 100 SMS · безлимит внутри сети", facts: [], details: [] },
        { icon: "tablet", title: "Планшет", summary: "входит в тариф", facts: [], details: [] },
        {
          icon: "gift",
          title: "Бонус Skillbox на выбор",
          summary: "курс по AI или первые 3 модуля любого курса",
          facts: [],
          details: [
            "Курс по AI от Skillbox: 7 модулей, 49 уроков (обычная цена 100 865 ₸)",
            "Первые 3 модуля любого курса Skillbox — 0 ₸",
          ],
        },
      ],
      price: {
        contract: "12 990",
        noContract: null,
        contractLabel: "Контракт на 3 года",
        extra: [],
      },
      simVariants: null,
      badge: null,
      recommended: false,
    },
    {
      slug: "go-smart",
      group: null,
      headline: "до 200 Мбит/с +\u00a02\u00a0SIM + смарт-часы",
      tagline: "Интернет, связь и часы в подарок",
      name: "Go Smart",
      // С сайта Казахтелекома (октябрь 2026): один тариф у двух мобильных
      // операторов — Go Smart A (Altel) и Go Smart (Activ), условия и цена
      // одинаковые. Выбора оператора на карточке нет (решение заказчика,
      // 23.10.2026): мобильная связь одним блоком «Altel/Activ», как у
      // Bereket, оператор уточняет менеджер. Только с контрактом на 12 месяцев.
      services: [
        { icon: "internet", title: "Домашний интернет", summary: "до 200 Мбит/с", facts: [], details: [] },
        {
          icon: "mobile",
          title: "Мобильная связь Altel/Activ",
          summary: "2 SIM-карты:",
          facts: [
            { value: "60 ГБ", label: "интернет-трафик" },
            { value: "250 мин", label: "на звонки" },
          ],
          details: [],
        },
        { icon: "watch", title: "Смарт-часы", summary: "в подарок", facts: [], details: [] },
      ],
      price: {
        contract: "7 990",
        noContract: null,
        contractLabel: "Контракт на 1 год",
        extra: [],
      },
      simVariants: null,
      badge: null,
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
  // Над формой Qbox в окне — как заголовок формы в окнах на сайте КТ. У
  // нашей формы в Qbox заголовок не показывается, поэтому текст наш.
  formLead: "Оставьте заявку. Наш менеджер скоро с вами свяжется",
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

  // Условия и лицензии в подвале — тексты заказчика (27.10.2026), дословно.
  footerRent:
    "Стоимость аренды модема не входит в абонентскую плату и оплачивается отдельно — 414\u00a0₸/мес.",
  footerBtsTitle: "По тарифу Back to School",
  footerBtsItems: [
    "Количество планшетов по акции ограничено. Предложение действует при подключении на контракт сроком 3\u00a0года.",
    "Подключение доступно при наличии технической возможности.",
    "В абонентскую плату не включена стоимость аренды оборудования.",
    "Доставка оборудования осуществляется нашим специалистом по рабочим дням с 09:00 до 18:00.",
    "В пакетах услуг Back to School доступно подключение дополнительных SIM-карт.",
    "Планшет предоставляется Абоненту в рамках продуктового предложения Back to School. При досрочном прекращении участия в продуктовом предложении до окончания контрактного периода Абонент обязуется оплатить АО «Кселл» остаточную стоимость планшета в порядке и на условиях, предусмотренных трёхсторонним соглашением.",
  ],
  footerLicensesTitle: "Лицензии",
  footerLicenses: [
    "АО «Казахтелеком» — лицензия №\u00a014014826 от 09.10.2014, выдана Комитетом связи, информатизации и информации Министерства по инвестициям и развитию Республики Казахстан.",
    "АО «Кселл» (Kcell/activ) — государственная лицензия №\u00a0ДС\u00a00000270 от 08.06.1998 (бессрочная), выдана Комитетом связи, информатизации и информации Министерства по инвестициям и развитию Республики Казахстан.",
    "ТОО «ALACAST» (Телевидение) — лицензия №\u00a012016823 от 22.11.2012. Услуги оказываются с использованием сетей телекоммуникаций АО «Казахтелеком».",
  ],
  footerOffer: "Ознакомьтесь с условиями публичной оферты",
  // Адрес оферты: пока не прислан — строка показывается текстом, без ссылки.
  footerOfferUrl: null as string | null,
  footerAiNote: "Все изображения созданы при помощи ИИ.",
  footerCopyright: "©\u00a02026 АО «Казахтелеком». Все права защищены.",
};

export type TariffSlug =
  | "internet-200"
  | "internet-500"
  | "keremet-tv-promo"
  | "keremet-tv-2026"
  | "bereket"
  | "back-to-school"
  | "go-smart";

/**
 * Цена тарифа.
 *
 * Хранится числами-строками без валюты: подпись «₸/мес.» одна на все
 * карточки и меняется вместе с языком, а сумма — нет.
 */
export interface TariffPrice {
  /**
   * Цена в каждом режиме необязательна. null значит «в этом режиме тарифа
   * нет». Так устроены Интернет 200 (только без контракта) и два Keremet:
   * PROMO только с контрактом на год, TV 2026 только без контракта. Как это
   * выглядит в карточке — см. Tariff.group и TariffCard.
   */
  contract: string | null;
  noContract: string | null;
  contractLabel: string | null;
  /** Дополнительные условия: например, цены на 4 SIM у Bereket. */
  extra: string[];
}

/**
 * Вариант тарифа по числу SIM-карт — сейчас только у Bereket.
 *
 * Заведён не ради оформления: в Qbox это разные продукты, и четыре из них —
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
  /** Состав блоками по услугам: интернет, ТВ, мобильная связь. */
  services: TariffService[];
  price: TariffPrice;
}

/**
 * Услуга в составе тарифа — блок с иконкой, названием и цифрами.
 *
 * Раньше состав был списком строк с галочками, и он не давал понять, что
 * входит в каждую услугу: сколько гигабайт на SIM, сколько каналов. Блоки
 * подсмотрены у карточки Bereket на сайте Казахтелекома (октябрь 2026),
 * оформление своё — белая карточка по макету заказчика. Цифры Bereket
 * взяты оттуда же, у остальных тарифов — из ТЗ п.4.
 */
export interface TariffService {
  /**
   * Иконка: "internet", "tv", "mobile", "tablet", "watch" или "gift" —
   * рисунки в ServiceBlock.vue.
   * Строка, а не перечисление: объект текстов не типизирован, и TypeScript
   * расширяет значение до string. Неизвестное имя — блок без иконки.
   */
  icon: string;
  title: string;
  /**
   * Строка под названием: «до 500 Мбит/с». Цифры выделяются. Пустая —
   * строки нет: для тарифа, чей состав ещё неизвестен.
   */
  summary: string;
  /** Цифра и пояснение: «60 ГБ» — «интернет-трафик». [] — нет таких. */
  facts: { value: string; label: string }[];
  /** Мелкие условия: «после 60 ГБ скорость снижается…». */
  details: string[];
  /*
   * Если есть facts или details, всё ниже названия блока — summary, цифры
   * и условия — прячется под «Подробнее». Так у мобильной связи Bereket:
   * раскрытая, она вытягивала карточку почти до 900px, а с ней весь ряд —
   * высота карточек в ряду общая. Число SIM при этом видно и свёрнутым —
   * в строке сути и на переключателе.
   */
}

export interface Tariff {
  slug: string;
  /**
   * Общая карточка для тарифов, которые различаются только режимом цены.
   * Тарифы с одинаковым group показываются одной карточкой, и выбор «с
   * контрактом / без контракта» в ней переключает сам тариф: так Keremet TV
   * PROMO (только с контрактом) и Keremet TV 2026 (только без) стали одной
   * карточкой «Keremet». В Qbox при этом уходит slug выбранного тарифа —
   * названия продуктов не меняются. null — карточка своя.
   */
  group: string | null;
  name: string;
  /** Короткая подпись под названием: «Для семьи — всё в одном». */
  tagline: string;
  /** Строка сути под названием: «до 200 Мбит/с». Цифры выделяются жирным. */
  headline: string;
  /**
   * Состав тарифа — колонка «Состав / условия» из таблицы ТЗ п.4 — блоками
   * по услугам, см. TariffService. null — состав задан по вариантам SIM,
   * см. simVariants.
   */
  services: TariffService[] | null;
  price: TariffPrice;
  /** Варианты по числу SIM. null — у тарифа один вариант, переключателя нет. */
  simVariants: SimVariant[] | null;
  badge: string | null;
  recommended: boolean;
}
