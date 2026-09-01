# Изображение для нижнего баннера

## Что генерируем

**Фон баннера целиком** — синюю плашку с объёмными объектами по краям. Не
отдельные предметы на прозрачном: здесь картинка заменяет всю заливку,
поэтому в неё входит и сам фирменный градиент.

Текст, «пилюли» с цифрами и кнопка остаются вёрсткой — они переключаются
на казахский и должны быть чёткими на любом экране.

## Три правила

**Никакого текста, цифр, значков валюты и логотипов.** Всё это уже есть в
вёрстке поверх баннера.

**Объекты по краям, середина пустая.** Текст остаётся по центру — так
нижний баннер не повторяет верхний, где текст слева, а объекты справа.
Две одинаковые композиции в начале и в конце страницы выглядели бы как
одна и та же картинка, вставленная дважды.

**Пропорции 3:1**, от 2400px по ширине. Панель на десктопе примерно
1200×400, на мобильном картинка отключится — там останется градиент, как
сделано в верхнем баннере: узкий кадр обрезал бы всё полезное.

## Промпт

```
Ultra high quality 3D render, wide horizontal banner, 3:1 aspect ratio,
for the closing call-to-action block of a home internet provider landing
page.

Background: smooth gradient from bright azure blue (#008EFF) at the edges
to deeper navy blue (#0044BC) toward the centre, rich and saturated, clean
and even. A few very soft concentric rings of lighter cyan (#00D9FF), low
contrast, like a faint signal.

Objects: a symmetrical arrangement framing the frame from both sides. On
the left edge: a small simple modern house shape in smooth white plastic
with a softly glowing cyan Wi-Fi arc above its roof. On the right edge: a
few floating rounded abstract shapes — a sphere, a soft cube, a thin ring
— in white and light cyan. Everything levitating with soft contact
shadows, balanced in visual weight between the two sides.

Composition: the CENTRE of the frame is completely empty and calm, a clean
uninterrupted gradient across the middle third, slightly darker than the
edges. Objects hug the left and right edges only and never cross into the
middle. Centred headline text will be placed over that empty middle.

Lighting and finish: soft studio lighting, glossy and matte plastic
surfaces, gentle rim light, subtle depth of field, a few faint floating
particles. Clean, premium, optimistic, inviting.

Rendering: octane style 3D product visualisation, extremely sharp, 8K,
crisp edges, no noise, no grain.

Do NOT include: any text, letters, numbers, currency symbols, logos,
watermarks, people, hands, faces, screens with user interfaces, routers or
tablets, anything in the centre of the frame, cluttered composition, pale
or desaturated colours, dark or moody tones.
```

Роутер и планшет в запретах намеренно: они уже есть в верхнем баннере, и
повтор тех же предметов внизу выглядел бы как одна и та же картинка
дважды. Дом с сигналом закрывает мысль «проведём к вам домой».

## Если результат не тот

| Что не так | Что дописать |
|---|---|
| Объекты залезли в середину | `the middle third is absolutely empty, objects touch only the left and right edges` |
| Края перевешивают один другой | `equal visual weight on both sides, symmetrical balance` |
| Градиент бледный | `saturated vivid blue, high colour intensity, not pastel` |
| Слишком пёстро | `only blue tones and white objects, no other colours` |
| Дом вышел детализированным | `extremely simple stylised house, minimal geometry, no windows` |
| Кольца сигнала забивают кадр | `signal rings barely visible, very low contrast` |

## Что дальше

Сохраните готовый файл в `Downloads` и скажите — дальше я:

1. Сожму до 2400px и JPEG (цель — до 250 КБ, это не первый экран, но всё
   равно мобильный трафик).
2. Подставлю фоном в `.cta-banner`, с нынешним градиентом как запасным
   вариантом, если файл не загрузится.
3. Проверю контраст белого заголовка **по реальным пикселям середины
   кадра** — как делал с верхним баннером, где расчёт заставил переделать
   вуаль. Текст остаётся по центру.
4. Отключу картинку на мобильном, там останется градиент.
