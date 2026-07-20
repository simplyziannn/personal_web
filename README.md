# Zi An Lee — Clay Museum Portfolio

A framework-free, scroll-scrubbed portfolio that follows a clay character through a neo-Roman museum.

## Preview locally

```bash
python3 -m http.server 4173
```

Then open `http://127.0.0.1:4173/`.

## Journey

1. The Portico — closed bronze doors open inward as Zi An enters
2. Artifact Hall — 14 floating, clickable project objects on Roman pedestals
3. Colonnade Walk — a side-profile walk through the same gallery
4. Contact Oculus — the sunset finale, followed by the static Final Atrium

## Implementation

- Two new 5-second Seedance 2.0 Mini camera legs at native 1280×720
- One locally encoded 0.6-second gallery-to-side-view bridge
- Blob-backed video loading for reliable seeking on static hosts
- Encoded first-frame posters to prevent the initial still/video jump
- Static SEO copy in the served HTML
- Fourteen accessible on-scene artifact links, each leading to a dedicated static project page
- A separate static contact/experience atrium entered at maximum scroll
- Verified public GitHub links; private projects stay source-safe and display case-study notices
- Crop-safe phone layout with reduced-motion and low-power fallbacks

The new entrance-to-gallery handoff is frame-locked; the deliberate camera cut into the side view is softened by a short local bridge.

## Assets

- Source stills: `public/assets/stills/`
- Web video: `public/assets/vid/`
- Original video generations: `public/assets/vid/raw/`
- Archived first interior version: `public/assets/vid/archive-v1/`
- Loading posters: `public/assets/posters/`
- Generation prompts and boundary frames: `production/`

## Higgsfield usage

This revision used 27 credits: 2 for the closed-door reference image and 25 for two Seedance 2.0 Mini clips. No automatic rerolls were used. The verified remaining Starter balance is 62.2 credits.
