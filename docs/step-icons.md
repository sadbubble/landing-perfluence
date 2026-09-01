# Иллюстрации для секции «Как подключить»

## Почему нужна перегенерация

Первый набор рисовался под прежнюю палитру: бледно-голубое свечение вокруг
предмета. Рядом с фирменным `#008EFF` из гайда оно выглядит вылинявшим —
иконки читаются как выцветшие, а не как часть новой палитры.

Новый набор строится **на цветах гайда**: свечение `#00D9FF`, акценты на
предметах `#008EFF`, глубокие тени в сторону `#0044BC`.

## Чем эти три отличаются от остальных секций

Вёрстка уже под них: круг 120px, номер шага плашкой на нём, пунктир между
шагами. Форма намеренно круглая — квадратные плитки в лендинге больше не
используются, но если вернутся, секции не должны совпасть.

## Что нужно

Три круглые иконки, файлы в `public/` (заменят существующие):

| Файл | Шаг | Предмет |
|---|---|---|
| `step-form.png` | 1. Оставьте заявку | Смартфон с пустым экраном, палец нажимает |
| `step-call.png` | 2. Мы перезвоним | Гарнитура с микрофоном и метка на карте |
| `step-install.png` | 3. Подключим | Wi-Fi роутер рядом с домиком |

## Два правила

**Никакого текста, цифр и интерфейсов на экранах.** Номера шагов стоят в
вёрстке плашкой поверх круга — чёткие и не требующие перевода на казахский.

**Все три — одним изображением.** По отдельности свет и материалы
разъедутся, и в ряду это заметно.

## Промпт

```
Ultra high quality 3D render, one wide image containing exactly three
separate round icons in a row, evenly spaced, equal size, on a plain white
background.

Shared style for all three: each object sits inside its own circle of
vivid cyan blue (#00D9FF) that fades outward into a soft halo. Objects are
smooth matte and glossy plastic, mostly white and light grey, with strong
azure blue (#008EFF) accents on one or two details of each, and deeper
navy blue (#0044BC) in the shaded parts. Viewed slightly from above at a
three quarter angle. Bright studio lighting from the upper left, soft
contact shadows, subtle depth of field. Identical lighting, identical
camera angle, identical materials across all three.

Icon 1: a smartphone lying at a slight angle with a completely blank
screen, and a soft rounded finger or tap ring touching it.

Icon 2: a headset with a microphone, next to a small rounded map pin.

Icon 3: a compact Wi-Fi router with two soft antennas, next to a small
simple house shape.

Each object is centred in its circle and fills about 60% of it, with
generous empty space around. The blue should read as confident and
saturated, not pale or washed out. Calm, friendly, premium.

Rendering: octane style 3D product visualisation, extremely sharp, 8K,
crisp edges, no noise, no grain.

Do NOT include: any text, letters, numbers, currency symbols, logos,
watermarks, user interfaces or icons on the phone screen, people, faces,
hard shadows on the floor, pale or desaturated colours, dark backgrounds.
```

## Если результат не тот

| Что не так | Что дописать |
|---|---|
| Синий снова бледный | `saturated vivid cyan, high colour intensity, not pastel` |
| Круг стал плоским диском | `the circle is a glowing halo, brightest at the centre` |
| На экране телефона появился интерфейс | `the phone screen is completely blank and switched off` |
| Иконки в разном стиле | `all three rendered in one identical scene setup` |
| Предметы позеленели | `pure blue tones only, no teal, no green` |

## Дальше

Сохраните готовый лист в `Downloads` и скажите — нарежу на три круга с
мягким прозрачным краем и заменю файлы, как делал в прошлый раз.
