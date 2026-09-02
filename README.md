# Efri — personal portfolio

A static, front-end-only portfolio for Gabriel (display name **Efri**).

> Somewhere over the rainbow between logic and creativity.

HTML, CSS, and vanilla JavaScript. No build step. Intended for GitHub Pages.

## Run locally

Open `index.html` in a browser, or from this folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

A local server is nicer than `file://` because some browsers restrict audio and fetch on file URLs.

## Deploy to GitHub Pages

1. Create a repository.
2. Upload the contents of this `portfolio/` folder to the repo root (so `index.html` sits at the root).
3. In the repo: **Settings → Pages → Deploy from a branch** (`main` / `/root`).
4. If the site is a project page (`username.github.io/repo-name/`), relative paths already used here should still work.

## What you still need to replace

Placeholders are intentional. They look finished; they are not real personal data.

### Identity

| Placeholder | Where |
|---|---|
| `Gabriel Adkins` | footer, and anywhere you want your legal name |
| `Efri` / `Gabriel.dev` | title, navbar, hero |
| Personal photo | `assets/images/profile-placeholder.svg` |

### Projects (`assets/projects/project-01` … `project-03`)

For each project, replace:

- `logo-placeholder.svg`
- `screenshot-01-placeholder.svg` … `screenshot-03-placeholder.svg` (2–4 images)
- `[PROJECT NAME]`, `[PROJECT DESCRIPTION]`, `[TECH 01]` in `index.html`
- `href="#project-0N-source"` with the GitHub URL

### Experience

- `[YEAR]`, `[ROLE]`, `[DESCRIPTION]`, related `[PROJECT NAME]`

### Beyond

- Gallery images in `assets/images/gallery-0N-placeholder.svg`
- Captions `[CAPTION 0N]`
- `[ARTIST]`, `[MOVIE]`, `[THING]`

### Contact & socials

In `index.html`, search for `#github-placeholder`, `#xda-placeholder`, `#instagram-placeholder`, `#youtube-placeholder`, `#x-placeholder`, `#apple-music-placeholder`, `#spotify-placeholder`, `#whatsapp-placeholder`, and `mailto:[YOUR EMAIL]`.

LinkedIn is not included on purpose. Add a link in the Elsewhere / footer lists when you have one.

### Easter-egg audio

File:

```text
assets/audio/easter-egg-audio-placeholder.mp3
```

Replace it with audio **you have permission or a licence to use**.

Do **not** use Judy Garland’s recording of *Somewhere Over the Rainbow* (or any copyrighted recording) unless you hold the rights. The current file is an original short chime for development only.

The hidden control is the small ✦ in the hero. It is not labelled as an easter egg on purpose.

## Editing the look

Colours, type, space, and motion live in `css/variables.css`. Change tokens there first.

| File | Role |
|---|---|
| `css/variables.css` | design tokens |
| `css/global.css` | reset, type, skeleton, cursor, reveal |
| `css/navbar.css` | floating nav, back-to-top |
| `css/sections.css` | hero → footer |
| `css/components.css` | photo, screenshot viewer, buttons |
| `css/responsive.css` | tablet / mobile compositions |

JavaScript is split the same way: `js/navigation.js`, `js/animations.js`, `js/cursor.js`, `js/easter-egg.js`, `js/main.js`.

## Not in v1

Achievements / certifications and a public CV are intentionally omitted. The layout can take them later without a redesign.

## Licence note

You own your photos, copy, and project files. Placeholder graphics in `assets/` are simple generated marks for layout only — replace them before treating the site as finished.
