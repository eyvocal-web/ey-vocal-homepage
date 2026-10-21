/* ============================================
   Main JS — EY보컬스튜디오
   Zero dependencies
   ============================================ */

(function () {
  'use strict';

  const EVENT_URL = 'https://popnjfhuuqwmgvrmehdp.supabase.co/rest/v1/rpc/log_site_event';
  const PUBLIC_KEY = 'sb_publishable_BxoZks4s73GQuRg_afcJTg_RyVwAN1D';
  const liveHost = /^(www\.)?eyvocal\.com$/.test(location.hostname);
  let sectionTracking = false;
  const params = new URLSearchParams(location.search);
  let internal = false;
  let visitId = null;
  let attribution = {};
  let geo = {};
  let pendingPageView = false;
  let pageViewTimer;

  function createVisitId() {
    if (typeof crypto.randomUUID === 'function') return crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 15) | 64;
    bytes[8] = (bytes[8] & 63) | 128;
    const hex = Array.from(bytes, function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
    return hex.slice(0, 8) + '-' + hex.slice(8, 12) + '-' + hex.slice(12, 16) + '-' + hex.slice(16, 20) + '-' + hex.slice(20);
  }

  try {
    if (params.get('ey_internal') === '1') localStorage.setItem('ey_internal', '1');
    if (params.get('ey_internal') === '0') localStorage.removeItem('ey_internal');
    internal = !liveHost || localStorage.getItem('ey_internal') === '1';
    if (internal) localStorage.setItem('va-disable', 'true');
    else if (params.get('ey_internal') === '0') localStorage.removeItem('va-disable');
    if (!internal) {
      visitId = sessionStorage.getItem('ey_visit_id') || createVisitId();
      sessionStorage.setItem('ey_visit_id', visitId);
      attribution = JSON.parse(sessionStorage.getItem('ey_visit_attribution') || 'null') || {
        utm_source: params.get('utm_source'),
        utm_medium: params.get('utm_medium'),
        utm_campaign: params.get('utm_campaign')
      };
      sessionStorage.setItem('ey_visit_attribution', JSON.stringify(attribution));
    }
  } catch (_) {
    // Storage may be disabled; keep this page usable and avoid persistent identifiers.
    internal = !liveHost || params.get('ey_internal') === '1';
    if (!internal) visitId = createVisitId();
  }

  // Vercel's documented beforeSend hook also excludes internal page views.
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.va('beforeSend', function (event) { return internal ? null : event; });

  function flushPageView() {
    if (!pendingPageView) return;
    pendingPageView = false;
    clearTimeout(pageViewTimer);
    sendEvent('page_view');
  }

  function initVisit() {
    if (internal || !visitId) return;
    pendingPageView = true;
    pageViewTimer = setTimeout(flushPageView, 800);
    window.addEventListener('pagehide', flushPageView);
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) flushPageView();
    });
    function cleanGeo(value) {
      const result = {};
      ['country', 'region', 'city'].forEach(function (key, i) {
        if (value && typeof value[key] === 'string' && value[key].trim()) {
          result[key] = value[key].trim().slice(0, [2, 10, 60][i]);
        }
      });
      return result;
    }
    try {
      const cached = sessionStorage.getItem('ey_visit_geo');
      if (cached !== null) {
        const record = JSON.parse(cached);
        if (record.visit === visitId) {
          geo = cleanGeo(record.geo);
          flushPageView();
          return;
        }
      }
      // Record the attempt before fetching so failure/reload never retries this visit.
      sessionStorage.setItem('ey_visit_geo', JSON.stringify({visit: visitId, geo: {}}));
    } catch (_) { /* Storage can be unavailable; this document still attempts only once. */ }
    fetch('/api/geo').then(function (response) {
      if (!response.ok) throw new Error('geo unavailable');
      return response.json();
    }).then(function (value) {
      geo = cleanGeo(value);
      try { sessionStorage.setItem('ey_visit_geo', JSON.stringify({visit: visitId, geo: geo})); } catch (_) {}
      flushPageView();
    }).catch(flushPageView);
  }

  function logEvent(event, section, meta) {
    if (internal || !visitId) return;
    flushPageView();
    sendEvent(event, section, meta);
  }

  function sendEvent(event, section, meta) {
    if (internal || !visitId) return;
    let referrerHost = null;
    try {
      if (document.referrer) {
        const host = new URL(document.referrer).hostname.toLowerCase();
        if (host !== 'eyvocal.com' && host !== 'www.eyvocal.com') referrerHost = host;
      }
    } catch (_) { /* Invalid referrer is omitted. */ }
    const width = window.innerWidth;
    const payload = {
      p_visit_id: visitId,
      p_event: event,
      p_path: location.pathname,
      p_referrer_host: referrerHost,
      p_utm_source: attribution.utm_source || null,
      p_utm_medium: attribution.utm_medium || null,
      p_utm_campaign: attribution.utm_campaign || null,
      p_device: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop'
    };
    // Keep the legacy eight-key body; extension arguments are sent only when populated.
    ['country', 'region', 'city'].forEach(function (key) {
      if (geo[key]) payload['p_' + key] = geo[key];
    });
    if (section) payload.p_section = section;
    const cleanedMeta = meta && cleanMeta(event, meta);
    if (cleanedMeta && Object.keys(cleanedMeta).length) payload.p_meta = cleanedMeta;
    try {
      fetch(EVENT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: PUBLIC_KEY, Authorization: 'Bearer ' + PUBLIC_KEY },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {});
    } catch (_) { /* Statistics must never affect the page. */ }
  }

  // 외부 의존성을 늘리지 않고도 정적 랜딩의 인터랙션 요구를 충족하려고 단일 IIFE로 수명주기를 닫습니다.
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initVisit();
    initSectionTracking();
    initTrackedLinks();
    document.querySelectorAll('iframe, input, textarea, select').forEach(function (el) {
      el.setAttribute('data-clarity-mask', 'true');
    });
    initNav();
    initSmoothScroll();
    initFloatingContact();

    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  // Only explicit attributes enable the new recorder. No text/input/coordinate reads.
  function sectionOf(element) {
    const parent = element && element.closest('[data-track-section]');
    const key = parent && parent.getAttribute('data-track-section');
    return /^[a-z][a-z0-9-]{0,23}$/.test(key || '') ? key : null;
  }

  function cleanMeta(event, meta) {
    let clean = {};
    if (event === 'page_leave') {
      const dwell = {};
      Object.keys(meta.dwell || {}).slice(0, 12).forEach(function (key) {
        const seconds = Math.floor(meta.dwell[key]);
        if (/^[a-z][a-z0-9-]{0,23}$/.test(key) && seconds > 0 && Number.isFinite(seconds)) {
          dwell[key] = seconds;
        }
      });
      clean = {
        max_scroll_pct: Math.max(0, Math.min(100, Math.floor(meta.max_scroll_pct || 0))),
        last_section: /^[a-z][a-z0-9-]{0,23}$/.test(meta.last_section || '') ? meta.last_section : null,
        dwell: dwell,
        total_s: Math.max(0, Math.floor(meta.total_s || 0))
      };
    } else if (typeof meta.target === 'string') {
      clean.target = meta.target.slice(0, 120);
    }
    return new TextEncoder().encode(JSON.stringify(clean)).length <= 1024 ? clean : null;
  }

  function clickTarget(control) {
    const explicit = control.getAttribute('data-track');
    if (/^[a-z][a-z0-9-]{0,63}$/.test(explicit || '')) return explicit;
    const href = control.getAttribute('href') || '';
    if (href.startsWith('tel:')) return 'phone';
    if (!href) return null;
    try {
      const url = new URL(href, location.href);
      if (!/^https?:$/.test(url.protocol)) return null;
      if (url.origin === location.origin) {
        return /^#[a-zA-Z][a-zA-Z0-9_-]{0,63}$/.test(url.hash) ? url.hash : url.pathname.slice(0, 120);
      }
      return (url.hostname + url.pathname.split('/').slice(0, 4).join('/')).slice(0, 120);
    } catch (_) { return null; }
  }

  function initTrackedLinks() {
    document.addEventListener('click', function (event) {
      const control = event.target instanceof Element && event.target.closest('a[href], button');
      if (!control) return;
      const href = control.getAttribute('href') || '';
      const section = sectionOf(control);
      const target = clickTarget(control);
      const meta = sectionTracking && target ? {target: target} : null;
      if (href === '#booking' || href.includes('booking.naver.com/')) logEvent('booking_click', section, meta);
      else if (href.startsWith('tel:')) logEvent('phone_click', section, meta);
      else if (href.startsWith('https://open.kakao.com/')) logEvent('kakao_click', section, meta);
      else if (control.getAttribute('data-track') === 'chat-open') logEvent('chat_open', section, meta);
      else if (sectionTracking && section && target) logEvent('link_click', section, {target: target});
    });
  }

  function initSectionTracking() {
    const sections = Array.from(document.querySelectorAll('[data-track-section]')).filter(function (el) { return sectionOf(el); });
    if (internal || !visitId || !sections.length || !window.IntersectionObserver) return;
    sectionTracking = true;
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem('ey_section_stats') || '{}') || {}; } catch (_) { /* optional storage */ }
    const seen = new Set(Array.isArray(saved.seen) ? saved.seen : []);
    const faqs = new Set(Array.isArray(saved.faqs) ? saved.faqs : []);
    let left = saved.left === true;
    function persist() {
      try { sessionStorage.setItem('ey_section_stats', JSON.stringify({seen: Array.from(seen), faqs: Array.from(faqs), left: left})); } catch (_) { /* optional storage */ }
    }
    const dwell = {};
    const started = performance.now();
    let visibleSince = document.hidden ? null : started;
    let visibleMs = 0;
    let current = [];
    let currentSince = started;
    let lastSection = sectionOf(sections[0]);
    let maxScroll = 0;
    const timers = new Map();
    const qualified = new Set();
    function sample() {
      const now = performance.now();
      if (visibleSince !== null) current.forEach(function (key) { dwell[key] = (dwell[key] || 0) + now - currentSince; });
      currentSince = now;
      if (document.hidden) { current = []; return; }
      const middle = window.innerHeight / 2;
      current = [];
      sections.forEach(function (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= middle && rect.bottom > middle) current.push(sectionOf(el));
      });
      if (current.length) lastSection = current[current.length - 1];
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      maxScroll = Math.max(maxScroll, scrollable > 0 ? Math.min(100, window.scrollY / scrollable * 100) : 100);
    }
    function cancelViews() {
      timers.forEach(function (id) { clearTimeout(id); });
      timers.clear();
      qualified.clear();
    }
    function observeSections() {
      cancelViews();
      if (viewObserver) viewObserver.disconnect();
      // Include each exact visibility threshold; ratios alone must not assume fixed section heights.
      viewObserver = new IntersectionObserver(function (entries) {
        sample();
        entries.forEach(function (entry) {
          const el = entry.target;
          const key = sectionOf(el);
          const required = entry.boundingClientRect.height < window.innerHeight ? entry.boundingClientRect.height * 0.6 : window.innerHeight * 0.4;
          const enough = entry.isIntersecting && entry.intersectionRect.height + 0.5 >= required;
          if (enough && !document.hidden) qualified.add(el);
          else { qualified.delete(el); clearTimeout(timers.get(el)); timers.delete(el); }
          if (enough && !document.hidden && !seen.has(key) && !timers.has(el)) {
            timers.set(el, setTimeout(function () {
              timers.delete(el);
              const rect = el.getBoundingClientRect();
              const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(0, rect.top);
              const minimum = rect.height < window.innerHeight ? rect.height * 0.6 : window.innerHeight * 0.4;
              if (!document.hidden && qualified.has(el) && visible + 0.5 >= minimum && !seen.has(key)) {
                seen.add(key); persist(); logEvent('section_view', key);
              }
            }, 1000));
          }
        });
      }, {threshold: Array.from(new Set([0, 1].concat(sections.map(function (el) {
        const height = el.getBoundingClientRect().height;
        return height > 0 && height >= window.innerHeight ? window.innerHeight * 0.4 / height : 0.6;
      }))))});
      sections.forEach(function (el) { viewObserver.observe(el); });
    }
    let viewObserver;
    // A one-pixel observation band tracks the centre without a scroll listener.
    let centreObserver;
    function observeCentre() {
      if (centreObserver) centreObserver.disconnect();
      const top = Math.floor(window.innerHeight / 2);
      centreObserver = new IntersectionObserver(sample, {rootMargin: '-' + top + 'px 0px -' + (window.innerHeight - top - 1) + 'px 0px', threshold: 0});
      sections.forEach(function (el) { centreObserver.observe(el); });
    }
    let progressObserver;
    let progressMarkers;
    function updateProgress() {
      if (document.hidden) return;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      maxScroll = Math.max(maxScroll, scrollable > 0 ? Math.min(100, window.scrollY / scrollable * 100) : 100);
    }
    function observeProgress() {
      if (progressObserver) progressObserver.disconnect();
      if (!progressMarkers) {
        progressMarkers = document.createElement('div');
        progressMarkers.setAttribute('aria-hidden', 'true');
        progressMarkers.setAttribute('data-clarity-mask', 'true');
        progressMarkers.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:0;opacity:0;pointer-events:none';
        document.body.appendChild(progressMarkers);
      }
      progressMarkers.replaceChildren();
      const scrollable = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      const step = scrollable / 100;
      // Contiguous 1%-bands cross a one-pixel viewport-top observation line.
      // Even a jump within one tall section records its maximum before scrolling back.
      progressObserver = new IntersectionObserver(updateProgress, {
        rootMargin: '0px 0px -' + Math.max(0, window.innerHeight - 1) + 'px 0px', threshold: 0
      });
      for (let i = 0; i < 100; i++) {
        const marker = document.createElement('span');
        marker.style.cssText = 'position:absolute;left:0;width:1px;top:' + Math.floor(i * step) + 'px;height:' + Math.max(1, Math.ceil(step) + 1) + 'px';
        progressMarkers.appendChild(marker);
        progressObserver.observe(marker);
      }
      updateProgress();
    }
    function leave() {
      // Accrue the last visible interval before document.hidden prevents sampling.
      const now = performance.now();
      if (visibleSince !== null) current.forEach(function (key) { dwell[key] = (dwell[key] || 0) + now - currentSince; });
      current = []; currentSince = now;
      if (visibleSince !== null) visibleMs += now - visibleSince;
      visibleSince = null;
      cancelViews();
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      maxScroll = Math.max(maxScroll, scrollable > 0 ? Math.min(100, window.scrollY / scrollable * 100) : 100);
      if (left) return;
      left = true; persist();
      const seconds = {};
      Object.keys(dwell).forEach(function (key) { const n = Math.floor(dwell[key] / 1000); if (n > 0) seconds[key] = n; });
      logEvent('page_leave', lastSection, {max_scroll_pct: maxScroll, last_section: lastSection, dwell: seconds, total_s: Math.floor(visibleMs / 1000)});
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) leave();
      else { visibleSince = performance.now(); currentSince = visibleSince; sample(); observeSections(); }
    });
    window.addEventListener('pagehide', leave);
    window.addEventListener('resize', function () { sample(); observeSections(); observeCentre(); observeProgress(); });
    // ResizeObserver also handles FAQ/image layout changes.
    if (window.ResizeObserver) new ResizeObserver(function () { sample(); observeSections(); observeCentre(); observeProgress(); }).observe(document.body);
    document.querySelectorAll('details[data-track]').forEach(function (details) {
      details.addEventListener('toggle', function () {
        const key = details.getAttribute('data-track');
        const section = sectionOf(details);
        if (details.open && section && /^faq-[1-8]$/.test(key || '') && !faqs.has(key)) {
          faqs.add(key); persist(); logEvent('faq_open', section, {target: key});
        }
      });
    });
    sample(); observeSections(); observeCentre(); observeProgress();
  }

  function initNav() {
    const toggle = document.querySelector('.nav__toggle');
    const menu = document.querySelector('.nav__mobile');
    if (!toggle || !menu) return;
    const links = Array.from(menu.querySelectorAll('a'));
    function setOpen(open, returnFocus) {
      menu.hidden = !open;
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
      if (open && links[0]) links[0].focus();
      if (!open && returnFocus) toggle.focus();
    }
    toggle.addEventListener('click', function () { setOpen(menu.hidden, false); });
    links.forEach(function (link) { link.addEventListener('click', function () { setOpen(false, false); }); });
    document.addEventListener('keydown', function (event) {
      if (menu.hidden) return;
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false, true); }
      if (event.key === 'Tab') {
        const controls = [toggle].concat(links);
        const index = controls.indexOf(document.activeElement);
        if (event.shiftKey && index === 0) { event.preventDefault(); links[links.length - 1].focus(); }
        else if (!event.shiftKey && index === controls.length - 1) { event.preventDefault(); toggle.focus(); }
      }
    });
    document.addEventListener('click', function (event) {
      if (!menu.hidden && !event.target.closest('.ey-burger')) setOpen(false, true);
    });
    window.matchMedia('(min-width: 1069px)').addEventListener('change', function (event) {
      if (event.matches) setOpen(false, false);
    });
  }

  function initSmoothScroll() {
    // Native fragment navigation preserves bookmarks without motion or header offsets.
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (event) {
        const hash = anchor.getAttribute('href');
        if (hash.length < 2) return;
        const target = document.getElementById(hash.slice(1));
        if (!target) return;
        event.preventDefault();
        history.replaceState(null, '', hash);
        target.scrollIntoView({behavior: 'instant', block: 'start'});
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({preventScroll: true});
      });
    });
  }

  function initFloatingContact() {
    const floating = document.querySelector('.kakao-launch');
    if (!floating) return;
    const contacts = Array.from(document.querySelectorAll('.ey-hero a[href^="https://open.kakao.com/"], .ey-booking a[href^="https://open.kakao.com/"]'));
    if (!contacts.length || !window.IntersectionObserver) return;
    const visible = new Set();
    floating.hidden = true;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      });
      floating.hidden = visible.size > 0;
    });
    contacts.forEach(function (contact) { observer.observe(contact); });
  }
})();
