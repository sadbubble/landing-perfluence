"""
Наложение официального логотипа Казахтелекома на экран телевизора
на картинке верхнего баннера.

Зачем так, а не генерацией: нейросети перерисовывают чужие логотипы и
искажают буквы, а ТЗ п.3 требует «согласованный» логотип. Здесь берётся
официальный файл заказчика и кладётся на экран с правильной перспективой —
знак остаётся точной копией оригинала.

Запуск из корня проекта:

    python scripts/hero-logo-on-tv.py

Вход:  assets-src/hero-raw.jpg            — картинка из Nano Banana
       assets-src/logo_latin/original.png — цветной логотип (синий знак,
                                            тёмная надпись — экран светлый)
Выход: public/hero.jpg

Папка assets-src вне git (оригиналы шрифтов и материалы заказчика), поэтому
входные файлы надо получить у заказчика.

ЕСЛИ КАРТИНКА НОВАЯ — поправьте SEED: любая точка внутри экрана телевизора.
Углы экрана скрипт находит сам: заливкой светлой области от SEED и подгонкой
прямых по четырём краям. Подгонка, а не крайние точки — потому что угол
экрана может прятаться за другим предметом (на картинке октября 2026 правый
нижний угол закрыт телефоном), и тогда он вычисляется продолжением краёв.
Скрипт сохраняет контрольный кадр с найденным контуром — посмотрите его.
"""

from collections import deque

import numpy as np
from PIL import Image, ImageDraw

SRC = "assets-src/hero-raw.jpg"
LOGO = "assets-src/logo_latin/original.png"
OUT = "public/hero.jpg"
CHECK = "assets-src/hero-screen-check.png"

SEED = (1130, 233)          # точка внутри экрана на hero-raw.jpg 1584x672
OCCLUDER = (1185, 295)      # всё правее и ниже — телефон, заливку там отсекаем

# Логотип в долях экрана: ширина 62%, центр чуть выше середины — так его
# не перекрывает телефон в правом нижнем углу.
LOGO_W, LOGO_CU, LOGO_CV = 0.62, 0.44, 0.45
LOGO_OPACITY = 0.9          # сквозь логотип немного проступает блик стекла


def screen_pixels(img):
    w, h = img.size
    p = img.load()

    def is_screen(c):
        r, g, b = c[:3]
        return r >= 165 and g >= 195 and b >= 225

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
    base = Image.open(SRC).convert("RGBA")
    w, h = base.size
    quad = screen_quad(screen_pixels(base.convert("RGB")))

    check = base.convert("RGB")
    ImageDraw.Draw(check).line([tuple(c) for c in quad] + [tuple(quad[0])], fill=(255, 0, 0), width=3)
    check.save(CHECK)

    logo = Image.open(LOGO).convert("RGBA")
    lw, lh = logo.size
    to_image = homography([(0, 0), (1, 0), (1, 1), (0, 1)], quad)

    def at(u, v):
        p = to_image @ np.array([u, v, 1])
        return p[:2] / p[2]

    top_len = np.linalg.norm(quad[1] - quad[0])
    side_len = np.linalg.norm(quad[3] - quad[0])
    vh = LOGO_W * top_len / (lw / lh) / side_len
    u0, u1 = LOGO_CU - LOGO_W / 2, LOGO_CU + LOGO_W / 2
    v0, v1 = LOGO_CV - vh / 2, LOGO_CV + vh / 2

    ss = 3  # рисуем втрое крупнее и уменьшаем — ровные края без лесенки
    target = [at(u0, v0) * ss, at(u1, v0) * ss, at(u1, v1) * ss, at(u0, v1) * ss]
    inv = homography(target, [(0, 0), (lw, 0), (lw, lh), (0, lh)])
    coeffs = tuple((inv / inv[2, 2]).flatten()[:8])
    layer = logo.transform((w * ss, h * ss), Image.PERSPECTIVE, coeffs, Image.BICUBIC)
    layer = layer.resize((w, h), Image.LANCZOS)
    layer.putalpha(layer.getchannel("A").point(lambda a: int(a * LOGO_OPACITY)))

    out = Image.alpha_composite(base, layer).convert("RGB")
    out.save(OUT, quality=84, optimize=True, progressive=True)
    print("углы экрана:", np.round(quad, 1).tolist())
    print("готово:", OUT, "| контроль контура:", CHECK)


if __name__ == "__main__":
    main()
