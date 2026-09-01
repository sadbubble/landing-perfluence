/**
 * Цветовые акценты шапок в карточках тарифов.
 *
 * Живут отдельно от текстов: слаг у тарифа один на оба языка, и дублировать
 * цвета в ru.ts и kk.ts значило бы однажды их рассинхронить.
 *
 * ВНИМАНИЕ, расхождение с гайдом. Гайд заказчика (for landing.pdf) задаёт
 * один синий род на весь лендинг. Разноцветные шапки — сознательное
 * исключение по прямой просьбе: одноцветный вариант в ряду из четырёх
 * карточек читался как четыре одинаковых прямоугольника. Остальная
 * страница палитре гайда следует.
 *
 * Оттенки подобраны расчётом: белый текст даёт контраст не ниже 4.6 на
 * ОБОИХ концах каждого градиента. Первая версия была ярче и красивее, но
 * давала 2.67–3.41 — название тарифа на оранжевой шапке не читалось.
 * Меняете цвет — пересчитайте, а не подбирайте на глаз.
 */
export type TariffAccent = {
  /** Заливка шапки карточки. */
  gradient: string;
  /** Цвет текста на шапке. Проверен на контраст ≥4.5 с обоими концами. */
  ink: string;
};

const DEFAULT_ACCENT: TariffAccent = {
  gradient: "linear-gradient(135deg, #3477BB 0%, #1F5FC4 100%)",
  ink: "#FFFFFF",
};

const ACCENTS: Record<string, TariffAccent> = {
  "internet-200": {
    gradient: "linear-gradient(135deg, #676AC8 0%, #4A4DC4 100%)",
    ink: "#FFFFFF",
  },
  "internet-500": {
    gradient: "linear-gradient(135deg, #3477BB 0%, #1F5FC4 100%)",
    ink: "#FFFFFF",
  },
  "keremet-tv-promo": {
    gradient: "linear-gradient(135deg, #12826C 0%, #0B7F6C 100%)",
    ink: "#FFFFFF",
  },
  bereket: {
    gradient: "linear-gradient(135deg, #B15F2B 0%, #C84D18 100%)",
    ink: "#FFFFFF",
  },
};

export function accentFor(slug: string): TariffAccent {
  return ACCENTS[slug] ?? DEFAULT_ACCENT;
}
