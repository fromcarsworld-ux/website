# website

Pixel-exact build of the **1440w light** home page design (Encore — "Create events
that transform"), implemented as a dependency-free static site: hand-written HTML,
CSS and vanilla JS. No framework, no build step.

```
index.html        markup + inline SVG sprite (icons, brand mark, slide mark, seals)
css/main.css      every value mapped 1:1 from the design spec
js/main.js        fit-to-width scaling, news rail, services carousel, anchor scroll
assets/img/       photography (AI-generated placeholders — see below)
assets/fonts/     Open Sans latin 400/500/600/700 (self-hosted woff2, OFL licensed)
```

## Run it

```bash
npm start                 # python3 -m http.server 8080 --bind 0.0.0.0
# or any static server:  npx serve .
```

Then open http://localhost:8080

## How the spec maps to the code

The design is a fixed 1440 px canvas, so it is built exactly that way — three
absolutely positioned layers inside `.page` (1440 × 3017.77):

| Layer | Spec | CSS |
|---|---|---|
| Header | `top 0, h 96` | `.site-header` → `.nav` (`left 16, top 16, 1408 × 80`) |
| Main | `top 96, h 2513.58` | `.main` — all children use the spec's main-relative offsets verbatim |
| Footer | `top 2609.58, h 408.19` | `.site-footer` → `.footer-panel` (`left 16, 1408 × 392.19`) |

Below 1440 px the whole canvas is scaled (`transform: scale()`) rather than
reflowed, so the composition stays identical — the design has no smaller
breakpoints in the supplied spec.

Notable spec details that are reproduced rather than approximated:

* **Hero diamonds** — containers are rotated `45deg`; each `<img>` is the
  container diagonal (`a × √2`: 462.22 / 228.88 / 361.79) counter-rotated
  `-45deg` and centred, so the photo reads upright inside the diamond.
* **Hero "Mask group" `#B1B1B1` vector** — that is a Figma *mask* shape, not a
  painted layer, so it clips (`.hero-art`) instead of filling the frame grey.
* **News section** — the two white `Background` panels in the spec are masks:
  `.news__wipe` (`left -528, 600 × 275`) and `.news__seam` (`left 372, 16 × 250`).
  They only make sense if the featured card and the media card are **pinned** and
  the 22-item rail slides *underneath* them, which is how it is built
  (`.news__viewport` z1 → rail, z2/z3 → wipe, pinned cards, seam).
* **Card text boxes** use the spec's exact widths (177.28 / 209.12 / 240.50 /
  234.78 / 165.34 px) so line breaks land where the design has them.
* **`View →` / `Learn More →`** arrows are positioned from the spec's icon boxes
  (text at `left 24`, icon at `left 64.11` → `+40.11px`, `-4.6px` lower).
* **Services carousel** — image column rebuilt from the sub-boxes:
  `309 × 403.91` at `top 40`, `308.98 × 258.48` at `(329, 0)`,
  `199.33 × 223.73` at `(329, 278.49)`, abstract mark `89.66 × 223.73` at
  `(548.33, 278.49)`; copy at `left 682`; dots `72 × 4` on an `80px` pitch.
* Tabs (`top 1228.98`) drive the services carousel and carry the 4 px purple
  underline at `bottom: -4px` from the spec.

## Placeholder assets

The spec references images that were not supplied (`url(.jpg)` / `url(.png)`) and
third-party brand marks. Those are stand-ins, sized to the exact boxes in the
spec so layout is unaffected:

* `assets/img/*.jpg` — AI-generated event photography.
* `#i-logo` — original placeholder brand mark + wordmark inside the reserved
  `144.14 × 40` box (colour shards follow the spec's vector bounding boxes).
* `#seal-a … #seal-e` — original placeholder seals for the recognition row
  (Fortune 100 / Great Place to Work / travel-guide / sustainability / veterans
  badges). Descriptions are kept in `aria-label`.
* `#i-mark`, `#i-device` — original abstract graphics built from the spec's
  vector boxes (65 × 98 mark, 70 × 119 device mock).

Swap in the licensed brand assets whenever they are available; nothing else needs
to change.
