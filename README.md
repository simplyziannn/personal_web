# Zi An's portfolio, disguised as a museum

This is my personal portfolio — except instead of a tidy grid of cards, you walk through a clay, neo-Roman museum.

Scroll to open the front doors, move through the gallery and inspect five featured projects. Keep going and you'll reach the final atrium, where the rest of my work, experience and contact details live.

## What you'll find inside

- **The Portico:** the front door and a quick introduction
- **The Featured Gallery:** five interactive exhibits covering fintech, automation, AI and product work
- **The Contact Oculus:** a sunset-lit exit for anyone who wants to build something together
- **The Final Atrium:** the full 14-project archive, work experience and contact links

The camera follows your scroll, while the featured exhibits are rendered as interactive 3D objects with Three.js. Reduced-motion and data-saver visitors get a lighter still-image version instead.

## Take the tour locally

You'll need Node.js and Python 3. Then:

```bash
npm install
python3 -m http.server 4173
```

Open [http://127.0.0.1:4173](http://127.0.0.1:4173), start scrolling and please don't touch the marble.

There is no build step or framework hiding behind the curtains. It's static HTML, CSS and JavaScript, so any local web server will do.

## How it works

- Scroll position controls a set of short camera clips.
- Small bridge clips and matching poster frames keep scene changes from feeling jarring.
- Three.js powers the sculpted project exhibits.
- Project details live on static, shareable pages.
- Video is loaded as blobs so seeking behaves reliably on static hosting.
- Mobile, reduced-motion and low-power modes have their own fallbacks.

## Where things live

```text
index.html                 The museum entrance and main tour
contact.html               The final atrium
project.html               The reusable project-page shell
project-data.js            Copy and metadata for every project
scrub-engine.js            Scroll-to-camera playback
artifact-sculpt.js         3D objects in the featured gallery
public/assets/             Videos, stills, posters and project images
production/                Source prompts, frames and seam checks
```

The `production/` folder is the workshop floor: useful if you're curious how the visual sequence was made, but not required to run the site.

## A note on the work

Some projects are public and link to their source. Others were built for teams, employers or private case studies, so their pages explain the work without publishing code that isn't mine to share.

Built by [Zi An Lee](https://github.com/simplyziannn) in Singapore.
