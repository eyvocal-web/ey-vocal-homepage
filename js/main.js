/* ============================================
   Main JS — EY보컬스튜디오
   Zero dependencies
   ============================================ */

(function () {
  'use strict';

  const EVENT_URL = 'https://popnjfhuuqwmgvrmehdp.supabase.co/rest/v1/rpc/log_site_event';
  const PUBLIC_KEY = 'sb_publishable_BxoZks4s73GQuRg_afcJTg_RyVwAN1D';
  const GEO_URL = '/api/geo';
  const LIVE_HOSTS = ['eyvocal.com', 'www.eyvocal.com'];
  const params = new URLSearchParams(location.search);
  // 성능 검사(127.0.0.1)·미리보기 주소에서 열린 화면은 실제 방문이 아니므로 통계에서 뺀다.
  const liveHost = LIVE_HOSTS.indexOf(location.hostname) !== -1;
  let internal = false;
  let visitId = null;
  let attribution = {};
  let geoPromise = null;

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

  // 방문 지역(국가·시도·도시)은 세션당 한 번만 묻고, 늦거나 실패하면 지역 없이 기록한다.
  function getGeo() {
    if (geoPromise) return geoPromise;
    let cached = null;
    try { cached = JSON.parse(sessionStorage.getItem('ey_visit_geo') || 'null'); } catch (_) { cached = null; }
    if (cached) {
      geoPromise = Promise.resolve(cached);
      return geoPromise;
    }
    const empty = { country: null, region: null, city: null };
    const request = fetch(GEO_URL, { cache: 'no-store' })
      .then(function (response) { return response.ok ? response.json() : empty; })
      .then(function (geo) {
        const clean = {
          country: geo && geo.country || null,
          region: geo && geo.region || null,
          city: geo && geo.city || null
        };
        try { sessionStorage.setItem('ey_visit_geo', JSON.stringify(clean)); } catch (_) { /* 저장 불가여도 진행 */ }
        return clean;
      })
      .catch(function () { return empty; });
    const timeout = new Promise(function (resolve) { setTimeout(function () { resolve(empty); }, 1500); });
    geoPromise = Promise.race([request, timeout]);
    return geoPromise;
  }

  // Vercel's documented beforeSend hook also excludes internal page views.
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  window.va('beforeSend', function (event) { return internal ? null : event; });

  function logEvent(event) {
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
    function send(geo) {
      payload.p_country = geo.country;
      payload.p_region = geo.region;
      payload.p_city = geo.city;
      try {
        fetch(EVENT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', apikey: PUBLIC_KEY, Authorization: 'Bearer ' + PUBLIC_KEY },
          body: JSON.stringify(payload),
          keepalive: true
        }).catch(function () {});
      } catch (_) { /* Statistics must never affect the page. */ }
    }
    getGeo().then(send, function () { send({ country: null, region: null, city: null }); });
  }

  // 외부 의존성을 늘리지 않고도 정적 랜딩의 인터랙션 요구를 충족하려고 단일 IIFE로 수명주기를 닫습니다.
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    logEvent('page_view');
    initTrackedLinks();
    initNav();
    initSmoothScroll();
    initRevealAnimations();

    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function initTrackedLinks() {
    document.addEventListener('click', function (event) {
      const link = event.target.closest('a[href]');
      if (!link) return;
      const href = link.getAttribute('href') || '';
      if (href === '#booking' || href.includes('booking.naver.com/')) logEvent('booking_click');
      else if (href.startsWith('tel:')) logEvent('phone_click');
      else if (href.startsWith('https://open.kakao.com/')) logEvent('kakao_click');
    });
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
