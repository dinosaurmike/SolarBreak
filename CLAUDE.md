# SolarBreak: guide for contributors and AI coding assistants

SolarBreak (the "Solar ROI" project on the author's profile) is a residential solar break-even estimator by
Mike Warren ([dinosaurmike](https://github.com/dinosaurmike)), built as a white-label tool an installer could
brand ("Your Solar Company" logo slot). Live at <https://dinomike.ca/solar/>. All rights reserved (see `LICENSE`).

## What this repository contains

* **The built app only**: a Next.js static export (`index.html`, `calculator/`, `login/`, `404/`, `_next/`,
  `index.txt` etc. are the React Server Component payloads). The original source project is not here yet;
  when it is added, update this file.
* The build uses `basePath: "/solar"`: every asset URL starts with `/solar/_next/...`, so it must be served at
  `/solar/` (on dinomike.ca it's the website repo's `solar/` folder). `login/` only redirects to the calculator.
* `classic/solar.html`: the earlier single-file version (plain HTML/JS), still live at dinomike.ca/solar.html.
* `docs/images/`: README header GIF and social preview, with `source/record.js` (Playwright on a virtual clock,
  `vclock.js`) and `source/social-preview.html` (uses the app's own fonts from `_next/static/media`).

## Changes made to the original build (keep them, or redo them in the source)

* Labels showed escape codes (`What’s`, `How You’d Pay`, `—`, `×`): replaced with the
  real characters in `_next/static/chunks/app/**` and the HTML.
* Seven Tailwind classes used by the app were missing from the CSS (`text-white/35`, `text-white/15`,
  `bg-white/8`, `border-white/8`, `hover:bg-white/15`, `ring-black/30`, `ring-white/50`), which made the
  sidebar labels invisible. They're appended to the end of `_next/static/css/*.css` (`text-white/35` is
  50% white for legibility).
* `og:image` / `twitter:image` pointed at `http://localhost:3000/og-image.png`; now
  `https://dinomike.ca/solar/og-image.png` (set `metadataBase` in the source).
* The icon link pointed at `/favicon.svg` (the site root); now `/solar/favicon.svg`.
* Share link was `origin + "/calculator?s="` (missing the base path); now `"/solar/calculator/?s="`.
* Verdict detail for a 9 to 15 year payback said "solid but not exceptional for your area", which contradicted
  an "Excellent" headline (the headline is a score of several factors); now "solid long-term returns".

## Ground rules

* No accounts, no API keys, nothing stored. Google Analytics (gtag) is the site-wide tag from dinomike.ca.
* All figures are estimates; keep the README's disclaimer and the in-app "Estimates only" notes.
* Incentive rules change: the federal residential credit note reflects the 2025 law (no credit for systems
  installed from 2026). Check it when updating.
