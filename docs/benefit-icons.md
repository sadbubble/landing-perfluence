# Иллюстрации для секции «Почему подключают у нас»

## Что нужно

Три плитки, по одной на карточку. Формат — **16:10 горизонтально**, от
1200px по ширине. Файлы кладутся в `public/`:

| Файл | Карточка | Что на плитке |
|---|---|---|
| `benefit-partner.jpg` | Официальный партнёр | Щит с галочкой |
| `benefit-fast.jpg` | Подключаем быстро | Календарь с галочкой и секундомер |
| `benefit-price.jpg` | Без скрытых доплат | Ценник и монеты |

Слоты в коде уже есть — как только файлы появятся в `public/`, они
подхватятся сами. Пока файлов нет, карточка показывает ровную фирменную
подложку, ничего не ломается.

## Два правила, без которых выйдет брак

**Никакого текста, букв, цифр и значка ₸.** Генераторы рисуют их искажённо,
и переводить такую картинку на казахский нечем. Все надписи — «0 ₸»,
«1–2 дня» — уже стоят в вёрстке поверх карточки, чёткими и переключаемыми.

**Три плитки должны выглядеть как одна серия.** Если генерировать их
по отдельности, свет и материалы разъедутся, и в ряду это сразу видно.
Поэтому просите **одно изображение из трёх плиток сразу**, а потом
разрежьте. Промпт ниже написан именно так.

## Промпт: все три плитки одним изображением

```
Ultra high quality 3D render, one wide image containing exactly three
separate square tiles side by side, evenly spaced, equal size, like a
set of app icons in a single sheet.

Shared style for all three tiles: soft matte and glossy plastic objects
floating slightly above a plain soft background, gentle studio lighting
from the upper left, soft contact shadows, subtle depth of field. Clean,
friendly, premium. Identical lighting, identical camera angle and
identical material finish across all three tiles.

Tile 1: a rounded shield with a bold check mark carved into it, standing
upright. Background of this tile: soft light blue.

Tile 2: a rounded desk calendar with a check mark on its page, next to a
small stopwatch. Background of this tile: soft light mint green.

Tile 3: a rounded price tag hanging from a short string, next to two
stacked coins. Background of this tile: soft light amber.

Each object is centred in its own tile with generous empty space around
it. Objects in white and light grey with one accent colour each, matching
that tile's background but more saturated.

Rendering: octane style 3D product visualisation, extremely sharp, 8K,
crisp edges, no noise, no grain.

Do NOT include: any text, letters, numbers, currency symbols, logos,
watermarks, people, hands, faces, drop shadows on the floor, cluttered
backgrounds, dark or moody tones.
```

## Как разрезать на три файла

Сохраните полученное изображение в `Downloads` и скажите мне — разрежу и
сожму сам. Если хотите вручную:

```bash
npx sharp-cli --input sheet.jpg --output public/benefit-partner.jpg extract --left 0 --top 0 --width 33% --height 100%
```

Целевой вес каждого файла — до 80 КБ. Карточка показывает плитку шириной
около 380px, поэтому 1200px по ширине хватает и для Retina.

## Если результат не тот

| Что не так | Что дописать в промпт |
|---|---|
| Плитки разного стиля | `all three tiles rendered in one identical scene setup, same light, same materials` |
| Появились надписи на ценнике | `the price tag is completely blank, no text, no numbers` |
| Объекты слишком мелкие | `each object fills about 60% of its tile` |
| Слишком пёстро | `muted pastel backgrounds, one accent colour per tile` |
| Слились в одну сцену | `three clearly separate tiles with visible gaps between them` |

## Запасной вариант — по одной плитке

Если сетка из трёх не получается, генерируйте по одной, **обязательно
повторяя блок «Shared style» дословно** в каждом промпте, иначе серия
развалится. Меняйте только описание объекта и цвет фона.
