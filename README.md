# Mozafarian — one-page (ORE-genre)

Dark-luxury single page in the style/genre of full-screen scroll experiences
(dark scenes, drag carousel with grayscale→colour reveal, oversized kinetic type).
Original code + Mozafarian brand (black / powder `#D8B2B2` / gold `#C9A96A`,
Cormorant Garamond + Jost). Built with **Lenis + GSAP ScrollTrigger** (CDN, no build step).

## Run
Any static server, e.g.:
```
python3 -m http.server 8080
```
then open http://localhost:8080

## Drop generated assets here (filenames the scaffold expects)
| Higgsfield gen | File | Notes |
|---|---|---|
| GEN 1 still → GEN 2 | `assets/hero.mp4` | 16:9 hero loop (+ optional `assets/hero-poster.webp`) |
| GEN 3 | `assets/collections/01.webp` | Eclipse |
| GEN 4 | `assets/collections/02.webp` | DolceVita |
| GEN 5 | `assets/collections/03.webp` | Haute Couture |
| GEN 6 | `assets/collections/04.webp` | Arabesque |
| GEN 7 | `assets/collections/05.webp` | Talisman |
| GEN 8 | `assets/collections/06.webp` | Scintilla |
| GEN 9 | `assets/featured.webp` | Featured piece |
| GEN 10 | `assets/heritage-1.webp` | atmosphere |
| GEN 11 | `assets/heritage-2.webp` | atmosphere |
| GEN 12 | `assets/bespoke.webp` | contact/bespoke bg |

Placeholders show automatically until the real files exist. Once assets are in,
we wire each `[data-media]` block to its image/video (currently placeholders).

## Scenes
Preloader → Hero → Heritage (counters) → Collections (drag carousel) →
Featured → Maison → Contact/Bespoke + boutiques + footer. Menu is behind `MENU`.
