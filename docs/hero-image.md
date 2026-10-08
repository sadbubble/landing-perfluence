# Картинка верхнего баннера

Текущая картинка — октябрь 2026: роутер, телевизор, SIM-карта и телефон из
«3D-пластика» на синем фоне с сеткой-глобусом. На экране телевизора —
официальный логотип Казахтелекома.

## Из чего она собрана

1. **Фон с предметами** — сгенерирован в Nano Banana 2 по промпту ниже,
   затем отредактирован там же: затемнена левая часть под текстом.
2. **Логотип на экране** — наложен программно, а не сгенерирован:
   `scripts/hero-logo-on-tv.py`. Нейросети перерисовывают чужие логотипы и
   искажают буквы, а ТЗ п.3 требует «согласованный» логотип. Скрипт берёт
   официальный файл заказчика и кладёт его на экран с перспективой.

Исходники лежат в `assets-src/` (вне git): `hero-raw.jpg` — картинка без
логотипа, `logo_latin/` — логотипы заказчика в трёх цветах.

Текст, кнопки и связка «логотип | Официальный партнёр» над заголовком —
вёрстка, а не картинка: так они чёткие и переводятся на русский.

## Промпт

Приложите как референс по стилю баннер «ОҚЫ! АРАЛАС!» из `for landing.pdf`
(страница 1, второй пример).

```text
Wide 21:9 hero banner background for a telecom landing page, high-end 3D render.

Style: "3D plastic" product illustration as in modern telecom advertising —
soft glossy plastic, rounded friendly shapes, clean bright studio lighting.
If a reference image is attached, match its style, lighting and colors.

Background: deep royal blue #0044BC across the whole left half, smoothly
brightening to azure #008EFF only behind the group of objects on the right.
The left half is evenly toned, with no bright glow. Very faint thin white
line art at 10-15% opacity: a wireframe globe of latitude and longitude
lines and a few concentric circles, mostly behind the objects.

Objects, floating and slightly tilted, with soft shadows and a gentle glow:
a white Wi-Fi router with two antennas; a slim flat-screen TV with a blank
glossy screen; an oversized SIM card in glossy white and blue plastic with a
gold chip; a smartphone with a blank dark screen; small accents — two glossy
spheres, one soft ring, one small rounded cube. Colors: white, light grey,
shades of blue; one or two small accents in warm golden yellow #F1B13E.

Composition: the objects form one group between 52% and 78% of the image
width and between 15% and 85% of the height. Nothing important near any edge.

Quality: crisp edges, very high detail, no noise. Bright, premium mood.

Do NOT include: any text, letters, numbers, logos, brand marks, watermarks,
icons or interfaces on screens, people, hands, faces, red color.
Output at the highest available resolution, at least 2560 px wide.
```

Два пожелания промпт выполнил не до конца, и это стоит знать при следующей
генерации:

- **Группа предметов шире заказанного** — 48–85% ширины вместо 52–78%.
  Из-за этого на экранах 4:3 и 5:4 картинка отключена (см. ниже).
- **Разрешение 1584×672** вместо 2560 и больше. На 1920×1080 картинка
  растянута в 1,6 раза; для мягкого 3D-рендера это терпимо, но более
  крупный оригинал был бы лучше.

## Как картинка ложится на разные экраны

Кадр 21:9 растягивается на всё окно (`cover`) по центру и обрезается по бокам.
Положение подбиралось перебором по 12 популярным экранам: сдвиг вправо
загоняет предметы под текст на больших экранах, влево — режет их справа.

| Экран | Что видно |
|---|---|
| 16:9 — 1366, 1536, 1920, 2560 | всё целиком, предметы правее текста |
| 16:10 — 1280×800, 1440×900, 1680×1050 | справа обрезается ~2%: краешек кубика |
| 21:9 и 1360×625 | всё целиком |
| 4:3 и 5:4 — 1024×768, 1280×1024 | **картинка отключена**, фирменный градиент |
| уже 900px (телефоны) | картинка отключена, градиент |

На 4:3 кадр 21:9 не помещается ни при каком сдвиге: предметы либо срезаются
на 8–16%, либо уходят под текст.

Декоративные круги из кода (`.hero-art`) над картинкой скрыты — у неё свой
глобус, а центральная точка кругов ложилась на экран телевизора. Там, где
картинки нет, круги остаются.

## Вуаль и контраст

Вуаль неравномерная: плотнее всего на 38% ширины, у правого края строк
текста, где начинается свечение вокруг роутера, и сходит на нет к 66%.
Подзаголовок чисто белый: приглушённый на 82% над этим свечением давал
3.56–4.28 даже под плотной вуалью.

Замерено по пикселям: фон баннера собран в canvas точно как в CSS, и в
прямоугольнике каждой строки текста найдена худшая точка.

| Экран | Подпись у логотипа | Заголовок (норма 3) | Подзаголовок | Факты |
|---|---|---|---|---|
| 1440×900 | 8.33 | 4.67 | 5.01 | 7.64 |
| 1920×1080 | 8.23 | 4.68 | 5.06 | 7.52 |
| 1366×768 | 8.52 | 4.80 | 5.25 | 7.85 |
| 1280×800 | 8.52 | 4.80 | 5.04 | 7.80 |
| 1360×625 | 8.44 | 5.09 | 8.33 | 7.64 |
| 2560×1440 | 5.04 | 4.76 | 5.14 | 5.08 |
| 1024×768 (градиент) | 5.58 | 5.17 | 5.95 | 6.45 |
| 375×667 (градиент) | 4.80 | 4.76 | 5.45 | 5.67 |

Худшее значение из двух языков. Норма 4.5, для заголовка 3.0.

**Если меняете картинку, ширину текста или вуаль — перемеряйте.** Прежний
расчёт для новой картинки недействителен: с вуалью, подобранной под старую,
подзаголовок на новой давал 3.56.

## Замена картинки

1. Положить исходник в `assets-src/hero-raw.jpg`.
2. В `scripts/hero-logo-on-tv.py` поправить `SEED` — точку внутри экрана
   телевизора, и при необходимости `OCCLUDER`.
3. `python scripts/hero-logo-on-tv.py` и посмотреть контрольный кадр
   `assets-src/hero-screen-check.png`: красный контур должен лечь на экран.
4. Перемерить обрезку и контраст.
