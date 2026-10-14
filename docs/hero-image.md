# Картинка верхнего баннера

Текущая картинка — октябрь 2026: роутер, телевизор, SIM-карта и телефон из
«3D-пластика» на синем фоне с сеткой-глобусом. Экран телевизора «включён»:
светится фирменным синим, на нём белый логотип Казахтелекома.

## Из чего она собрана

1. **Фон с предметами** — сгенерирован в Nano Banana 2 по промпту ниже,
   затем отредактирован там же: затемнена левая часть под текстом.
   В октябре 2026 тот же кадр перерисован в Gemini вдвое крупнее —
   3168×1344, промпт «Перерисовка в высоком разрешении» ниже. Композиция
   совпала с прежней до пикселя (сдвиг 0, среднее расхождение 2.4 из 255,
   различия только по контурам предметов), поэтому координаты в скрипте
   и вуаль менять не пришлось.

2. **Экран телевизора «включён»** — его рисует `scripts/hero-image.py`:
   градиент из синих гайда (`#052A7E → #0044BC → #008EFF`), свечение
   `#00D9FF` за логотипом, виньетка к краям, белый официальный логотип с
   ореолом, а поверх — блики стекла, взятые из исходного рендера. Так
   оформлен экран планшета на баннере «ОҚЫ! АРАЛАС!» из гайда заказчика.

   До этого были две неудачные попытки, и обе стоит помнить:
   - **цветной логотип на белом экране** — заказчик отклонил: плоский знак
     на объёмном экране читается как наклейка, без свечения и глубины.
     Код — в `_archive/hero-tv-logo/`;
   - **первая сборка «включённого» экрана** — по краю шла светлая рваная
     кромка (маска из пикселей исходника 1584px выходила зубчатой), а синий
     залезал на телефон: его светлая рамка по цвету почти совпадает со
     старым белым экраном. Теперь маска — ровный четырёхугольник экрана,
     а телефон вычитается по силуэту: тёмный экран телефона, расширенный
     на толщину рамки.

   Логотип не генерируется: ТЗ п.3 требует «согласованный» логотип, а
   нейросети искажают чужие знаки. Рисуется в увеличенной до 2560px
   картинке — на экранах 1536–1920px почти один к одному, буквы не плывут.

3. **Фон приводится к 2560px** (Lanczos). Исходник 3168px уменьшается и в
   подкрутке резкости не нуждается. Прежний, 1584px, увеличивался, и
   резкость ему добавлялась **только справа**, на предметах: слева, под
   текстом, она усиливала линии глобуса, и подзаголовок падал с 5.01 до
   4.29 при норме 4.5. Скрипт выбирает путь сам по ширине исходника.
   Качество JPEG 88 (прежнее 84 сжимало 385 КБ исходника до 64 КБ и само
   давало «мыло»).

Исходники лежат в `assets-src/` (вне git): `hero-raw.jpg` — картинка 3168px
(она же `hero-raw (2).jpg`, как скачана из Gemini), `hero-raw-1584.jpg` —
прежняя из Nano Banana 2, `logo_latin/` — логотипы заказчика в трёх цветах. В сборку идут
`public/hero.jpg` (фон) и `public/kt-logo-white.png` (логотип над
заголовком).

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
- **Разрешение 1584×672** вместо 2560 и больше. Закрыто в октябре 2026
  перерисовкой в Gemini: 3168×1344.

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

Замерено по пикселям: фон баннера собран в canvas точно как в CSS —
градиент `.hero`, картинка с `cover` по центру, круги `.hero-art` там, где
они видны, и вуаль `.hero-scrim`, — и в прямоугольнике каждой строки текста
найдена худшая точка (шаг 2px). Картинку для замера грузить в обход кэша
(`fetch('/hero.jpg', {cache: 'reload'})`): браузер долго держит прежнюю.

Замер 14 октября 2026, картинка 3168px:

| Экран | Подпись у логотипа | Заголовок (норма 3) | Подзаголовок | Факты |
|---|---|---|---|---|
| 1536×864 | 8.44 | 4.98 | 5.27 | 8.01 |
| 1440×900 | 8.44 | 5.02 | 5.33 | 8.01 |
| 1920×1080 | 8.15 | 4.98 | 5.16 | 7.83 |
| 1366×768 | 8.46 | 4.91 | 5.33 | 8.38 |
| 1280×800 | 8.50 | 4.96 | 5.34 | 8.19 |
| 1360×625 | 8.44 | 7.93 | 8.14 | 8.32 |
| 2560×1440 | 5.21 | 5.08 | 5.10 | 5.35 |
| 1024×768 (градиент) | 5.44 | 5.04 | 5.71 | 6.45 |
| 375×667 (градиент) | 5.37 | 5.09 | 5.78 | 6.71 |

Худшее значение из двух языков. Норма 4.5, для заголовка 3.0. С картинкой
1584px заголовок давал 4.63–4.81, подзаголовок 4.74–4.90: рост — от того,
что под текстом больше нет подкрученной резкости.

**Если меняете картинку, ширину текста или вуаль — перемеряйте.** Прежний
расчёт для новой картинки недействителен: с вуалью, подобранной под старую,
подзаголовок на новой давал 3.56.

## Перерисовка в высоком разрешении

Приложить к запросу `hero-raw-1584.jpg` (пустой экран ТВ), в настройках
Gemini выбрать 21:9 и максимальное разрешение.

```text
Upscale and remaster the attached image into an ultra-high-quality version.

Keep EVERYTHING exactly as in the original: the same composition, the same
objects in the same positions, sizes, angles and proportions, the same camera
angle, the same colors and lighting. This is a faithful high-resolution
re-render of the same scene, not a new image. Do not move, add, remove or
redesign anything.

Aspect ratio: 21:9, same framing as the original. Output at the maximum
available resolution (4K, at least 3840 px wide).

Improve only the quality: crisp clean edges, smooth glossy "3D plastic"
surfaces, clean gradients without banding, noise or artifacts. The thin
white wireframe globe lines stay faint, thin and even. The gold SIM chip
and golden-yellow accents keep their color.

Keep the left half an evenly toned deep royal blue (#0044BC), calm and dark,
with no glow and no new details — white text will be placed there.

The TV screen stays blank, glossy and light; the smartphone screen stays
blank and dark.

Do NOT add: any text, letters, numbers, logos, brand marks, watermarks,
icons or interfaces on screens, people, hands, red color.
```

Пришло 3168×1344 — вдвое, а не 4K, но для 2560px с запасом.

**Кайма у телефона — исправлена.** По краю рамки телефона, где он заходит
на экран ТВ, шла тонкая неровная светлая полоска старого белого экрана.
Маска телефона строилась в кадре 1584px размытием с порогом и выходила
волнистой и шире рамки: ~15px исходника 3168 при толщине рамки 8.5px
(замер: на 8.5px от тёмного экрана телефона цвет выходит на ровный цвет
экрана ТВ). Теперь маска строится в полном разрешении по точному
расстоянию (`scipy.ndimage.distance_transform_edt`) с краем,
сглаженным на пиксель, — функция `phone_mask` в скрипте. Изменились
только пиксели на 75–80% ширины, левее 60% картинка совпадает до бита,
поэтому замеры контраста выше остаются в силе.

## Замена картинки

1. Положить исходник в `assets-src/hero-raw.jpg` — чем крупнее, тем лучше,
   в идеале от 2560px.
2. В `scripts/hero-image.py` поправить `SEED` (точка внутри экрана ТВ),
   `OCCLUDER` (откуда начинается телефон), `PHONE_SEED` (точка на тёмном
   экране телефона) и `PHONE_FRAME` (толщина его рамки).
3. `python scripts/hero-image.py` — пересоберёт `public/hero.jpg`. Посмотреть
   контрольный кадр `assets-src/hero-screen-check.png` и сам результат
   вблизи: край экрана без кромки, телефон не закрашен.
4. Перемерить обрезку и контраст.
