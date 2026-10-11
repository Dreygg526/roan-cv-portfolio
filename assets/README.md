# Assets

Every image and the CV live here and are referenced as `assets/<file>` from `index.html`.
Nothing in the project points above its own root.

Every slot has a built-in placeholder. If a file is missing, the placeholder stays and is
labelled with the slot name and ratio. If the file is present, it covers the placeholder.
No code change is needed either way. **Use the exact file names below.**

| Slot | File name | Ratio | Recommended size | Where it shows |
|---|---|---|---|---|
| Portrait | `photo.jpg` | 1:1 | 800 × 800 px | The circle in the rail, and the intro gate |
| Creative Operations Dashboard | `project-dashboard.webp` | 2:1 | 1600 × 800 px | Project screenshot. Take it from a real logged-in view with names blurred if needed |
| Standard Lab Tracking | `project-tracking.webp` | 2:1 | 1600 × 800 px | Project screenshot. The customer-facing tracking timeline is the strongest view |
| BraillTap | `project-braille.webp` | 545:282 | 545 × 282 px (supplied) | A photo of the physical device, ideally in use |
| CV | `cv.pdf` | — | — | Every "Download CV" link. Copy of `Desktop\portfolio-redesign\source-cv.pdf` (the 2026 CV); re-copy it whenever the CV changes |

## Export tips

- Export screenshots at 2× the display size and compress to WebP at quality 80–85.
  Each file should land well under 400 KB.
- Crop to the exact ratio before exporting. The slots use `object-fit: cover`, so a
  wrong ratio gets cropped rather than distorted, but you lose control of what is cut.
- Blur or replace any customer names, emails or order numbers in the tracking and
  dashboard screenshots before uploading anywhere public.


## Landing pages (`landing-pages.html`)

One screenshot per page in `assets/lp/<name>.webp`: a phone view taken at 390px wide, cropped to 9:16 from the top, saved at 600 × 1067 px. Add a matching `<li>` in `landing-pages.html`.
