import { useState, useCallback } from "react";

export type Lang = "ru" | "kk";

const STORAGE_KEY = "lang";
const DEFAULT_LANG: Lang = "ru";

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
