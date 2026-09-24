"""512px runtime derivatives; approved PNG masters are read-only.

Whole-canvas proportional downsampling (nearest integer height) and conservative
WebP compression only. No crop, edge cleanup, sharpening or generative edits.
"""
import hashlib
import json
from pathlib import Path
from PIL import Image

SOURCE = Path('/Users/vladyslavdementiev/Downloads/leo-state-pack')
TARGET = Path(__file__).resolve().parents[1] / 'images/leo-advisor'
STATES = ('hide', 'peek', 'react', 'inspect')
for state in STATES:
    if not (SOURCE / f'leo-{state}.png').is_file():
        raise SystemExit(f'Missing leo-{state}.png')
TARGET.mkdir(exist_ok=True)
records = []
for state in STATES:
    source = SOURCE / f'leo-{state}.png'
    image = Image.open(source).convert('RGBA')
    output = TARGET / f'leo-{state}.webp'
    runtime_size = (512, round(image.height * 512 / image.width))
    runtime = image.resize(runtime_size, Image.Resampling.LANCZOS)
    runtime.save(output, 'WEBP', quality=88, method=6, alpha_quality=100)
    decoded = Image.open(output).convert('RGBA')
    assert decoded.size == runtime_size
    assert decoded.getchannel('A').tobytes() == runtime.getchannel('A').tobytes()
    alpha = image.getchannel('A')
    records.append(dict(state=state, source=source.name, size=list(image.size),
        alpha_bounds=list(alpha.getbbox()),
        anchor_bounds_alpha128=list(alpha.point(lambda x: 255 if x >= 128 else 0).getbbox()),
        source_bytes=source.stat().st_size, runtime_bytes=output.stat().st_size,
        source_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
        runtime_sha256=hashlib.sha256(output.read_bytes()).hexdigest(),
        runtime_dimensions=list(runtime_size), runtime_quality=88,
        resize='whole-canvas LANCZOS; proportional height rounded to nearest pixel',
        runtime_alpha_lossless=True, source_master_unchanged=True))
(TARGET / 'asset-manifest.json').write_text(json.dumps(records, indent=2) + '\n')
print(json.dumps(records, indent=2))
