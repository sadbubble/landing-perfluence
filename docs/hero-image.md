# Изображение для баннера

## Что именно генерируем

Баннер собран слоями: заливка, текст, кнопки и графика — вёрсткой, а из
генератора приходит **фоновое изображение**. Просить нейросеть нарисовать
баннер целиком не надо: буквы выйдут искажёнными, логотип — выдуманным, а
переводить такую картинку на казахский нечем.

Вырезанные по контуру люди — тоже нет. Для них нужен исходник от 1200px по
высоте, иначе на первом экране сразу видно мыло (проверено на практике).

Поэтому цель — **широкий фон в стиле Казахтелекома, без людей и без текста**.

## Стиль, который берём с их сайта

На сайте оператора два узнаваемых приёма. Для фона подходит первый:

1. **Яркая синева и объёмные 3D-объекты** — так у них оформлены плитки
   интернет-магазина: роутер, планшет, умный дом, наушники. Глянцевый
   пластик, мягкий свет, чистый цветной фон. Генератору такое даётся
   надёжно: нет лиц, которые можно испортить.
2. Тёмный кинематографичный кадр (баннер OFFSIDE). Красиво, но это
   фотография футбольного матча — под наш оффер не ложится.

## Промпт

⚠️ Перед генерацией замените `PERFLUENCE_ACCENT` на фирменный цвет Perfluence
(например, `warm coral`, `vivid magenta`, `lime green` — словами, не хексом:
генераторы понимают названия точнее). Именно он даст тот самый «чуть
заметный» второй слой поверх синевы оператора.

```
Ultra high quality 3D render, wide cinematic banner, 21:9 aspect ratio,
for a home internet and TV provider landing page.

Scene: a weightless composition of clean, modern telecom devices floating
in space — a white Wi-Fi router with soft antennas, a slim tablet showing
a blank dark screen, a wireless remote, and a few smooth abstract shapes
(rounded cubes, spheres, soft rings). Everything levitating gently, casting
soft contact shadows.

Composition: all objects grouped in the RIGHT third of the frame. The LEFT
two thirds is calm empty background with a smooth gradient — headline text
will be placed there. Generous negative space, nothing crossing into the
left side.

Colour: dominant deep azure blue to bright sky blue gradient background,
rich and saturated but clean, in the spirit of a large telecom brand.
Devices in white and light grey with glossy highlights. Accent details in
PERFLUENCE_ACCENT on a few small elements only — a thin ring, a small
sphere, the glow of one screen edge — no more than five percent of the
image, subtle but noticeable.

Lighting and finish: soft studio lighting, gentle rim light on the objects,
smooth glossy plastic and matte surfaces, subtle depth of field, faint
bokeh particles in the background. Clean, premium, optimistic mood.

Rendering: octane style 3D product visualisation, extremely sharp detail,
8K, crisp edges, no noise, no grain.

Do NOT include: any text, letters, numbers, logos, watermarks, brand marks,
user interfaces or icons on screens, people, hands, faces, cluttered
backgrounds, dark or moody tones, harsh shadows.
```

### Вариант помягче — абстрактный, без предметов

Если предметы выйдут неудачно, этот вариант надёжнее: чистая абстракция
почти всегда получается с первого раза.

```
Ultra high quality abstract 3D render, wide cinematic banner, 21:9.

Smooth flowing shapes and soft glass ribbons floating over a deep azure to
bright sky blue gradient. Gentle concentric wave rings suggesting a signal
spreading outward, translucent glass spheres, soft light refractions.

Composition: the shapes gather in the RIGHT third of the frame; the LEFT
two thirds stays calm and almost empty for headline text.

Accent details in PERFLUENCE_ACCENT on a few small elements only, roughly
five percent of the image — subtle but noticeable against the blue.

Soft studio lighting, glossy and frosted glass materials, subtle depth of
field, faint floating particles. Clean, premium, optimistic.

Extremely sharp, 8K, no noise, no grain.

Do NOT include: text, letters, numbers, logos, watermarks, people, hands,
faces, user interfaces, dark or moody tones.
```

### Если результат не тот

| Что не так | Что дописать в промпт |
|---|---|
| Объекты по центру, лезут в текст | `all objects strictly in the right third, left 60% completely empty` |
| Слишком пёстро | `limited palette, only two blues and one accent colour` |
| Слишком тёмное | `bright and airy, high key lighting` |
| Появились иконки на экранах | `all screens completely blank and switched off` |
| Акцент забивает синий | `accent colour on one single small object only` |

## Что делать с готовым файлом

Пропорции 21:9 и от 2400px по ширине. Сохранить как `public/hero.jpg` и в
[src/index.css](../src/index.css) раскомментировать строку в `:root`:

```css
--hero-image: url('/hero.jpg');
```

Сжать перед публикацией — это первое, что грузится с мобильного интернета:

```bash
npx sharp-cli --input hero-raw.png --output public/hero.jpg resize 2400 --format jpeg --quality 80
```

Целевой вес — до 300 КБ. Проверить: `ls -lh public/hero.jpg`.

## Про вуаль над фотографией

Поверх фона лежит полупрозрачная вуаль — она нужна, чтобы белый заголовок
читался на любой картинке. Раньше она была почти чёрной и глушила синеву;
теперь она **синяя** (`--hero-veil`, по умолчанию `#0B52B5`), так что яркий
цвет оператора сохраняется и с фотографией, и без неё.

Оттенок подобран расчётом, а не на глаз: это примерно самый светлый синий,
при котором белый текст 14px ещё даёт контраст выше нормы 4.5 даже поверх
почти белой фотографии. Более светлые варианты вроде `#1976D2` дают всего
3.4 — подзаголовок и мелкие подписи становятся нечитаемыми.

Замеренный контраст в текстовой зоне:

| Что под вуалью | Десктоп | Мобильный |
|---|---|---|
| Фотографии нет | 6.93 | 6.79 |
| Среднее по яркости фото | 6.79 | 6.79 |
| Почти белое фото | 5.23 | 5.21 |

Если решите сделать вуаль ещё светлее — придётся менять цвет текста на
тёмный, белым по такому фону читать нельзя.
