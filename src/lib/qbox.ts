/**
 * Передача заявки в Qbox.
 *
 * Лендинг НЕ отправляет заявку сам. По нажатию на кнопку человек уходит на
 * форму Qbox, а менеджер и тариф едут туда GET-параметрами; форма кладёт их
 * в скрытые поля и передаёт в CRM. Поэтому здесь нет ни fetch, ни ключей,
 * ни вопросов с CORS — их сняло само решение, а не обходной приём.
 *
 * ВАЖНО про «#». Адрес формы содержит фрагмент с её идентификатором:
 *
 *     https://qbox.telecom.kz/forms/#/7a52f500b34f49ad8fd63599e74a2ca5
 *
 * В ТЗ «Передача менеджера и тарифа» параметры велено клеить в конец, после
 * фрагмента. Так работать не будет: всё, что стоит после «#», браузер считает
 * фрагментом, и `location.search` на стороне формы окажется пустым.
 * Параметры обязаны идти ДО решётки. Проверено на боевой форме: заявка с
 * таким адресом доехала в Qbox с заполненными полями «Менеджер» и «тариф».
 */

/** Адрес формы без фрагмента. Фрагмент добавляется в конец, после параметров. */
const FORM_BASE = "https://qbox.telecom.kz/forms/";

/** Идентификатор формы — он и живёт во фрагменте. */
const FORM_ID = "7a52f500b34f49ad8fd63599e74a2ca5";

/** Ключ менеджера в адресе и в localStorage. Задан ТЗ. */
export const MANAGER_KEY = "manager";

/**
 * Ключей тарифа три, и шлём мы все с одним значением.
 *
 * Источники называют ключ по-разному, и разнобой не наш:
 *   product_name  — из интерфейса Qbox: «Инструкция по запуску лидогенерации»,
 *                   слайд 6, скриншот настроек поля «Продукт». Самый
 *                   достоверный: это снимок реального экрана, где поле заводят.
 *   Product_name  — так написано в ТЗ «Передача менеджера и тарифа».
 *   tariff        — так написано в примерах того же ТЗ и в инструкции, слайд 14.
 *
 * Проверка на боевой форме показала, что значение доезжает и в поле «ПРодукт»,
 * и в поле «тариф». Какой ключ сработал — по карточке лида не отличить, а
 * лишние параметры в адресе безвредны. Когда в Qbox подтвердят единственный
 * верный ключ, лишние отсюда можно убрать.
 */
const PRODUCT_KEYS = ["product_name", "Product_name", "tariff"] as const;

export type PriceMode = "contract" | "noContract";

/** Что именно выбрал человек: тариф, режим цены и — у Bereket — число SIM. */
export interface TariffSelection {
  slug: string;
  mode: PriceMode;
  /** Только у тарифов с вариантами по SIM. Иначе null. */
  sim: string | null;
}

/**
 * СПРАВОЧНИК ПРОДУКТОВ QBOX — ВРЕМЕННЫЕ ЗНАЧЕНИЯ.
 *
 * Qbox сверяет `Product_name` со своим каталогом продуктов, а не принимает
 * любую строку. В тестовой заявке значение `internet-200-contract` вернулось
 * комментарием `[unresolved_products]` — то есть в каталоге не нашлось.
 *
 * Ниже — девять вариантов из согласованного списка, подписанные названиями
 * из ТЗ. Это ЗАГЛУШКА: когда пришлют выгрузку каталога, менять надо ровно
 * эти девять строк и больше ничего.
 *
 * Ключ собирается как `slug|mode` или `slug|mode|sim` — см. productKey().
 */
export const QBOX_PRODUCTS: Record<string, string> = {
  "internet-200|contract":        "Интернет 200 (контракт 1 год)",
  "internet-200|noContract":      "Интернет 200 (без контракта)",
  "internet-500|contract":        "Интернет 500 (контракт 1 год)",
  "internet-500|noContract":      "Интернет 500 (без контракта)",
  // У акционного Keremet цена одна, переключатель контракта на нём ничего
  // не меняет — поэтому у него один продукт, а не два.
  "keremet-tv-promo|noContract":  "Keremet TV PROMO",
  "bereket|contract|2sim":        "Bereket 2 SIM (контракт 3 года)",
  "bereket|noContract|2sim":      "Bereket 2 SIM (без контракта)",
  "bereket|contract|4sim":        "Bereket 4 SIM (контракт 3 года)",
  "bereket|noContract|4sim":      "Bereket 4 SIM (без контракта)",
};

/** Признак того, что каталог ещё не заменён на настоящий. */
export const PRODUCTS_ARE_PLACEHOLDERS = true;

/** Собирает ключ справочника из выбора пользователя. */
export function productKey(sel: TariffSelection): string {
  return sel.sim
    ? `${sel.slug}|${sel.mode}|${sel.sim}`
    : `${sel.slug}|${sel.mode}`;
}

/**
 * Значение `Product_name` для выбранного тарифа.
 *
 * Возвращает null, если сочетания нет в справочнике: лучше отправить заявку
 * без тарифа, чем с выдуманным значением, которое Qbox всё равно не распознает
 * и которое потом придётся вычищать руками из отчёта по дилерам.
 */
export function resolveProduct(sel: TariffSelection): string | null {
  const direct = QBOX_PRODUCTS[productKey(sel)];
  if (direct) return direct;

  // Тариф с одной ценой: переключатель контракта на него не влияет, поэтому
  // «contract» у такого тарифа означает то же самое, что «noContract».
  const single = QBOX_PRODUCTS[`${sel.slug}|noContract`];
  if (single && !sel.sim) return single;

  if (import.meta.env.DEV) {
    console.warn(`Qbox: нет продукта для ${productKey(sel)} — заявка уйдёт без тарифа`);
  }
  return null;
}

/**
 * Собирает адрес формы Qbox.
 *
 * @param product значение Product_name, либо null — для кнопок, не привязанных
 *                к тарифу (шапка, верхний и нижний баннеры). Тариф человек
 *                выберет в самой форме.
 * @param manager код менеджера или null, если человек пришёл без ссылки.
 */
export function buildFormUrl(product: string | null, manager: string | null): string {
  const parts: string[] = [];
  const add = (key: string, value: string) =>
    // Именно encodeURIComponent, а не URLSearchParams: последний кодирует
    // пробел как «+», и разбор на стороне Qbox может вернуть его плюсом,
    // а не пробелом. ТЗ тоже предписывает encodeURIComponent.
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);

  if (manager) add(MANAGER_KEY, manager);
  if (product) for (const key of PRODUCT_KEYS) add(key, product);

  const query = parts.join("&");
  // Параметры строго до «#» — иначе они попадут во фрагмент и потеряются.
  return `${FORM_BASE}${query ? `?${query}` : ""}#/${FORM_ID}`;
}
