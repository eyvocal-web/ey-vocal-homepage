# Section analytics — draft integration

The recorder activates only when valid `data-track-section` attributes exist. Current main markup has none. Source is `js/main.js`; rebuild with `node scripts/build-minified-assets.mjs`. No runtime dependencies or scroll listeners are added.

Canonical section/FAQ mapping: `~/Documents/Codex/2026-10-19/홈페이지 칸별 방문 기록/칸 키 표.md`. Attach those attributes during the separate design implementation. A details element uses `data-track="faq-1"` etc. Optional click keys use a short lowercase `data-track` token. Buttons without a stable key are omitted rather than reading their text.

`section_view`: continuous one-second visibility, 40% of viewport height or 60% of a smaller section. Section views, FAQ opens and the first page leave are deduplicated in sessionStorage for the visit. Centre-line observers accumulate visible dwell time (both side-by-side sections count). The first hidden/pagehide sends the summary with keepalive; returning to the tab never sends a second summary. Hidden time is excluded. This is an early-leave snapshot, not guaranteed complete session duration. `max_scroll_pct` uses invisible contiguous one-percent observation bands, so scrolling back within a tall section preserves the maximum. No markers are inserted in unannotated markup.

All events use the shared production-host/internal-device filter. Legacy click names stay unchanged. A marked click gets its closest section and a query-free target (explicit key, anchor or hostname/path prefix). Existing unmarked markup sends no new event types; existing requests omit empty `p_section`/`p_meta` arguments. No input, rendered text, coordinates, IP, cookie or persistent visit identifier is read by the recorder.

Merge prerequisite: reviewed DB extension must be applied first. New `p_section`/`p_meta` parameters are unknown to the currently deployed 8-argument function. The single migration `20261019144723_site_section_stats.sql` in ey-platform also supplies the region arguments. PR #6 region tracking is included in this branch; do not merge PR #7 before DB approval/application.

`/api/geo` returns only country/region/city from Vercel region headers. The shared host/internal filter covers both recorders. One lookup attempt per visit is cached in sessionStorage, including failure. Only page_view waits (up to 800ms). Any other event or page hide flushes a pending page_view first and then sends immediately. Later events attach only already-known nonempty region values. Failed lookups on unannotated main preserve the original eight-key request body.

The head contains a commented-out Clarity loader, with production/internal-device guards. Keep it commented until the account, project ID and privacy wording are approved. Existing inputs and iframes are masked during initialization; any future dynamically inserted chat iframe must carry `data-clarity-mask="true"` before insertion. Microsoft docs: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup and https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-masking.

Tests and captured payloads stay outside the repository in the handoff work/ folder. Supabase requests must always be intercepted in local browser tests. The live website must only be opened with `?ey_internal=1`.

v16 click target: `nav-booking` means an in-page navigation to `#booking` (desktop or mobile menu), while `hero-booking`, `lesson-booking` and `booking-booking` mean outbound Naver booking clicks. All retain `booking_click`; none indicate a completed booking. FAQ keys and the twelve section keys follow the canonical mapping. The floating Kakao link uses `floating-kakao` without inventing a section.
