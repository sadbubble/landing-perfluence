"""
Картинка верхнего баннера и логотип Казахтелекома на экране телевизора.

Запуск из корня проекта:

    python scripts/hero-logo-on-tv.py

Делает три вещи:

1. public/hero.jpg — фон баннера из assets-src/hero-raw.jpg, заранее
   увеличенный до 2560px (Lanczos + лёгкая резкость). Браузер растягивает
   мягче, а исходник из Nano Banana — всего 1584px: на экране 1536px при
   масштабе Windows 125% картинку тянуло в 1,6 раза, получалось «мыло».

2. public/kt-logo-color.png — цветной логотип из официального файла
   заказчика (assets-src/logo_latin/original.png).

3. src/lib/heroLogo.ts — где и как рисовать логотип поверх картинки.

ПОЧЕМУ ЛОГОТИП НЕ ВПЕЧЁН В КАРТИНКУ. Первая версия накладывала его прямо
в JPEG — и он растягивался вместе с маленьким исходником, буквы плыли.
Теперь логотип рисуется отдельным SVG-слоем поверх фона, в разрешении
экрана, и остаётся резким на любом мониторе.

Экран телевизора почти не искажён перспективой: аффинное преобразование
(его SVG умеет) отличается от точного перспективного меньше чем на 1px.
Скрипт это проверяет и останавливается, если ошибка больше 1.5px.

Логотип нельзя генерировать нейросетью: ТЗ п.3 требует «согласованный»
логотип, а нейросети искажают чужие знаки. Только официальный файл.

ЕСЛИ КАРТИНКА НОВАЯ — поправьте SEED (любая точка внутри экрана ТВ) и
OCCLUDER (откуда начинается предмет, закрывающий часть экрана). Углы
экрана находятся заливкой и подгонкой прямых по краям: угол, спрятанный
за другим предметом, вычисляется продолжением краёв. Посмотрите контроль-
ный кадр assets-src/hero-screen-check.png — красный контур и зелёная рамка
логотипа должны лечь на экран.
"""

from collections import deque

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SRC = "assets-src/hero-raw.jpg"
LOGO_SRC = "assets-src/logo_latin/original.png"
OUT_IMG = "public/hero.jpg"
OUT_LOGO = "public/kt-logo-color.png"
OUT_TS = "src/lib/heroLogo.ts"
CHECK = "assets-src/hero-screen-check.png"

SEED = (1130, 233)          # точка внутри экрана на hero-raw.jpg 1584x672
OCCLUDER = (1185, 295)      # правее и ниже — телефон, заливку там отсекаем

TARGET_WIDTH = 2560

# Логотип на экране ТВ выключен: заказчик посчитал его неудачным — плоский
# знак на объёмном экране читался как наклейка. Скрипт по умолчанию готовит
# только фон. Чтобы вернуть логотип: True здесь, вернуть слой в Hero.tsx
# из _archive/hero-tv-logo/ и перезапустить скрипт.
TV_LOGO = False
# Логотип по центру экрана, шириной 62% экрана. Телефон закрывает правый
# нижний угол экрана, но центр свободен — скрипт это проверяет.
LOGO_W, LOGO_CU, LOGO_CV = 0.62, 0.5, 0.5
LOGO_OPACITY = 0.9          # сквозь логотип немного проступает блик стекла


def is_screen(c):
    r, g, b = c[:3]
    return r >= 165 and g >= 195 and b >= 225


def screen_pixels(img):
    w, h = img.size
    p = img.load()
    seen, queue, pts = {SEED}, deque([SEED]), []
    while queue:
        x, y = queue.popleft()
        pts.append((x, y))
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (x + dx, y + dy)
            if n not in seen and 0 <= n[0] < w and 0 <= n[1] < h and is_screen(p[n]):
                seen.add(n)
                queue.append(n)
    return [(x, y) for x, y in pts if not (x > OCCLUDER[0] and y > OCCLUDER[1])]


def screen_quad(pts):
    """Углы TL, TR, BR, BL по прямым, подогнанным к каждому краю."""
    tl = min(pts, key=lambda t: t[0] + t[1])
    tr = max(pts, key=lambda t: t[0] - t[1])
    bl = min(pts, key=lambda t: t[0] - t[1])
    rows, cols = {}, {}
    for x, y in pts:
        rows.setdefault(y, []).append(x)
        cols.setdefault(x, []).append(y)

    def fit(sample):
        a = np.array(sample, float)
        return np.linalg.lstsq(np.c_[a[:, 0], np.ones(len(a))], a[:, 1], rcond=None)[0]

    def inner(a, b, margin=0.12):
        d = b - a
        return range(int(a + d * margin), int(b - d * margin))

    # Каждую прямую — только по участку между её углами: строки выше правого
    # верхнего угла упираются справа в верхний край, а не в правый.
    left = fit([(y, min(rows[y])) for y in inner(tl[1], bl[1]) if y in rows])
    top = fit([(x, min(cols[x])) for x in inner(tl[0], tr[0]) if x in cols])
    right = fit([(y, max(rows[y])) for y in range(tr[1] + 15, tr[1] + 105) if y in rows])
    bottom = fit([(x, max(cols[x])) for x in range(bl[0] + 20, OCCLUDER[0] - 15) if x in cols])

    def cross(v, h):  # x = a1*y + b1  и  y = a2*x + b2
        a1, b1 = v
        a2, b2 = h
        y = (a2 * b1 + b2) / (1 - a1 * a2)
        return np.array([a1 * y + b1, y])

    return np.array([cross(left, top), cross(right, top), cross(right, bottom), cross(left, bottom)])


def homography(src, dst):
    a, b = [], []
    for (x, y), (u, v) in zip(src, dst):
        a += [[x, y, 1, 0, 0, 0, -u * x, -u * y], [0, 0, 0, x, y, 1, -v * x, -v * y]]
        b += [u, v]
    return np.append(np.linalg.solve(np.array(a, float), np.array(b, float)), 1).reshape(3, 3)


def main():
    raw = Image.open(SRC).convert("RGB")
    w, h = raw.size

    # --- 1. фон
    th = round(TARGET_WIDTH * h / w)
    up = raw.resize((TARGET_WIDTH, th), Image.LANCZOS)
    sharp = up.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
    # Резкость — только справа, на предметах. Слева, под текстом, она
    # усиливала тонкие линии глобуса и давала светлые ореолы: подзаголовок
    # падал с 5.01 до 4.29 при норме 4.5. Переход плавный, от 44% до 52%
    # ширины кадра, чтобы не было видно шва.
    ramp = Image.linear_gradient("L").rotate(90, expand=True)  # 0 слева -> 255 справа
    assert ramp.getpixel((0, 128)) < ramp.getpixel((255, 128)), "маска перевёрнута"
    lo, hi = int(TARGET_WIDTH * 0.44), int(TARGET_WIDTH * 0.52)
    mask = Image.new("L", (TARGET_WIDTH, th), 0)
    mask.paste(255, (hi, 0, TARGET_WIDTH, th))
    mask.paste(ramp.resize((hi - lo, th)), (lo, 0))
    Image.composite(sharp, up, mask).save(OUT_IMG, quality=88, optimize=True, progressive=True)
    if not TV_LOGO:
        print("готово:", OUT_IMG, "(логотип на экране ТВ выключен, TV_LOGO = False)")
        return

    # --- 2. логотип
    logo = Image.open(LOGO_SRC).convert("RGBA")
    logo = logo.crop(logo.getbbox())
    lw, lh = logo.size
    web = logo.resize((1200, round(1200 * lh / lw)), Image.LANCZOS)
    web.save(OUT_LOGO, optimize=True)

    # --- 3. положение логотипа
    quad = screen_quad(screen_pixels(raw))
    hm = homography([(0, 0), (1, 0), (1, 1), (0, 1)], quad)

    def at(u, v):
        p = hm @ np.array([u, v, 1])
        return p[:2] / p[2]

    top_len = np.linalg.norm(quad[1] - quad[0])
    side_len = np.linalg.norm(quad[3] - quad[0])
    vh = LOGO_W * top_len / (lw / lh) / side_len
    u0, u1 = LOGO_CU - LOGO_W / 2, LOGO_CU + LOGO_W / 2
    v0, v1 = LOGO_CV - vh / 2, LOGO_CV + vh / 2
    p00, p10, p01, p11 = at(u0, v0), at(u1, v0), at(u0, v1), at(u1, v1)

    err = np.linalg.norm((p10 + p01 - p00) - p11)
    assert err < 1.5, f"экран искажён сильнее, чем умеет SVG: {err:.2f}px"

    # Логотип не должен заходить на предмет, закрывающий экран.
    px = raw.load()
    for t in np.linspace(0, 1, 40):
        for s in np.linspace(0, 1, 12):
            x, y = (p00 + (p10 - p00) * t + (p01 - p00) * s).round().astype(int)
            assert is_screen(px[x, y]), f"под логотипом не экран (предмет?) в точке {x},{y}"

    # SVG matrix(a b c d e f): x' = a*x + c*y + e,  y' = b*x + d*y + f
    a, b = (p10 - p00) / lw
    c, d = (p01 - p00) / lh
    e, f = p00
    m = ", ".join(f"{v:.6f}" for v in (a, b, c, d, e, f))

    ts = f"""/**
 * Положение логотипа Казахтелекома на экране телевизора в верхнем баннере.
 *
 * ФАЙЛ СГЕНЕРИРОВАН scripts/hero-logo-on-tv.py — не правьте руками, а
 * перезапустите скрипт. Координаты — в пикселях исходной картинки
 * {w}x{h}: SVG-слой с этим viewBox и preserveAspectRatio="xMidYMid slice"
 * обрезается точно так же, как фон с background-size: cover и
 * background-position: center, поэтому логотип всегда стоит на экране.
 *
 * Аффинное приближение перспективы экрана, ошибка {err:.2f}px.
 */
export const HERO_LOGO = {{
  viewBox: "0 0 {w} {h}",
  src: "/kt-logo-color.png",
  width: {lw},
  height: {lh},
  transform: "matrix({m})",
  opacity: {LOGO_OPACITY},
}} as const;
"""
    open(OUT_TS, "w", encoding="utf-8").write(ts)

    check = raw.copy()
    dr = ImageDraw.Draw(check)
    dr.line([tuple(c) for c in quad] + [tuple(quad[0])], fill=(255, 0, 0), width=3)
    dr.line([tuple(p00), tuple(p10), tuple(p11), tuple(p01), tuple(p00)], fill=(0, 200, 0), width=2)
    check.save(CHECK)

    print("углы экрана:", np.round(quad, 1).tolist())
    print(f"ошибка аффинного приближения: {err:.2f}px")
    print("готово:", OUT_IMG, OUT_LOGO, OUT_TS, "| контроль:", CHECK)


if __name__ == "__main__":
    main()
