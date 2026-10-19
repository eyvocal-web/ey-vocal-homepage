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

  try {
    if (params.get('ey_internal') === '1') localStorage.setItem('ey_internal', '1');
    if (params.get('ey_internal') === '0') localStorage.removeItem('ey_internal');
    internal = !liveHost || localStorage.getItem('ey_internal') === '1';
    if (internal) localStorage.setItem('va-disable', 'true');
    else if (params.get('ey_internal') === '0') localStorage.removeItem('va-disable');
    if (!internal) {
      visitId = sessionStorage.getItem('ey_visit_id') || crypto.randomUUID();
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
    if (!internal) visitId = crypto.randomUUID();
  }

  // Vercel's documented beforeSend hook also excludes internal page views.
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.va('beforeSend', function (event) { return internal ? null : event; });

  function logEvent(event, section, meta) {
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
      p_device: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
      p_section: section || null
    };
    if (meta) payload.p_meta = cleanMeta(event, meta);
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
    logEvent('page_view');
    initSectionTracking();
    initTrackedLinks();
    document.querySelectorAll('iframe, input, textarea, select').forEach(function (el) {
      el.setAttribute('data-clarity-mask', 'true');
    });
    initNav();
    initSmoothScroll();
    initRevealAnimations();

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
          dwell[key] = Math.min(seconds, 86400);
        }
      });
      clean = {
        max_scroll_pct: Math.max(0, Math.min(100, Math.floor(meta.max_scroll_pct || 0))),
        last_section: /^[a-z][a-z0-9-]{0,23}$/.test(meta.last_section || '') ? meta.last_section : null,
        dwell: dwell,
        total_s: Math.max(0, Math.min(86400, Math.floor(meta.total_s || 0)))
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
    window.addEventListener('resize', function () { sample(); observeSections(); observeCentre(); });
    // ResizeObserver also handles FAQ/image layout changes.
    if (window.ResizeObserver) new ResizeObserver(function () { sample(); observeSections(); observeCentre(); }).observe(document.body);
    document.querySelectorAll('details[data-track]').forEach(function (details) {
      details.addEventListener('toggle', function () {
        const key = details.getAttribute('data-track');
        const section = sectionOf(details);
        if (details.open && section && /^faq-[1-8]$/.test(key || '') && !faqs.has(key)) {
          faqs.add(key); persist(); logEvent('faq_open', section, {target: key});
        }
      });
    });
    sample(); observeSections(); observeCentre();
  }

  function initNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;
    var toggle = document.querySelector('.nav__toggle');
    var mobileMenu = document.querySelector('.nav__mobile');
    var closeButton = mobileMenu ? mobileMenu.querySelector('.nav__close') : null;
    var mobileLinks = mobileMenu ? Array.from(mobileMenu.querySelectorAll('a')) : [];
    var previousBodyOverflow = '';
    var previousRootOverflow = '';

    // 모바일 메뉴는 단순 토글보다 접근성 손실이 커서, 포커스 이동과 스크롤 잠금을 한 함수에서 같이 관리합니다.
    function setMobileMenuState(isOpen, returnFocus) {
      if (!toggle || !mobileMenu) return;
      var wasOpen = mobileMenu.classList.contains('is-open');
      if (isOpen && !wasOpen) {
        previousBodyOverflow = document.body.style.overflow;
        previousRootOverflow = document.documentElement.style.overflow;
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
      } else if (!isOpen && wasOpen) {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousRootOverflow;
      }
      mobileMenu.hidden = !isOpen;
      mobileMenu.classList.toggle('is-open', isOpen);
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
      var firstControl = closeButton || mobileLinks[0];
      if (isOpen && firstControl) firstControl.focus();
      if (!isOpen && returnFocus) toggle.focus();
    }

    function closeMobileMenu(returnFocus) {
      setMobileMenuState(false, returnFocus);
    }

    var ticking = false;
    function onScroll() {
      // 스크롤 이벤트마다 클래스를 바꾸지 않고 rAF로 묶어, 고정 헤더가 있는 모바일에서도 잔떨림을 줄입니다.
      if (!ticking) {
        requestAnimationFrame(function() {
          if (window.scrollY > 60) nav.classList.add('is-scrolled');
          else nav.classList.remove('is-scrolled');
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function () {
        setMobileMenuState(!mobileMenu.classList.contains('is-open'), false);
      });

      if (closeButton) {
        closeButton.addEventListener('click', function () {
          closeMobileMenu(true);
        });
      }

      mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          closeMobileMenu(false);
        });
      });

      document.addEventListener('keydown', function (e) {
        if (!mobileMenu.classList.contains('is-open')) return;

        if (e.key === 'Escape') {
          closeMobileMenu(true);
          return;
        }

        if (e.key !== 'Tab') return;

        // 메뉴가 dialog 역할을 갖기 때문에, 열린 동안 포커스가 바깥으로 새지 않게 최소한의 트랩을 유지합니다.
        var focusable = [closeButton].concat(mobileLinks).filter(function (el) {
          return el && !el.hasAttribute('disabled');
        });
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (!focusable.length) return;

        if (focusable.indexOf(document.activeElement) === -1) {
          e.preventDefault();
          first.focus();
          return;
        }

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      });

      window.addEventListener('resize', function () {
        if (window.innerWidth >= 1024 && mobileMenu.classList.contains('is-open')) {
          closeMobileMenu(false);
        }
      });
    }
  }

  function initSmoothScroll() {
    // 같은 페이지 안 이동은 맥락을 끊지 않는 편이 전환에 유리해, 네비 높이만 보정한 부드러운 스크롤을 사용합니다.
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (targetId === '#') return;
        var target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        var navHeight = document.querySelector('.nav').offsetHeight;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      });
    });
  }

  function initRevealAnimations() {
    var reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    // 정보 랜딩에서 애니메이션은 장식보다 읽기 보조여야 하므로, reduced-motion 사용자는 즉시 노출로 전환합니다.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      reveals.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) { observer.observe(el); });
  }
})();
