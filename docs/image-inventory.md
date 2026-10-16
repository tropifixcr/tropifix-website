# Image inventory

Every generated image and video on the site. All are **AI placeholders: replace with a real photo** when one is available. To swap one, replace the file at the same path with the same name; no code change is needed.

Naming pattern: `src/assets/<page>-<slot>.<ext>` for images (for example `src/assets/home-hero-poster.jpg`) and `public/video/<page>-<slot>-<width>.<ext>` for video. Replacing a video means re-encoding it to the same three files: no sound, 1280 px wide for desktop (MP4 and WebM), 720 px for phones (MP4).

| File | Page | Prompt | Model | Status |
| --- | --- | --- | --- | --- |
| `src/assets/home-hero-poster.jpg` | Home hero (poster, and still for phones and reduced motion) | Modern two-storey hillside home in Guanacaste with a long pool and an open furnished ground-floor terrace, midday, Pacific view (built in three edits: dusk original, daytime version, front door replaced by an open terrace) | Higgsfield GPT Image 2, 16:9, 2K, medium | AI placeholder: replace with real photo |
| `public/video/home-hero-1280.mp4`, `home-hero-1280.webm` (desktop, 1.3 MB each) and `home-hero-720.mp4` (phones, 0.3 MB) | Home hero loop, 8 s, silent | Made from the hero poster as first and last frame: fixed camera, palm fronds swaying, pool ripples, clouds drifting | Higgsfield MiniMax H3, 16:9 | AI placeholder: replace with real footage |
| `public/og-default.jpg` | Share image, every page | Crop of the hero poster with the supplied white logo on a teal band, 1200×630 | (derived, no generation) | AI placeholder: replace with real photo |

## Credits spent

| Date | Item | Credits |
| --- | --- | --- |
| 2026-10-02 | Hero still, first attempt (too dark, rejected) | 2 |
| 2026-10-02 | Hero still, modern home at dusk | 2 |
| 2026-10-02 | Daytime version | 2 |
| 2026-10-02 | Open terrace edit (approved) | 2 |
| 2026-10-02 | White walls edit (not used) | 2 |
| 2026-10-02 | Hero video, 8 s, MiniMax H3 | 16 |
