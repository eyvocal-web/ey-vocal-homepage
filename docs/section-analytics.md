# Section analytics — draft integration

The recorder activates only when valid `data-track-section` attributes exist. Current main markup has none. Source is `js/main.js`; rebuild with `node scripts/build-minified-assets.mjs`. No runtime dependencies or scroll listeners are added.

Canonical section/FAQ mapping: `~/Documents/Codex/2026-10-19/홈페이지 칸별 방문 기록/칸 키 표.md`. Attach those attributes during the separate design implementation. A details element uses `data-track="faq-1"` etc. Optional click keys use a short lowercase `data-track` token. Buttons without a stable key are omitted rather than reading their text.

`section_view`: continuous one-second visibility, 40% of viewport height or 60% of a smaller section. Section views, FAQ opens and the first page leave are deduplicated in sessionStorage for the visit. Centre-line observers accumulate visible dwell time (both side-by-side sections count). The first hidden/pagehide sends the summary with keepalive; returning to the tab never sends a second summary. Hidden time is excluded. This is an early-leave snapshot, not guaranteed complete session duration. `max_scroll_pct` is observed with intersections and sampled at leave; it is not a heatmap.

All events use the shared production-host/internal-device filter. Legacy click names stay unchanged. A marked click gets its closest section and a query-free target (explicit key, anchor or hostname/path prefix). Existing unmarked markup sends no new event types; existing requests have `p_section: null`. No input, rendered text, coordinates, IP, cookie or persistent visit identifier is read by the recorder.

Merge prerequisite: reviewed DB extension must be applied first. New `p_section`/`p_meta` parameters are unknown to the currently deployed 8-argument function. The single migration in ey-platform also supplies region parameters expected by the pending region PR #6. Do not merge either PR before DB approval/application. This branch does not include the region frontend patch; that PR remains separate.

The head contains a commented-out Clarity loader, with production/internal-device guards. Keep it commented until the account, project ID and privacy wording are approved. Existing inputs and iframes are masked during initialization; any future dynamically inserted chat iframe must carry `data-clarity-mask="true"` before insertion. Microsoft docs: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup and https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking.

Tests and captured payloads stay outside the repository in the handoff work/ folder. Supabase requests must always be intercepted in local browser tests. The live website must only be opened with `?ey_internal=1`.
