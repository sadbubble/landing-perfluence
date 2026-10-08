"""
Сборка картинки верхнего баннера: public/hero.jpg

Запуск из корня проекта:

    python scripts/hero-image.py

Вход (папка assets-src вне git, файлы — у заказчика):
    assets-src/hero-raw.jpg            картинка из Nano Banana 2
    assets-src/logo_latin/white.png    белый официальный логотип КТ

Что делает:

1. Увеличивает картинку до 2560px (Lanczos). Исходник — 1584px, и браузер,
   растягивая его сам, давал «мыло». Резкость добавляется только справа, на
   предметах: под текстом она усиливала линии глобуса, и подзаголовок падал
   ниже нормы контраста.

2. «Включает» экран телевизора в фирменном стиле: экран светится градиентом
   из синих гайда, в центре — белый официальный логотип с мягким свечением,
   поверх — блики стекла из исходного рендера. Так оформлен экран планшета
   на баннере «ОҚЫ! АРАЛАС!» из гайда заказчика.

   Прошлую попытку — цветной логотип на белом экране — заказчик отклонил:
   плоский знак на объёмном экране читался как наклейка. Отличие этой:
   экран сам светится, у логотипа есть ореол, а блики стекла лежат поверх
   — изображение «за стеклом», а не на нём.

   Логотип не генерируется: ТЗ п.3 требует «согласованный» логотип, а
   нейросети искажают чужие знаки. Только официальный файл.

   Рисуется в увеличенной картинке: на экранах 1536–1920px это почти
   один к одному, поэтому буквы не плывут, как в первой версии, где логотип
   впекался в исходник 1584px.

ЕСЛИ КАРТИНКА НОВАЯ — поправьте SEED (любая точка внутри экрана ТВ) и
OCCLUDER (откуда начинается предмет, закрывающий часть экрана), затем
посмотрите контрольный кадр assets-src/hero-screen-check.png.
"""

from collections import deque

import numpy as np
from PIL import Image, ImageChops, ImageDraw, ImageFilter

SRC = "assets-src/hero-raw.jpg"
LOGO_SRC = "assets-src/logo_latin/white.png"
OUT_IMG = "public/hero.jpg"
CHECK = "assets-src/hero-screen-check.png"

SEED = (1130, 233)          # точка внутри экрана на hero-raw.jpg 1584x672
OCCLUDER = (1185, 295)      # правее и ниже — телефон (для подгонки краёв экрана)
PHONE_SEED = (1252, 381)    # точка на тёмном экране телефона
PHONE_FRAME = 6             # толщина рамки телефона, px исходника

TARGET_WIDTH = 2560
BRAND_SCREEN = True         # False — экран остаётся пустым, как в исходнике

# Цвета гайда заказчика (for landing.pdf): основной, глубокий и светлый синий
BRAND = (0x00, 0x8E, 0xFF)
BRAND_STRONG = (0x00, 0x44, 0xBC)
BRAND_LIGHT = (0x00, 0xD9, 0xFF)
SCREEN_DEEP = (0x05, 0x2A, 0x7E)  # тень градиента: тот же синий, темнее

LOGO_WIDTH = 0.58           # ширина логотипа в долях экрана


# ---------------------------------------------------------------- экран ТВ

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
    return pts


def screen_quad(all_pts):
    """Углы TL, TR, BR, BL по прямым, подогнанным к каждому краю.

    Угол, спрятанный за телефоном, вычисляется продолжением краёв. Каждая
    прямая подгоняется только по участку между её углами: строки выше
    правого верхнего угла упираются справа в верхний край, а не в правый.
    """
    pts = [(x, y) for x, y in all_pts if not (x > OCCLUDER[0] and y > OCCLUDER[1])]
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


# ------------------------------------------------------- содержимое экрана

def lerp(c1, c2, t):
    return tuple(c1[i] + (c2[i] - c1[i]) * t for i in range(3))


def screen_content(cw, ch):
    """Изображение «включённого» экрана в его собственных координатах."""
    yy, xx = np.mgrid[0:ch, 0:cw].astype(float)
    u, v = xx / (cw - 1), yy / (ch - 1)

    # Диагональный градиент: глубокий синий снизу слева -> основной сверху справа
    t = np.clip(0.55 * u + 0.45 * (1 - v), 0, 1)[..., None]
    deep, strong, brand = (np.array(c, float) for c in (SCREEN_DEEP, BRAND_STRONG, BRAND))
    img = np.where(t < 0.5, deep + (strong - deep) * (t / 0.5),
                   strong + (brand - strong) * ((t - 0.5) / 0.5))

    # Свечение за логотипом — светлый синий гайда
    d2 = ((u - 0.5) / 0.42) ** 2 + ((v - 0.5) / 0.55) ** 2
    glow = np.exp(-d2 * 1.6)[..., None] * 0.55
    img = img * (1 - glow) + np.array(BRAND_LIGHT, float) * glow

    # Виньетка к краям — экран выглядит глубже, а не плоской заливкой
    edge = np.minimum.reduce([u, 1 - u, v, 1 - v])
    vign = np.clip(edge / 0.18, 0, 1)[..., None]
    img = img * (0.78 + 0.22 * vign)

    canvas = Image.fromarray(np.clip(img, 0, 255).astype("uint8"), "RGB").convert("RGBA")

    logo = Image.open(LOGO_SRC).convert("RGBA")
    logo = logo.crop(logo.getbbox())
    lw = int(cw * LOGO_WIDTH)
    logo = logo.resize((lw, round(lw * logo.height / logo.width)), Image.LANCZOS)
    pos = ((cw - logo.width) // 2, (ch - logo.height) // 2)

    # Ореол логотипа: так светится изображение на экране
    halo = Image.new("L", canvas.size, 0)
    halo.paste(logo.getchannel("A"), pos)
    halo = halo.filter(ImageFilter.GaussianBlur(cw * 0.018)).point(lambda a: int(a * 0.55))
    canvas = Image.composite(Image.new("RGBA", canvas.size, (255, 255, 255, 255)), canvas, halo)
    canvas.alpha_composite(logo, pos)
    return canvas.convert("RGB")


def brand_screen(up, raw, k):
    pts = screen_pixels(raw)
    quad_raw = screen_quad(pts)
    quad = quad_raw * k

    # Маска — ровный четырёхугольник экрана с гладкими краями минус телефон.
    #
    # Первая версия брала маску из самих светлых пикселей экрана и сужала её.
    # Увеличенная из исходника 1584px, она выходила зубчатой, а между ней и
    # рамкой оставалась полоска старого белого экрана — по краю шла светлая
    # рваная кромка. Подогнанные прямые проходят ровно по границе экрана.
    ssm = 4
    poly = Image.new("L", (up.width * ssm, up.height * ssm), 0)
    ImageDraw.Draw(poly).polygon([tuple(c * ssm) for c in quad], fill=255)
    poly = poly.resize(up.size, Image.LANCZOS)

    # Телефон, перекрывающий угол экрана. Цветом его корпус не отделить:
    # светлая рамка телефона почти совпадает со старым белым экраном ТВ, и
    # первая версия закрасила её синим. Поэтому силуэт строится от тёмного
    # экрана телефона — его ни с чем не спутать — расширенного на толщину
    # рамки (~5px исходника, замерено сверху и сбоку), со скруглением.
    rp = raw.load()

    def phone_dark(c):
        return c[0] < 140 and c[2] < 215

    seen, queue = {PHONE_SEED}, deque([PHONE_SEED])
    occ = Image.new("L", raw.size, 0)
    op = occ.load()
    while queue:
        x, y = queue.popleft()
        op[x, y] = 255
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            n = (x + dx, y + dy)
            if n not in seen and 0 <= n[0] < raw.width and 0 <= n[1] < raw.height \
                    and phone_dark(rp[n]):
                seen.add(n)
                queue.append(n)
    # круглое расширение на рамку: размыть и взять всё, что задето
    occ = occ.filter(ImageFilter.GaussianBlur(PHONE_FRAME / 2)).point(lambda a: 255 if a > 8 else 0)
    occ = occ.resize(up.size, Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.0))
    mask = ImageChops.subtract(poly, occ)

    x0, y0 = np.floor(quad.min(axis=0)).astype(int) - 2
    x1, y1 = np.ceil(quad.max(axis=0)).astype(int) + 2
    bw, bh = x1 - x0, y1 - y0

    top_len = np.linalg.norm(quad[1] - quad[0])
    side_len = np.linalg.norm(quad[3] - quad[0])
    ss = 3                                   # рисуем крупнее и уменьшаем — без лесенки
    cw = int(top_len * ss)
    ch = int(cw * side_len / top_len)
    content = screen_content(cw, ch)

    local = (quad - [x0, y0]) * ss
    inv = homography(local, [(0, 0), (cw, 0), (cw, ch), (0, ch)])
    coeffs = tuple((inv / inv[2, 2]).flatten()[:8])
    warped = content.transform((bw * ss, bh * ss), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    warped = warped.resize((bw, bh), Image.LANCZOS)

    # Блики стекла — из исходного рендера: где экран был светлее, там блик
    region = up.crop((x0, y0, x1, y1))
    lum = np.asarray(region.convert("L"), float)
    m = np.asarray(mask.crop((x0, y0, x1, y1)), float) / 255
    inside = lum[m > 0.9]
    lo, hi = np.percentile(inside, 5), np.percentile(inside, 95)
    glare = np.clip((lum - lo) / max(hi - lo, 1), 0, 1) ** 1.6 * 0.30
    w = np.asarray(warped, float)
    w = w * (1 - glare[..., None]) + 255 * glare[..., None]
    lit = Image.fromarray(np.clip(w, 0, 255).astype("uint8"), "RGB")

    out = up.copy()
    out.paste(Image.composite(lit, region, mask.crop((x0, y0, x1, y1))), (x0, y0))

    check = raw.copy()
    ImageDraw.Draw(check).line([tuple(c) for c in quad_raw] + [tuple(quad_raw[0])],
                               fill=(255, 0, 0), width=3)
    check.save(CHECK)
    return out, quad_raw


# -------------------------------------------------------------------- main

def main():
    raw = Image.open(SRC).convert("RGB")
    w, h = raw.size
    th = round(TARGET_WIDTH * h / w)
    k = TARGET_WIDTH / w

    up = raw.resize((TARGET_WIDTH, th), Image.LANCZOS)
    sharp = up.filter(ImageFilter.UnsharpMask(radius=1.6, percent=70, threshold=2))
    # Резкость — только справа, на предметах (44% -> 52% ширины плавно)
    ramp = Image.linear_gradient("L").rotate(90, expand=True)  # 0 слева -> 255 справа
    assert ramp.getpixel((0, 128)) < ramp.getpixel((255, 128)), "маска перевёрнута"
    lo, hi = int(TARGET_WIDTH * 0.44), int(TARGET_WIDTH * 0.52)
    smask = Image.new("L", (TARGET_WIDTH, th), 0)
    smask.paste(255, (hi, 0, TARGET_WIDTH, th))
    smask.paste(ramp.resize((hi - lo, th)), (lo, 0))
    up = Image.composite(sharp, up, smask)

    if BRAND_SCREEN:
        up, quad = brand_screen(up, raw, k)
        print("углы экрана:", np.round(quad, 1).tolist())

    up.save(OUT_IMG, quality=88, optimize=True, progressive=True)
    print("готово:", OUT_IMG)


if __name__ == "__main__":
    main()
