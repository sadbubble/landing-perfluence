import { ref, watchEffect, type Ref } from "vue";

export type Lang = "ru" | "kk";

/*
 * С приставкой: на telecom.kz localStorage общий для всего сайта
 * Казахтелекома, и голый ключ «lang» легко совпал бы с их собственным —
 * мы переписывали бы язык их сайта, а они наш.
 */
const STORAGE_KEY = "perfluence.lang";
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
    // localStorage недоступен
  }
  return DEFAULT_LANG;
}

export function useLang(): { lang: Ref<Lang>; setLang: (l: Lang) => void } {
  const lang = ref<Lang>(readStored());

  /*
   * Атрибут lang на <html> следует за языком страницы. Раньше он навсегда
   * оставался «ru»: скринридер читал казахский текст по русским правилам,
   * а поисковики считали страницу русской. С казахским по умолчанию это
   * задело бы уже каждого посетителя, а не только переключивших язык.
   */
  watchEffect(() => {
    document.documentElement.lang = lang.value;
  });

  function setLang(l: Lang) {
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // не критично: язык переключён, просто не запомнится
    }
    lang.value = l;
  }

  return { lang, setLang };
}
