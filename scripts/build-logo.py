from PIL import Image
import os

base = os.path.join(os.path.dirname(__file__), "..", "assets", "images")
src_path = os.path.join(base, "logo-alt.png")
out_path = os.path.join(base, "logo.png")

im = Image.open(src_path).convert("RGBA")
scale = 1.4
new_size = (int(im.width * scale), int(im.height * scale))
im = im.resize(new_size, Image.Resampling.LANCZOS)

pixels = im.load()
w, h = im.size
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        if r > 240 and g > 240 and b > 240:
            pixels[x, y] = (r, g, b, 0)
        else:
            nr = max(0, min(255, int(r * 0.55)))
            ng = max(0, min(255, int(g * 0.55)))
            nb = max(0, min(255, int(b * 0.55)))
            pixels[x, y] = (nr, ng, nb, 255)

bbox = im.getbbox()
if bbox:
    im = im.crop(bbox)

pad_x, pad_y = 8, 6
padded = Image.new("RGBA", (im.width + pad_x * 2, im.height + pad_y * 2), (0, 0, 0, 0))
padded.paste(im, (pad_x, pad_y))
im = padded

im.save(out_path, optimize=True)
print("Saved", out_path, im.size)
