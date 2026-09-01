import { useEffect } from "react";

/**
 * Появление блоков при прокрутке.
 *
 * Реализовано на обычном обработчике прокрутки, а не на IntersectionObserver,
 * по одной причине: наблюдатель не присылает колбэки, пока вкладка не
 * отрисовывается, и такое поведение невозможно проверить автоматически.
 * Обработчик читает только координаты уже найденных элементов, поэтому
 * стоит дёшево.
 *
 * Класс js-reveal на <html> ставится отсюда: без JS начальное состояние
 * (прозрачность 0) применяться не должно, иначе страница окажется пустой.
 */
export function useReveal(deps: unknown[] = []) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js-reveal");

    let items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

    const check = () => {
      if (items.length === 0) return;
      const line = window.innerHeight * 0.88;
      let remaining = false;
      for (const el of items) {
        if (el.classList.contains("is-visible")) continue;
        if (el.getBoundingClientRect().top < line) el.classList.add("is-visible");
        else remaining = true;
      }
      // Когда всё показано, слушатель больше не нужен
      if (!remaining) {
        items = [];
        window.removeEventListener("scroll", check);
      }
    };

    const rescan = () => {
      items = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
      check();
    };

    rescan();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", rescan);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", rescan);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
