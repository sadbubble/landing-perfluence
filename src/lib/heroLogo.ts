/**
 * Положение логотипа Казахтелекома на экране телевизора в верхнем баннере.
 *
 * ФАЙЛ СГЕНЕРИРОВАН scripts/hero-logo-on-tv.py — не правьте руками, а
 * перезапустите скрипт. Координаты — в пикселях исходной картинки
 * 1584x672: SVG-слой с этим viewBox и preserveAspectRatio="xMidYMid slice"
 * обрезается точно так же, как фон с background-size: cover и
 * background-position: center, поэтому логотип всегда стоит на экране.
 *
 * Аффинное приближение перспективы экрана, ошибка 0.40px.
 */
export const HERO_LOGO = {
  viewBox: "0 0 1584 672",
  src: "/kt-logo-color.png",
  width: 1780,
  height: 269,
  transform: "matrix(0.096444, 0.021600, -0.015922, 0.098289, 1041.814962, 211.094311)",
  opacity: 0.9,
} as const;
