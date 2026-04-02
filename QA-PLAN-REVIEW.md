# QA / Critical Review — Pre-Build Planning Documents

> Reviewer: Agent 4 (QA)
> Scope: PLAN-IA-UX.md, PLAN-VISUAL.md, TECH-RECOMMENDATION.md
> Date: 2026-03-20

---

## 1. Strengths

### PLAN-IA-UX.md
- **Well-defined audience segmentation.** Four distinct personas with clear needs; primary/secondary targeting is practical for a local studio.
- **Psychology-driven section order.** The scroll flow (trust → proof → conversion) is textbook conversion funnel design and appropriate for the business.
- **CTA strategy is thorough.** Multiple touchpoints (hero, cards, floating FAB, final CTA) without being overwhelming. Floating KakaoTalk button is the right call for Korean mobile users.
- **Tone & voice guide is unusually good** for a project this size. The "do/don't" examples prevent copy drift during implementation.
- **Wireframe included.** ASCII wireframe provides a concrete shared reference, reducing ambiguity for implementers.

### PLAN-VISUAL.md
- **Color palette is cohesive and on-brand.** Deep Charcoal + Warm Gold + Soft Cream communicates "premium but warm" effectively.
- **Design token approach.** CSS custom properties for spacing, type scale, and colors will make implementation consistent and maintainable.
- **Motion guide is restrained and tasteful.** Respects `prefers-reduced-motion`, limits animation to GPU-friendly properties.
- **Component-level specs** (buttons, cards, nav, forms) give implementers enough detail to avoid guesswork.

### TECH-RECOMMENDATION.md
- **Stack choice is well-justified.** Vanilla HTML/CSS/JS is the correct decision for a single-page marketing site. The comparison table shows alternatives were genuinely evaluated.
- **File structure is clean and logical.** CSS split (reset/variables/global/sections) avoids monolithic stylesheets without over-fragmenting.
- **Development order is sound.** HTML-first, then styling, then JS, then animations, then audit — proper progressive enhancement.
- **Deployment is friction-free.** No build step means anyone can deploy it.

---

## 2. Weaknesses & Risks

### PLAN-IA-UX.md

| Issue | Severity | Detail |
|-------|----------|--------|
| No analytics plan | Medium | No mention of tracking (GA4, KakaoTalk conversion tracking, UTM params). Without measurement, you cannot validate whether the funnel actually converts. |
| KakaoTalk dependency unspecified | Medium | "카카오톡 연결" appears multiple times but no technical detail — channel link, chat plugin, or PlusFriend? Each has different UX implications. |
| SEO strategy absent | Medium | For a local business in 이천, local SEO (structured data, meta tags, Naver/Google My Business) is critical. Not mentioned anywhere. |
| No content readiness check | Low | The plan assumes real content (instructor bio, testimonials, photos) will exist. If it doesn't, implementation will stall at the content phase. |
| "이천 유일" claim in wireframe | Low | "이천 유일 프리미엄 1:1 보컬 레슨" — this may be unverifiable and contradicts the tone guide's "과장 금지" principle. |

### PLAN-VISUAL.md

| Issue | Severity | Detail |
|-------|----------|--------|
| Contrast concern: Gold on Cream | High | `#C8A96E` on `#FAF6F0` yields approximately 2.5:1 contrast ratio — **fails WCAG AA** for normal text. Gold CTA buttons with white text on cream backgrounds are fine, but Gold *text* on cream will be illegible for some users. |
| Font loading: Google Fonts vs self-host contradiction | Medium | Doc says "시스템 폰트 + Google Fonts 기반 (CSS @import)" but specifies Pretendard, which is not on Google Fonts. Pretendard must be self-hosted. Meanwhile TECH-RECOMMENDATION.md references "Noto Sans KR" from Google Fonts — these are different fonts. |
| No dark mode consideration | Low | Not required, but worth a conscious decision since CSS custom properties make it easy later. |
| Form element specs without a form | Low | Section 5.5 defines input field styles, but the IA/UX doc has no contact form — all conversion is via KakaoTalk/phone. Either remove the form spec or add a form to the UX plan. |
| Breakpoint mismatch with TECH doc | Medium | Uses `640px / 1024px / 1440px`, but IA/UX doc uses `768px / 1024px`. See contradictions below. |

### TECH-RECOMMENDATION.md

| Issue | Severity | Detail |
|-------|----------|--------|
| AOS library contradicts "no external dependencies" | High | IA/UX doc explicitly states "외부 의존성 없음" and "외부 라이브러리 제로." TECH doc adds AOS (14KB CDN). This is a direct contradiction. |
| Google Fonts CDN is also an external dependency | Medium | Same principle — the IA/UX doc says no external dependencies, but TECH doc loads Google Fonts from CDN. |
| Lighthouse target inconsistency | Low | IA/UX targets 90+, TECH targets 95+. Minor, but signals misalignment. |
| No testing strategy | Medium | No mention of cross-browser testing, device testing, or any QA process. For a static site this matters less, but Safari/iOS quirks with `100svh`, smooth scroll, and backdrop-filter should be called out. |
| CSS custom properties in media queries | Low | Doc correctly notes custom properties can't be used in media queries, but then defines them as CSS variables anyway. This is fine for documentation but could confuse implementers. |

---

## 3. Contradictions & Mismatches Between Documents

| # | Conflict | Documents | Impact |
|---|----------|-----------|--------|
| 1 | **External dependencies: zero vs AOS + Google Fonts** | IA-UX ("외부 의존성 없음, 순수 HTML/CSS/JS") vs TECH (AOS via CDN, Google Fonts CDN) | High. Must decide: either drop AOS and use a lightweight custom IntersectionObserver (trivial for fade-in animations), or acknowledge the dependency. |
| 2 | **Font choice: Pretendard vs Noto Sans KR** | VISUAL (Pretendard + Cormorant Garamond) vs TECH (Noto Sans KR + optional display font) | High. These are completely different typefaces with different weights, metrics, and licensing. Pick one before writing any CSS. |
| 3 | **Breakpoints: 768px vs 640px** | IA-UX (768px tablet, 1024px desktop) vs VISUAL/TECH (640px tablet, 1024px desktop) | Medium. 128px gap means the tablet layout will trigger at different points depending on which doc the implementer follows. |
| 4 | **Section structure: 9 sections vs 7 sections** | IA-UX (9 sections: hero, about, instructor, programs, testimonials, gallery, location, CTA, footer) vs VISUAL (7 sections: hero, about, lessons, testimonials, gallery, contact, footer) vs TECH (7 sections, different grouping) | Medium. IA-UX separates instructor, location, and CTA as distinct sections. VISUAL and TECH merge them. The HTML structure must follow one canonical list. |
| 5 | **Lighthouse target: 90+ vs 95+** | IA-UX vs TECH | Low but sloppy. Align on one target. |
| 6 | **Hero animation: CSS-only vs JS** | VISUAL (순차적 페이드인, implies JS stagger) vs TECH (CSS @keyframes, no JS dependency) | Low. CSS `animation-delay` can handle sequential fade-in without JS. Just clarify. |
| 7 | **Gallery carousel: slider vs CSS scroll-snap** | IA-UX (testimonials: "카드 슬라이더") vs TECH ("CSS scroll-snap, no library") | Low. Both work, but "slider" often implies a JS carousel. Clarify that CSS scroll-snap is the implementation. |

---

## 4. Concrete Recommendations Before Implementation

### Must-fix (before writing any code)

1. **Resolve the font decision.** Choose Pretendard (self-hosted, ~200KB subset) or Noto Sans KR (Google Fonts CDN, ~1MB+ for Korean). Recommendation: **Pretendard**, self-hosted with Korean subset. It's lighter, more modern, and avoids the CDN dependency question. Update TECH-RECOMMENDATION.md accordingly.

2. **Resolve the external dependency policy.** Either:
   - (A) Stay truly zero-dependency: drop AOS, write a 20-line IntersectionObserver wrapper for fade-in animations. This is trivial and removes 14KB.
   - (B) Allow CDN dependencies explicitly: update IA-UX doc to reflect this.
   - **Recommendation: Option A.** AOS is overkill for fade-up animations. A custom observer is smaller, faster, and keeps the "zero dependency" promise.

3. **Unify breakpoints.** Use `640px / 1024px` (VISUAL/TECH version). 640px captures more tablets and follows modern conventions better than 768px.

4. **Unify section list.** Use the IA-UX 9-section structure as canonical — it's the most detailed. VISUAL and TECH docs should reference it rather than defining their own.

5. **Fix Gold-on-Cream contrast.** Never use `#C8A96E` as text color on `#FAF6F0`. Gold should only appear on dark backgrounds or as a background for white text. Add a rule to the design spec: "Warm Gold is a background/border/accent color, never a body text color."

### Should-fix (before launch)

6. **Add an SEO section.** At minimum: `<title>`, `<meta description>`, Open Graph tags, JSON-LD LocalBusiness structured data, and Naver webmaster registration. This is a local business — search visibility is critical.

7. **Add analytics.** GA4 or a privacy-friendly alternative (Plausible, Umami). Track: page views, CTA clicks (KakaoTalk opens), scroll depth, and section visibility.

8. **Specify KakaoTalk integration method.** Options: KakaoTalk Channel chat button (recommended), direct channel link, or PlusFriend. Include the SDK script or link format in the TECH doc.

9. **Remove or justify form element specs.** The VISUAL doc specifies form input styles, but no form exists in the UX plan. If a simple inquiry form will be added, add it to the IA/UX doc. If not, remove form specs from VISUAL to avoid confusion.

10. **Add a cross-browser test plan.** Minimum targets: Chrome, Safari (iOS/macOS), Samsung Internet. Call out known issues: `100svh` support, `backdrop-filter` on older browsers, smooth scroll behavior differences.

### Nice-to-have

11. **Content checklist.** Create a list of all required assets (instructor photo, 3-5 testimonials, 4-6 studio photos, KakaoTalk channel URL, address, phone number, business registration number). Block implementation of each section until its content is confirmed.

12. **Favicon and social sharing image.** Not mentioned in any document. A 512x512 icon and a 1200x630 OG image should be prepared alongside other assets.

---

## 5. Recommended Combined Direction

### Summary

The three documents are **well-aligned in vision** — a clean, premium, mobile-first one-page site for a local vocal studio. The core strategy (trust → proof → conversion via KakaoTalk) is sound. The main risk is not strategic but **operational: contradictions between docs will cause implementers to make inconsistent choices.**

### Canonical decisions (use these)

| Decision | Value | Source |
|----------|-------|--------|
| Stack | Vanilla HTML/CSS/JS, zero external dependencies | IA-UX (enforced) |
| Font | Pretendard (self-hosted, subset) | VISUAL (corrected) |
| Animations | Custom IntersectionObserver, no AOS | IA-UX principle (corrected) |
| Breakpoints | 640px / 1024px | VISUAL + TECH |
| Section count | 9 (per IA-UX wireframe) | IA-UX |
| Color palette | As defined in VISUAL | VISUAL |
| CTA primary channel | KakaoTalk (floating + hero + final CTA) | IA-UX |
| Lighthouse target | 95+ | TECH (higher bar) |
| Accessibility | WCAG 2.1 AA | All docs agree |
| Tone | 합쇼체, concise, no exaggeration | IA-UX |

### Recommended implementation sequence

1. Resolve the 5 must-fix items above (1 hour of alignment, saves days of rework).
2. Gather all real content (photos, text, credentials, KakaoTalk channel URL).
3. Build HTML structure following IA-UX section order.
4. Apply design tokens from VISUAL into `variables.css`.
5. Style mobile-first, section by section.
6. Add JS: nav toggle, smooth scroll, lightbox, scroll animations (custom observer).
7. Accessibility + performance audit (Lighthouse, axe, manual keyboard test).
8. Add SEO meta tags, structured data, analytics.
9. Deploy to staging, test on real devices (iPhone Safari, Android Chrome, Samsung Internet).
10. Launch.

### Final verdict

**The plans are 85% ready.** The remaining 15% is resolving the contradictions listed above. Do not start coding until items 1-5 in the recommendations are resolved — they affect foundational decisions (fonts, dependencies, breakpoints, section structure) that cascade through every file. Once aligned, these three documents provide a solid, complete blueprint for implementation.
