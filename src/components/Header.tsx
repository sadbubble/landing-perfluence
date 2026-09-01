import { useEffect, useState } from "react";
import type { Lang } from "../hooks/useLang";

interface HeaderProps {
  langRu: string;
  langKz: string;
  lang: Lang;
  ctaLabel: string;
  onCta: () => void;
  onLangChange: (l: Lang) => void;
}

/**
 * Шапка: переключатель языка и кнопка к форме.
 *
 * Лежит поверх баннера, а не над ним. Раньше это была обычная полоса в
 * потоке: белый прямоугольник упирался в тёмный баннер и резал его пополам
 * жёстким стыком. Теперь шапка плавающая и прозрачная, пока баннер на
 * экране, — баннер занимает окно целиком, без шва.
 *
 * Когда баннер уезжает вверх, шапка становится белой и в ней появляется
 * кнопка к форме: ниже по странице другого способа к ней перейти нет.
 *
 * Плашки «Официальный партнёр АО «Казахтелеком»» здесь нет намеренно — по
 * решению заказчика она осталась только в подвале. Требование ТЗ п.3 при
 * этом выполняется: надпись присутствует на странице, см. Footer.
 */
export default function Header({
  langRu,
  langKz,
  lang,
  ctaLabel,
  onCta,
  onLangChange,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Высоту баннера меряем при монтировании и смене размера окна: чтение
    // offsetHeight на каждом событии прокрутки заставляло бы браузер
    // пересчитывать раскладку десятки раз в секунду.
    let threshold = 400;
    const check = () => setScrolled(window.scrollY > threshold);
    const measure = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      if (hero) threshold = hero.offsetHeight - 72;
      check();
    };

    measure();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <header className={"site-header" + (scrolled ? " is-solid" : "")}>
      <div className="site-header-bar">
        {/*
          * Логотипа и названия в шапке нет по решению заказчика. Кнопка
          * «в начало» уехала вместе с ними: единственным её носителем был
          * логотип, а отдельной ссылки на страницу нет — лендинг
          * одностраничный, наверх ведёт прокрутка.
          */}

        <div style={{ flex: 1 }} />

        {scrolled && (
          <button onClick={onCta} className="header-cta">
            {ctaLabel}
          </button>
        )}

        <div className="lang-switch">
          <LangButton label={langRu} active={lang === "ru"} onClick={() => onLangChange("ru")} />
          <LangButton label={langKz} active={lang === "kk"} onClick={() => onLangChange("kk")} />
        </div>
      </div>
    </header>
  );
}

function LangButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={"lang-btn" + (active ? " is-active" : "")}
    >
      {label}
    </button>
  );
}
