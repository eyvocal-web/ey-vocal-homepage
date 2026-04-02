# EY보컬스튜디오 Homepage — Technical Recommendation

## 1. Stack Choice

**Vanilla HTML + CSS + JavaScript — no framework, no build step.**

| Considered | Verdict |
|---|---|
| Vanilla HTML/CSS/JS | **Selected.** Zero tooling, instant dev start, trivially deployable anywhere (Netlify, Vercel, GitHub Pages, any static host). The project is a single marketing homepage — a framework adds complexity with no payoff. |
| Astro / Eleventy | Overkill. No multi-page routing, no markdown content, no repeated templates that justify a static-site generator. |
| React / Next.js / Vue | Far too heavy. We have no dynamic state, no API calls, no auth. A JS framework would increase bundle size and build complexity for zero benefit. |

### Key libraries (CDN, no npm required)

| Library | Purpose | Size |
|---|---|---|
| **AOS (Animate On Scroll)** | Scroll-triggered entrance animations | ~14 KB |
| **Google Fonts** | Noto Sans KR + optional display font | Loaded async |

No other dependencies. All interactivity (hamburger menu, smooth scroll, image lazy-loading) is achievable with native browser APIs.

---

## 2. File Structure

```
ey-vocal-homepage/
├── index.html              # Single-page entry point
├── css/
│   ├── reset.css           # Minimal CSS reset (box-sizing, margin, font)
│   ├── variables.css       # CSS custom properties (colors, spacing, fonts, breakpoints)
│   ├── global.css          # Base typography, layout utilities, common components
│   └── sections.css        # Per-section styles (hero, about, lessons, gallery, contact, footer)
├── js/
│   ├── main.js             # Menu toggle, smooth scroll, scroll-to-top, lazy loading
│   └── animations.js       # AOS init + any custom intersection-observer animations
├── assets/
│   ├── images/             # Optimized WebP/AVIF with JPEG fallbacks
│   ├── icons/              # SVG icons (inline or sprite)
│   └── fonts/              # Self-hosted font files (optional, if not using Google Fonts CDN)
├── favicon.ico
├── TECH-RECOMMENDATION.md
└── README.md               # (created later — local run instructions live here too)
```

### Why split CSS this way?
- `variables.css` makes theming and responsive tweaks trivial (change one token, propagate everywhere).
- `sections.css` keeps the bulk of layout code organized by visual section, not by component abstraction.
- Total CSS stays small enough that HTTP/2 multiplexing eliminates any need to bundle.

---

## 3. Implementation Approach

### Page sections (top → bottom)

1. **Header / Nav** — Fixed top bar with studio logo + 한국어 navigation links. Collapses to hamburger on mobile.
2. **Hero** — Full-viewport section with studio tagline, short value proposition, CTA button ("수업 문의하기"). Background: large hero image or subtle gradient with overlay text.
3. **About** — Brief intro to the studio, instructor photo, credentials.
4. **Lessons / Programs** — Card grid (2–3 columns desktop, 1 column mobile) showing lesson types (입시반, 취미반, etc.) with icons or small images.
5. **Gallery / Testimonials** — Student performance photos or short quote cards. Optional lightweight carousel (CSS scroll-snap, no library).
6. **Location / Contact** — Embedded Kakao/Naver map, address, phone, KakaoTalk link, operating hours.
7. **Footer** — Copyright, social links, privacy note.

### Development order

1. HTML structure for all sections (semantic, accessible markup first).
2. CSS reset + variables + global styles.
3. Section-by-section styling, mobile-first.
4. Responsive breakpoint pass (tablet, desktop).
5. JS interactivity (nav, scroll, lazy images).
6. Animations (AOS or custom IntersectionObserver).
7. Performance & accessibility audit.

---

## 4. Animation Strategy

### Principles
- **Subtle and purposeful.** Animations guide the eye, not distract. A vocal studio site should feel elegant and professional.
- **Performance-first.** Only animate `transform` and `opacity` — these are GPU-composited and won't trigger layout/paint.
- **Reduced motion respected.** All animations are disabled when `prefers-reduced-motion: reduce` is active.

### Specific animations

| Element | Animation | Trigger |
|---|---|---|
| Section headings | Fade-up (translateY + opacity) | Scroll into viewport |
| Cards (lessons, testimonials) | Staggered fade-up (50ms delay between siblings) | Scroll into viewport |
| Hero text | Fade-in on page load (CSS keyframes, no JS) | Page load |
| CTA button | Subtle scale on hover | Hover/focus |
| Nav links | Underline slide-in on hover | Hover/focus |
| Mobile menu | Slide-down + fade overlay | Toggle |
| Gallery images | Fade-in on lazy load | IntersectionObserver |

### Implementation
- Use **AOS** via CDN for scroll-triggered animations (declarative `data-aos="fade-up"` attributes).
- Hero load animation uses a pure CSS `@keyframes` rule — no JS dependency.
- Hover/focus micro-interactions use CSS `transition` only.
- `@media (prefers-reduced-motion: reduce)` block sets `animation: none; transition: none;` globally.

---

## 5. Accessibility & Responsiveness Plan

### Accessibility (WCAG 2.1 AA target)

- **Semantic HTML:** `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, proper heading hierarchy (`h1` → `h2` → `h3`).
- **Language attribute:** `<html lang="ko">` for Korean screen readers.
- **Color contrast:** All text meets 4.5:1 ratio minimum. Test with browser DevTools contrast checker.
- **Focus indicators:** Visible `:focus-visible` outlines on all interactive elements. Never `outline: none` without replacement.
- **Alt text:** Every `<img>` gets descriptive Korean alt text. Decorative images use `alt=""` + `role="presentation"`.
- **Keyboard navigation:** Tab order follows visual order. Hamburger menu is keyboard-operable (`Enter`/`Space` to toggle, `Escape` to close, focus trap while open).
- **Skip link:** Hidden "본문 바로가기" link at the top, visible on focus.
- **ARIA:** `aria-expanded` on hamburger toggle, `aria-label` on icon-only buttons, `aria-current="page"` on active nav link.
- **Reduced motion:** Covered in animation strategy above.

### Responsiveness

**Mobile-first approach** with three breakpoints:

| Breakpoint | Target | Key changes |
|---|---|---|
| Default (< 640px) | Mobile phones | Single column, hamburger nav, stacked cards, full-width sections |
| `640px` | Tablets | 2-column card grids, slightly larger typography |
| `1024px` | Desktop | Horizontal nav, 3-column grids, max-width content container (1200px), hero gets more vertical space |

Defined as CSS custom properties:
```css
:root {
  --bp-tablet: 640px;
  --bp-desktop: 1024px;
}
```

Used via `@media (min-width: 640px)` (custom properties can't be used inside media queries, so values are documented in `variables.css` and used as literal values in media rules).

**Fluid sizing:**
- Font sizes use `clamp()` for smooth scaling (e.g., `clamp(1rem, 2.5vw, 1.25rem)`).
- Spacing uses relative units (`rem`, `em`) tied to CSS variables.
- Images are `max-width: 100%; height: auto;` by default.
- Hero section uses `min-height: 100svh` (small viewport height for mobile browser chrome).

---

## 6. Performance Considerations

- **Images:** Serve WebP/AVIF with `<picture>` fallbacks. Use `loading="lazy"` on below-fold images. Size hero image appropriately with `srcset` for different viewports.
- **Fonts:** `font-display: swap` to prevent FOIT. Preconnect to Google Fonts origin.
- **No bundler = no bundle bloat.** Total JS expected: < 5 KB custom + 14 KB AOS.
- **CSS is small enough to inline critical styles** in `<head>` if needed (likely unnecessary given total size).
- Target: **Lighthouse 95+** on all four categories.

---

## 7. Local Development

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge).
- A local HTTP server. Any of these work:

### Run locally

**Option A — Python (pre-installed on macOS):**
```bash
cd ey-vocal-homepage
python3 -m http.server 8000
# Open http://localhost:8000
```

**Option B — Node.js (if available):**
```bash
npx serve .
# Opens automatically or visit http://localhost:3000
```

**Option C — VS Code:**
Install the "Live Server" extension → right-click `index.html` → "Open with Live Server."

No build step. No `npm install`. Edit a file, refresh the browser.

---

## 8. Deployment

The site is a flat directory of static files. Deploy anywhere:

- **GitHub Pages** — push to `main`, enable Pages in repo settings.
- **Netlify / Vercel** — connect repo, zero config needed.
- **Any web host** — upload files via FTP/SFTP.

No CI/CD pipeline required, though one can be added later for image optimization or HTML validation.
