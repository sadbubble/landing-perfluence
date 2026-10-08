import { useState, useCallback, useEffect } from "react";

export type Lang = "ru" | "kk";

const STORAGE_KEY = "lang";
/*
 * Казахский по умолчанию — решение заказчика. Русский остаётся у тех, кто
 * сам переключился: выбор пишется в localStorage только по нажатию RU/KZ,
 * так что прежним посетителям, ни разу не трогавшим переключатель, теперь
 * тоже откроется казахская версия.
 */
const DEFAULT_LANG: Lang = "kk";

function readStored(): Lang {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "ru" || v === "kk") return v;
  } catch {
    // localStorage unavailable
  }
  return DEFAULT_LANG;
}

export function useLang(): { lang: Lang; setLang: (l: Lang) => void } {
  const [lang, setLangState] = useState<Lang>(readStored);

  /*
   * Атрибут lang на <html> следует за языком страницы. Раньше он навсегда
   * оставался «ru»: скринридер читал казахский текст по русским правилам,
   * а поисковики считали страницу русской. С казахским по умолчанию это
   * задело бы уже каждого посетителя, а не только переключивших язык.
   */
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
    setLangState(l);
  }, []);

  return { lang, setLang };
}
