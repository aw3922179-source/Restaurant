# Savor — Modern Fine Dining Frontend

A polished, international-standard restaurant website. **Frontend only** — plain
HTML, CSS and vanilla JavaScript. No frameworks, no build step, no backend.

## Quick start

Just open `index.html` in any modern browser.

Or serve it locally (recommended, so fonts and images load with proper headers):

```powershell
# Option 1 — Node (no install needed)
npx serve .

# Option 2 — Python
python -m http.server 5500
```

Then visit <http://localhost:5500>.

## Project structure

```
Front-restauran/
├─ index.html          # All markup + section structure
├─ css/
│  └─ style.css        # Design tokens → components → responsive (18 labelled sections)
├─ js/
│  ├─ data.js          # Menu, gallery and testimonial content (edit here)
│  └─ main.js          # All interactions (preloader, nav, filters, slider, lightbox, forms)
├─ assets/             # Empty — drop local images here if you want to go offline
└─ README.md
```

## Sections

| # | Section | Highlights |
|---|---------|-----------|
| 1 | Preloader | Branded loading bar, auto-dismisses with a safety timeout |
| 2 | Header | Glassmorphism bar that shrinks on scroll, active-link tracking, mobile drawer |
| 3 | Hero | Full-viewport image with slow zoom, animated headline, count-up stats |
| 4 | About | Layered image collage, floating year badge, feature checklist |
| 5 | Menu | Category tab filter rendered from `data.js`, badges for veg / vegan / spicy / new |
| 6 | Signatures | Three editorial dish cards with hover lift |
| 7 | Chef | Portrait layout, pull-quote, credential facts |
| 8 | Gallery | Masonry-style grid with a full keyboard-accessible lightbox |
| 9 | Testimonials | Autoplaying slider, dots, arrows, swipe + keyboard support |
| 10 | Reservation | Full client-side validation, date/time constraints, confirmation toast |
| 11 | Footer | Newsletter form, contact details, socials |

## Interactions in `js/main.js`

- `initPreloader` — hides the loader on `load`, with a 3.2 s failsafe
- `initHeader` / `setActiveLink` — sticky state + scroll-spy navigation
- `initMobileNav` — slide-in drawer, overlay, `Esc` to close, body scroll lock
- `initReveal` — `IntersectionObserver` stagger reveal for `[data-reveal]`
- `initCounters` — eased number count-up for `[data-count]`
- `initMenu` — tab filtering with re-render + fade
- `initGallery` / `initLightbox` — grid build, open/close, arrows, `Esc`, focus restore
- `initSlider` — autoplay (pauses on hover/focus/blur), dots, touch swipe, arrow keys
- `initReservation` / `initNewsletter` — field-level validation with inline errors
- `initToTop` — smooth back-to-top button

## Editing content

Everything repeatable lives in `js/data.js`:

```js
MENU_CATEGORIES   // [{ id, label }]
MENU_ITEMS        // [{ cat, name, desc, price, img, badges }]
MENU_BADGES       // badge label + colour class lookup
GALLERY           // [{ img, cap, size: '' | 'wide' | 'tall' }]
TESTIMONIALS      // [{ quote, name, role, avatar, stars }]
```

## Customising the look

All colours, fonts, radii and shadows are CSS custom properties at the top of
`css/style.css`:

```css
:root {
  --bg: #0b0b0f;
  --gold: #d8a95a;    /* brand accent */
  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;
}
```

## Notes & limitations

- Images are loaded from Unsplash CDN URLs, so an internet connection is needed.
  To work offline, download the images into `assets/` and update the `src`
  attributes in `index.html` and the `IMG(...)` calls in `js/data.js`.
- The reservation and newsletter forms are **front-end demos** — they validate
  input and show a toast but do not send data anywhere. Wire `initReservation`
  to a real endpoint (Formspree, Netlify Forms, your own API) when you go live.
- Tested in evergreen Chrome, Edge, Firefox and Safari. Requires
  `IntersectionObserver` support (all modern browsers); a graceful fallback is
  included for reduced-motion users.
- Fonts are pulled from Google Fonts.
