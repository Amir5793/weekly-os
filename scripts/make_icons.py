"""Generate PWA icons (no dependencies): dark blue-black canvas, green tile, white check.

Run:  python scripts/make_icons.py
Out:  public/icons/icon-192.png, icon-512.png, icon-maskable-512.png, apple-touch-icon.png
"""
import struct
import zlib

BG = (11, 18, 32)        # #0b1220 — blue/black
TILE = (21, 128, 61)     # #15803d — brand green
MARK = (255, 255, 255)   # check mark


def write_png(path, w, h, pixels):
    raw = b"".join(b"\x00" + bytes(v for px in row for v in px) for row in pixels)

    def chunk(tag, data):
        return (struct.pack(">I", len(data)) + tag + data
                + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))

    out = b"\x89PNG\r\n\x1a\n"
    out += chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
    out += chunk(b"IDAT", zlib.compress(raw, 9))
    out += chunk(b"IEND", b"")
    with open(path, "wb") as f:
        f.write(out)


def in_rounded_rect(x, y, x0, y0, x1, y1, r):
    if x < x0 or x > x1 or y < y0 or y > y1:
        return False
    cx = min(max(x, x0 + r), x1 - r)
    cy = min(max(y, y0 + r), y1 - r)
    return (x - cx) ** 2 + (y - cy) ** 2 <= r * r


def dist_to_segment(px, py, ax, ay, bx, by):
    vx, vy = bx - ax, by - ay
    wx, wy = px - ax, py - ay
    seg_len2 = vx * vx + vy * vy
    t = 0.0 if seg_len2 == 0 else max(0.0, min(1.0, (wx * vx + wy * vy) / seg_len2))
    dx, dy = px - (ax + t * vx), py - (ay + t * vy)
    return (dx * dx + dy * dy) ** 0.5


def make_icon(size, inset_frac):
    inset = int(size * inset_frac)
    x0, y0, x1, y1 = inset, size - inset, size - inset, size - inset
    radius = int((x1 - x0) * 0.24)
    c = size / 2.0

    p0 = (size * 0.32, size * 0.51)
    p1 = (size * 0.45, size * 0.65)
    p2 = (size * 0.70, size * 0.35)
    stroke = size * 0.10

    pixels = []
    for y in range(size):
        row = []
        for x in range(size):
            color = BG
            if in_rounded_rect(x + 0.5, y + 0.5, x0, y0, x1, y1, radius):
                color = TILE
                d = min(
                    dist_to_segment(x + 0.5, y + 0.5, p0[0], p0[1], p1[0], p1[1]),
                    dist_to_segment(x + 0.5, y + 0.5, p1[0], p1[1], p2[0], p2[1]),
                )
                if d <= stroke / 2:
                    color = MARK
            row.append(color + (255,))
        pixels.append(row)
    return pixels


ICONS = [
    ("public/icons/icon-192.png", 192, 0.172),
    ("public/icons/icon-512.png", 512, 0.172),
    ("public/icons/icon-maskable-512.png", 512, 0.227),
    ("public/icons/apple-touch-icon.png", 180, 0.172),
]

if __name__ == "__main__":
    for path, size, inset in ICONS:
        write_png(path, size, size, make_icon(size, inset))
        print("wrote", path, f"{size}x{size}")
