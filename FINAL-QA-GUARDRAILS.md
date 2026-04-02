# FINAL-QA-GUARDRAILS.md — Implementation Agent Must Obey

> Authority: QA Lead
> Date: 2026-03-20
> Scope: All implementation work for EY보컬스튜디오 homepage
> Status: **BINDING** — any violation blocks merge/launch

---

## 0. Resolved Contradictions (Canonical Decisions)

These override any conflicting statements in PLAN-IA-UX.md, PLAN-VISUAL.md, or TECH-RECOMMENDATION.md.

| Decision | Canonical Value | Rationale |
|----------|----------------|-----------|
| External dependencies | **Zero.** No AOS, no CDN libraries. | IA-UX mandates "외부 의존성 없음". Use a custom IntersectionObserver wrapper (~20 lines) for scroll animations. |
| Font | **Pretendard**, self-hosted, Korean subset only. Not Noto Sans KR. | Lighter, avoids Google Fonts CDN dependency. |
| Display font (영문 accent) | **Cormorant Garamond**, self-hosted or system serif fallback. | Per VISUAL spec. |
| Breakpoints | `640px` (tablet), `1024px` (desktop) | VISUAL + TECH alignment. Not 768px. |
| Section structure | **9 sections** per IA-UX wireframe (Hero → About → Instructor → Programs → Testimonials → Gallery → Location → CTA → Footer) | IA-UX is canonical. Do not merge or skip sections. |
| Lighthouse target | **95+** across all four categories | Higher bar from TECH doc. |
| Hero subheading | Must NOT use "이천 유일" (unverifiable, violates 과장 금지). Use factual phrasing. | QA-PLAN-REVIEW finding. |
| Form elements | **Do not implement** a contact form. All conversion goes through KakaoTalk channel link + `tel:` link. | No form exists in UX plan; form specs in VISUAL are discarded. |
| Hero animation | **CSS-only** `@keyframes` + `animation-delay` for sequential fade-in. No JS. | TECH doc, confirmed feasible. |
| Testimonial/gallery scroll | **CSS `scroll-snap`**, no JS carousel library. | TECH doc. |

---

## 1. Content Quality Guardrails

### 1.1 Korean Text Rules

| Rule ID | Rule | Test |
|---------|------|------|
| C-01 | All UI copy uses 합쇼체 (ㅂ니다/습니다). No 해요체, no 반말. | Manual review of every text node. |
| C-02 | No exaggeration words: "최고", "독보적", "유일", "최초", "압도적", "넘버원". | `grep -i` for forbidden words. |
| C-03 | Sentences ≤ 25자 (Korean characters). Exceptions: testimonial quotes only. | Count check on all heading/body copy. |
| C-04 | Vocal terminology must include parenthetical explanation on first use. e.g. "믹스보이스(혼합 발성)". | Manual review. |
| C-05 | "이천" must appear in: hero subheading, about section, location section, and `<meta description>`. Exactly these four places — not more, not fewer. | Grep for "이천", verify count = 4 locations. |
| C-06 | Studio name is always "EY보컬스튜디오" (no space between EY and 보컬). Never "저희 학원", "저희 스튜디오". | Grep for forbidden variants. |
| C-07 | CTA button text must match exactly: Hero = "무료 상담 신청하기", Program cards = "자세히 상담받기", Floating = "카카오톡 상담", Final CTA = "지금 바로 상담하기", Nav = "상담 신청". | Inspect each CTA element. |
| C-08 | Every testimonial must include: quoted text, anonymized name (이니셜: ○○○), and course name (입시반/취미반/전문반). No testimonial without all three. | Manual review. |
| C-09 | No lorem ipsum, placeholder English text, or TODO comments in production code. | Grep for `lorem`, `TODO`, `FIXME`, `XXX`, `placeholder`. |
| C-10 | Business information (상호명, 대표자, 사업자번호, 주소) must be present in footer. Use placeholder format `○○○` / `XXX-XX-XXXXX` only if real data is not yet provided — but mark with `data-placeholder="true"` attribute for automated detection. | Grep for `data-placeholder`. |

### 1.2 Content Completeness Checklist

Before any section is considered "done", its required content must be present:

| Section | Required Assets |
|---------|----------------|
| Hero | Background image (or gradient fallback), headline, subheadline, CTA button |
| About | 2-3 sentence intro, 3 icon+label feature items |
| Instructor | Photo (or styled placeholder), name, one-line intro, 3-5 credential bullets |
| Programs | 2-3 program cards, each with: title, target audience, frequency, 3 bullet features, micro-CTA |
| Testimonials | Minimum 3 testimonials, each with quote + name + course |
| Gallery | Minimum 4 images (or placeholder boxes with `data-placeholder="true"`) |
| Location | Address text, map image/link, parking info, transit info |
| CTA | KakaoTalk button (linking to channel), phone number with `tel:` link, operating hours |
| Footer | Business name, representative, business number, address, copyright with current year, social links |

---

## 2. Design Consistency Guardrails

### 2.1 Color Usage Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| D-01 | All colors must be referenced via CSS custom properties defined in `variables.css`. No hardcoded hex/rgb values in `sections.css` or `global.css`. | Grep for hex codes outside `variables.css`. |
| D-02 | `#C8A96E` (Warm Gold) is **never** used as text color on light backgrounds (`#FAF6F0`, `#F0EBE3`, `#FFFFFF`). Gold may only be: (a) background for white text, (b) border/accent on any background, (c) text on `#1A1A2E` or darker. | Audit all Gold usage, verify contrast ≥ 4.5:1 for text. |
| D-03 | Section backgrounds alternate: `#FAF6F0` (Soft Cream) ↔ `#FFFFFF` (White). No two adjacent sections may share the same background color. | Visual inspection at all breakpoints. |
| D-04 | Only the defined color palette may be used. No new colors without updating `variables.css` and this guardrails doc. | Grep for hex/rgb not in palette. |

### 2.2 Typography Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| D-05 | Font stack: `'Pretendard', 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif`. Exactly this, in this order. | Inspect computed font-family in browser. |
| D-06 | Only the defined type scale sizes may be used (`--text-display` through `--text-xs`). No arbitrary `font-size` values. | Grep for `font-size:` not using a CSS variable. |
| D-07 | Hero title on mobile must be ≥ `2rem`. Never smaller. | Inspect at 320px viewport width. |
| D-08 | Body text `font-size` must be `16px` minimum on all viewports. No smaller body text on mobile. This also prevents iOS auto-zoom on form elements. | Inspect at 320px viewport width. |

### 2.3 Spacing Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| D-09 | All spacing values must use the 8px-based spacing tokens from `variables.css` (`--space-1` through `--space-32`). No arbitrary margin/padding values. | Grep for margin/padding not using CSS variables. |
| D-10 | Section vertical padding: `--space-16` (64px) on mobile, `--space-24` (96px) on desktop. Every `<section>` must have this. | Inspect all sections at both breakpoints. |
| D-11 | Container max-width: `1200px`. Content must never exceed this width. | Resize browser to 1920px, verify no content exceeds 1200px container. |

### 2.4 Component Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| D-12 | Primary CTA buttons: `background: var(--color-gold)`, `color: white`, `padding: 16px 40px`, `border-radius: 4px`, `font-weight: 600`. No deviation. | Visual comparison against spec. |
| D-13 | Cards: `background: #FFFFFF`, `border-radius: 8px`, `box-shadow: 0 2px 16px rgba(26,26,46,0.06)`, `padding: var(--space-8)`. | Inspect card elements. |
| D-14 | Testimonial cards must have a `3px` left border in Warm Gold. | Visual inspection. |
| D-15 | Navigation height: `72px`. Logo left-aligned, menu items right-aligned, CTA button at far right. | Inspect at desktop breakpoint. |

---

## 3. Responsive & Accessibility Guardrails

### 3.1 Responsive Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| R-01 | CSS must be written **mobile-first**. Base styles target mobile; `min-width` media queries add tablet/desktop overrides. No `max-width` media queries. | Code review of all CSS files. |
| R-02 | No horizontal scroll at any viewport width from `320px` to `1920px`. | Test at 320px, 375px, 640px, 768px, 1024px, 1440px, 1920px. |
| R-03 | All images must have `max-width: 100%; height: auto;` or equivalent. No image may overflow its container. | Inspect at 320px viewport. |
| R-04 | Hero section: `min-height: 100svh` (not `100vh`). Must account for mobile browser chrome. | Test on iOS Safari. |
| R-05 | Navigation: hamburger menu on viewports < `1024px`, horizontal menu on ≥ `1024px`. No in-between state. | Test at 1023px and 1024px. |
| R-06 | Program cards: 1 column on mobile, 2 columns on tablet (640px+), 3 columns on desktop (1024px+). | Test at each breakpoint. |
| R-07 | Gallery grid: 2 columns on mobile, 3 columns on desktop. | Test at each breakpoint. |
| R-08 | All touch targets (buttons, links, interactive elements) must be minimum `44×44px`. | Inspect computed size of all interactive elements on mobile. |
| R-09 | The floating KakaoTalk button must be visible and tappable on all viewports. Must not overlap with other interactive elements. Position: fixed, bottom-right. | Test on mobile and desktop. |

### 3.2 Accessibility Rules (WCAG 2.1 AA)

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| A-01 | `<html lang="ko">` must be set. | Inspect HTML source. |
| A-02 | Semantic HTML required: `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`. Each section must use `<section>` with a heading or `aria-label`. | HTML validation + manual review. |
| A-03 | Heading hierarchy must be sequential: exactly one `<h1>` (in Hero), then `<h2>` for each section title, `<h3>` for sub-items. No skipped levels. | Automated heading-level check (browser extension or script). |
| A-04 | Every `<img>` must have an `alt` attribute. Meaningful images get descriptive Korean alt text. Decorative images get `alt=""` and `role="presentation"`. | Grep for `<img` without `alt`. |
| A-05 | All text must meet WCAG AA contrast ratio: ≥ 4.5:1 for normal text, ≥ 3:1 for large text (≥ 18pt or 14pt bold). | Test with axe or Lighthouse accessibility audit. |
| A-06 | Visible `:focus-visible` indicator on all interactive elements. `outline: none` is **forbidden** without a visible replacement style. | Tab through entire page, verify every element shows focus. |
| A-07 | Skip navigation link: `<a href="#main" class="skip-link">본문 바로가기</a>` as first child of `<body>`. Visually hidden, visible on focus. | Tab from top of page, verify skip link appears. |
| A-08 | Hamburger menu: `aria-expanded="true/false"` toggled on click, `aria-label="메뉴"` on button, `Escape` key closes menu, focus trapped inside open menu. | Keyboard-only test of mobile nav. |
| A-09 | `@media (prefers-reduced-motion: reduce)` must set `animation: none !important; transition: none !important;` globally. | Enable reduced motion in OS settings, verify no animations play. |
| A-10 | All `tel:` links must use format `href="tel:+82-31-XXX-XXXX"` (with country code). | Inspect tel links. |
| A-11 | Gallery lightbox (if implemented) must be keyboard-navigable: `Escape` to close, arrow keys to navigate, focus trapped inside overlay, focus returns to trigger element on close. | Keyboard-only test. |

---

## 4. Performance Guardrails

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| P-01 | **Zero external runtime dependencies.** No CDN scripts, no npm packages loaded at runtime. Self-hosted fonts are allowed. Google Fonts CDN is not. | Grep for `<script src=`, `<link href=` pointing to external domains. |
| P-02 | Total page weight (first load, uncached) must be ≤ **500KB** (excluding map embed if used). | Lighthouse or DevTools Network tab. |
| P-03 | Total custom JS ≤ **10KB** (unminified). | `wc -c js/*.js`. |
| P-04 | Total custom CSS ≤ **30KB** (unminified). | `wc -c css/*.css`. |
| P-05 | All images below the fold must use `loading="lazy"`. Hero image must NOT be lazy-loaded. | Grep for `loading=` on all `<img>` tags. Verify hero image has no `loading="lazy"`. |
| P-06 | Images must be served in WebP format with JPEG/PNG fallback via `<picture>` element, OR as optimized JPEG/PNG ≤ 200KB each. | Check file sizes in `assets/images/`. |
| P-07 | Hero image must have explicit `width` and `height` attributes to prevent CLS (Cumulative Layout Shift). | Inspect hero `<img>` tag. |
| P-08 | Font files: Pretendard subset must be ≤ **300KB** total (all weights combined). Use `woff2` format only. | Check file sizes in `assets/fonts/`. |
| P-09 | `font-display: swap` must be set for all `@font-face` declarations. | Inspect CSS font-face rules. |
| P-10 | Only `transform` and `opacity` may be animated. No animating `width`, `height`, `top`, `left`, `margin`, `padding`, `box-shadow` in transitions/animations. Exception: `box-shadow` on hover is allowed if combined with `will-change: transform`. | Code review of all `transition` and `@keyframes` rules. |
| P-11 | Lighthouse Performance score ≥ **95**, Accessibility ≥ **95**, Best Practices ≥ **95**, SEO ≥ **95**. | Run Lighthouse in Chrome DevTools (mobile mode). |
| P-12 | No render-blocking resources. CSS may be in `<head>` (acceptable for small files). No synchronous JS in `<head>` — all `<script>` tags must have `defer` attribute. | Inspect `<head>` for blocking resources. |

---

## 5. Code Quality Guardrails

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| Q-01 | HTML must pass W3C validation with zero errors. Warnings are acceptable. | Run through validator.w3.org or `npx html-validate index.html`. |
| Q-02 | CSS must have no syntax errors. | Browser DevTools console check. |
| Q-03 | JS must run with zero console errors on page load and after interacting with all interactive elements. | Open DevTools console, interact with every element. |
| Q-04 | File structure must match TECH-RECOMMENDATION.md: `index.html`, `css/` (reset, variables, global, sections), `js/` (main, animations), `assets/` (images, icons, fonts). | `ls -R` and compare. |
| Q-05 | All CSS custom properties must be defined in `variables.css` and nowhere else. Other CSS files consume variables, never define them. | Grep for `:root` or `--` definitions outside `variables.css`. |
| Q-06 | No inline styles (`style="..."`) in HTML. All styling via CSS classes. | Grep for `style=` in `index.html`. |
| Q-07 | No `!important` in CSS. Exception: the `prefers-reduced-motion` override (A-09) and the skip-link utility. | Grep for `!important` in CSS files, verify only allowed uses. |
| Q-08 | SEO meta tags required: `<title>`, `<meta name="description">`, `<meta property="og:title">`, `<meta property="og:description">`, `<meta property="og:image">`, `<meta property="og:type" content="website">`, `<link rel="canonical">`. | Inspect `<head>`. |
| Q-09 | JSON-LD structured data for `LocalBusiness` type must be present in `<head>`. Must include: name, address, telephone, openingHours. | Inspect `<script type="application/ld+json">`. |
| Q-10 | `<meta name="viewport" content="width=device-width, initial-scale=1">` must be present. No `maximum-scale=1` or `user-scalable=no` (accessibility violation). | Inspect viewport meta tag. |

---

## 6. Pre-Launch Checklist

Every item must be checked off before the site goes live. Mark with ✅ or ❌.

### Content

- [ ] All 9 sections contain final Korean copy (no placeholders unless marked with `data-placeholder`)
- [ ] All copy reviewed against tone guide (합쇼체, no exaggeration, ≤25자 sentences)
- [ ] "이천" appears in exactly 4 locations (hero sub, about, location, meta description)
- [ ] Studio name consistently "EY보컬스튜디오" everywhere
- [ ] All 5 CTA buttons have correct text per C-07
- [ ] Testimonials have ≥ 3 entries, each with quote + anonymized name + course
- [ ] Footer contains all business information
- [ ] No `lorem`, `TODO`, `FIXME`, `XXX`, or English placeholder text

### Design

- [ ] Colors match palette exactly (inspect with DevTools color picker)
- [ ] No Gold text on light backgrounds (D-02 verified)
- [ ] Section backgrounds alternate Cream ↔ White
- [ ] Typography uses only defined scale sizes
- [ ] All spacing uses 8px-grid tokens
- [ ] Buttons, cards, testimonial cards match component specs
- [ ] Floating KakaoTalk button visible and functional

### Responsive

- [ ] No horizontal scroll at: 320px, 375px, 640px, 768px, 1024px, 1440px
- [ ] Hamburger nav works on mobile (open, close, escape, focus trap)
- [ ] Program cards reflow correctly at each breakpoint (1→2→3 columns)
- [ ] Hero is full viewport height on mobile (100svh)
- [ ] All touch targets ≥ 44×44px on mobile
- [ ] Images don't overflow containers at any width

### Accessibility

- [ ] `<html lang="ko">` present
- [ ] Heading hierarchy: one h1, sequential h2/h3, no skips
- [ ] All images have appropriate alt text
- [ ] Tab navigation works through entire page in logical order
- [ ] Skip link "본문 바로가기" appears on first Tab press
- [ ] Focus indicators visible on all interactive elements
- [ ] Hamburger toggle has `aria-expanded` and `aria-label`
- [ ] `prefers-reduced-motion` disables all animation
- [ ] Color contrast ≥ 4.5:1 for all normal text
- [ ] axe or Lighthouse accessibility: zero critical/serious violations

### Performance

- [ ] Lighthouse Performance ≥ 95 (mobile)
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Lighthouse Best Practices ≥ 95
- [ ] Lighthouse SEO ≥ 95
- [ ] Total page weight ≤ 500KB
- [ ] No external CDN dependencies loaded
- [ ] All below-fold images are lazy-loaded
- [ ] Hero image has width/height attributes (no CLS)
- [ ] Font files use woff2, total ≤ 300KB
- [ ] `font-display: swap` on all @font-face
- [ ] Zero console errors

### Code & SEO

- [ ] HTML validates (W3C, zero errors)
- [ ] File structure matches TECH spec
- [ ] All CSS vars in `variables.css` only
- [ ] No inline styles in HTML
- [ ] SEO meta tags present (title, description, OG tags)
- [ ] JSON-LD LocalBusiness structured data present
- [ ] Viewport meta tag correct (no user-scalable=no)
- [ ] Canonical URL set
- [ ] Favicon present (`favicon.ico` + `<link rel="icon">`)
- [ ] OG image prepared (1200×630px)

### Device Testing

- [ ] iPhone Safari (latest iOS)
- [ ] Android Chrome (latest)
- [ ] Samsung Internet
- [ ] Desktop Chrome
- [ ] Desktop Safari (macOS)
- [ ] Desktop Firefox

---

## 7. Enforcement

- **Blocking**: Any rule marked with severity "High" in QA-PLAN-REVIEW.md, or any rule in sections 1-5 of this document, is a **blocking** issue. The implementation agent must fix it before considering the section complete.
- **Review process**: After implementation is complete, run through the entire Pre-Launch Checklist (Section 6). Every ❌ must be resolved before deployment.
- **No exceptions without documented justification**: If a guardrail cannot be met, the implementation agent must document why in a comment at the top of the relevant file, referencing the rule ID (e.g., `<!-- QA: D-02 exception — Gold text used here on dark overlay background, contrast verified at 5.2:1 -->`).

---

*This document is the final authority on quality standards. When in conflict with other planning documents, this document wins.*
