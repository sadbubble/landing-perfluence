import { nextTick, onBeforeUnmount, onMounted, watch, type WatchSource } from "vue";

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
 *
 * source — то, при смене чего секции перерисовываются (язык): после неё
 * список блоков собирается заново.
 */
export function useReveal(source: WatchSource) {
  let items: HTMLElement[] = [];

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
    window.removeEventListener("scroll", check);
    window.addEventListener("scroll", check, { passive: true });
    check();
  };

  onMounted(() => {
    document.documentElement.classList.add("js-reveal");
    rescan();
    window.addEventListener("resize", rescan);
  });

  watch(source, () => nextTick(rescan));

  onBeforeUnmount(() => {
    window.removeEventListener("scroll", check);
    window.removeEventListener("resize", rescan);
  });
}
