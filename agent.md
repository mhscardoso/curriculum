# Plan — Minimal CV & Writing Site

**Owner:** Matheus Cardoso
**Stack:** HTML, CSS and a small vanilla JavaScript component loader. No framework, no build step.
**Focus:** data engineering, backend, cloud and SRE roles.
**Status:** implemented.

## Goal

A quiet, text-first professional site. The home page lives at the project root; every other page and asset lives under `src/`. The header and footer are shared HTML fragments fetched at runtime, so navigation and contact details are edited in one place.

## Principles

- Content first. No hero image, cards, gradients, pills, shadows or animation.
- No dark-mode toggle. One light theme only.
- No framework and no build step. JavaScript is used only to load shared components.
- Home stays at `index.html`; all other site files live in `src/`.
- Relative paths are resolved from the `src/` directory by `main.js`, so the site works at a domain root or in a subdirectory.
- Articles are hand-written HTML, indexed manually.
- Target roles are data engineering, backend, cloud, DevOps and SRE — avoid frontend/design language.

## File structure

```
/
├── index.html                    Home (only site file at the root)
└── src/
    ├── about.html                Profile and current focus
    ├── experience.html           Work history
    ├── projects.html             Selected engineering projects
    ├── skills.html               Technical skills
    ├── education.html            Education, certifications, languages
    ├── contact.html              Contact details
    ├── articles/
    │   ├── index.html            Article listing, maintained by hand
    │   ├── article-template.html Starter for new articles (noindex)
    │   └── typst.html            Article draft copied from the template
    ├── components/
    │   ├── header.html           Skip link, site title and navigation
    │   └── footer.html           Copyright, email, GitHub and LinkedIn
    ├── main.js                   Fetches components, resolves links, sets active nav
    ├── styles.css                One stylesheet for all pages
    ├── agent.md                  This document
    └── resources/
        ├── Matheus-1.jpg         Small portrait on About
        └── animated.jpeg         Unused
```

## Shared components

The repeated parts of every page were extracted:

| Component | File | Contents |
| --- | --- | --- |
| Header | `src/components/header.html` | Skip link, site title, primary navigation |
| Footer | `src/components/footer.html` | Copyright and contact links |

Each page mounts them with:

```html
<div data-component="header"></div>
...
<div data-component="footer"></div>
```

`src/main.js` fetches `components/header.html` and `components/footer.html` relative to its own location. Component links are written relative to `src/`; the loader resolves every `href` and `src` against `src/` before insertion. This means the same markup works from the root home page, from `src/`, and from `src/articles/`.

The active navigation item is set from the page's `data-page` attribute, so no page repeats `aria-current` by hand:

```html
<body data-page="about">
```

`data-page` values: `home`, `about`, `experience`, `projects`, `skills`, `education`, `articles`, `contact`.

### JavaScript requirements

Components are loaded over HTTP; opening the pages through `file://` will not work. Preview with:

```bash
python3 -m http.server 8000
```

The `<head>` is intentionally not fetched: title, description and stylesheet must be present at first paint. Metadata and the favicon remain per page.

## Design

- **Measure:** 46rem (about 736px), single column.
- **Type:** system sans stack for text; system monospace for dates, metadata and the role line.
- **Scale:** 17px body, 1.65 line-height, ~2.1rem page titles, compact section headings.
- **Colour:** off-white `#fcfcfa`, near-black `#1a1a1a`, muted `#5e5e5e`, rule `#deded8`, link blue `#0b5cad`.
- **Navigation:** name on the left, plain text links on the right; wraps naturally on mobile.
- **Active page:** underline plus `aria-current="page"`.
- **Rules:** thin horizontal lines separate entries; no boxes or cards.
- **Portrait:** one small 120px image on About only. The illustration is not used.
- **Print:** navigation and footer are hidden, black on white, no page breaks inside entries.

## Pages

### Home (`/index.html`)
- Role line: *Software Developer · Data Analyst · AWS · Cloud*
- Name, short introduction, location, availability, email/GitHub/LinkedIn links.
- “Currently” paragraph aimed at data/backend/cloud/SRE work.
- “Explore” index linking to Experience, Projects, Skills and Articles under `src/`.

### About
- Short portrait.
- Two or three paragraphs on data platforms, backend services, automation, reliability and observability.
- Definition list: Based in, Focus, Languages, Availability.

### Experience
- Three sample roles: data engineering, backend, cloud/platform.
- Each entry: role, company, dates, location, achievement bullets and a plain “Stack” line.
- `<time>` elements for dates.

### Projects
- Three sample projects: a data pipeline, a backend service, and cloud infrastructure/observability.
- Short summary, stack line, optional source/write-up links.
- No screenshots or cards.

### Skills
- Definition list grouped by Languages, Data, Backend, Cloud & Infrastructure, Reliability, Practices.
- Plain comma-separated values. No proficiency bars or tag pills.

### Education
- Degree, certifications and languages with dates and institutions.

### Contact
- Email, GitHub, LinkedIn, location and availability.
- No contact form.

### Articles
- `src/articles/index.html`: intro, manual list of posts with date, reading time and summary; empty state until the first article exists.
- `src/articles/article-template.html`: full standalone page with metadata, prose example and instructions. Excluded from search indexes.
- `src/articles/typst.html`: draft created from the template.
- To publish: copy the template to `src/articles/<slug>.html`, edit it, remove its `noindex` tag, then add an `<article class="post">` entry to the index.

## Content rules

- Sample companies, projects and certifications are fictional placeholders and clearly commented.
- Contact details live in `src/components/footer.html` and on the Contact page — keep both in sync.
- Dates use `<time datetime="…">`.
- External links use `rel="noopener noreferrer"` when opening a new tab.
- No frontend-oriented terms such as “design systems”, “interfaces” or “web design”.

## Accessibility

- Skip link to `#main`, loaded with the header component.
- One `<h1>` per page and ordered headings.
- Semantic `header`, `nav`, `main`, `article`, `footer`.
- Visible focus rings and underlined text links.
- Active navigation is not indicated by colour alone.
- Descriptive alt text for the portrait.
- No motion.

## Implementation checklist

- [x] Move the home page to the project root and all other site files into `src/`
- [x] Extract the skip link, header and navigation into `src/components/header.html`
- [x] Extract the footer into `src/components/footer.html`
- [x] Add `src/main.js` to fetch components and resolve links from `src/`
- [x] Set the active navigation item from `data-page`
- [x] Update all root and nested page paths
- [x] Keep the shared stylesheet, portrait and article pages under `src/`
- [x] Verify component loading, active navigation, responsive layout, print output and internal links

## Verification notes

- Ten HTML files checked: every static link, stylesheet, script and asset resolves.
- Header and footer load at runtime on `/index.html`, `/src/*.html` and `/src/articles/*.html`; resolved component links point to the correct pages.
- Active navigation checked on About, Articles and article pages.
- No `<script>` elements other than the `main.js` loader remain in the pages.
- Print output reviewed for Home, Experience, Education and the article template; navigation and footer are hidden and entries do not split.
- Root contains only `index.html`; all other site files live under `src/`.
- `node --check src/main.js` passes.
