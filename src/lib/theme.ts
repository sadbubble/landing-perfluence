/**
 * Варианты оформления лендинга.
 *
 * Задача — показать руководителю несколько готовых направлений и получить
 * выбор, а не согласовывать вкус на словах. Вёрстка у всех вариантов одна:
 * различия целиком живут в токенах (см. блоки [data-theme] в index.css).
 *
 * Панель выбора показывается только по адресу с ?themes=1 — на боевом
 * лендинге её нет.
 */
export const THEMES = [
  {
    id: "kt",
    name: "Казахтелеком",
    hint: "Исходный вариант: фирменная бирюза оператора",
    swatch: "#00A3AD",
  },
  {
    id: "warm",
    name: "Тёплый сервис",
    hint: "Терракота и тёплый бежевый, крупные скругления. Читается как частная компания, а не как оператор",
    swatch: "#C2410C",
  },
  {
    id: "night",
    name: "Тёмный премиум",
    hint: "Тёмный фон, спокойный синий акцент. Выигрышно выглядит в сторис у блогеров",
    swatch: "#6C8CFF",
  },
  {
    id: "minimal",
    name: "Строгий минимал",
    hint: "Монохром, чёрные кнопки, мелкие скругления. Максимально нейтральный",
    swatch: "#111827",
  },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const STORAGE_KEY = "perfluence.theme";
const DEFAULT_THEME: ThemeId = "kt";

function isTheme(v: string | null): v is ThemeId {
  return !!v && THEMES.some((t) => t.id === v);
}

export function readTheme(): ThemeId {
  // Тема из адреса имеет приоритет: так можно прислать ссылку сразу на
  // нужный вариант, не объясняя, что и где переключить.
  const fromUrl = new URLSearchParams(window.location.search).get("theme");
  if (isTheme(fromUrl)) return fromUrl;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isTheme(stored)) return stored;
  } catch {
    // приватный режим — остаёмся на теме по умолчанию
  }
  return DEFAULT_THEME;
}

export function applyTheme(id: ThemeId): void {
  // Базовая тема живёт в самом :root, отдельный атрибут ей не нужен.
  if (id === DEFAULT_THEME) {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", id);
  }
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // не критично: тема применена, просто не запомнится
  }
}

/** Панель выбора нужна только для показа вариантов, не на боевом сайте. */
export function isPickerEnabled(): boolean {
  return new URLSearchParams(window.location.search).has("themes");
}
