/* ============================================
   Main JS — EY보컬스튜디오
   Zero dependencies
   ============================================ */

(function () {
  'use strict';

  // 외부 의존성을 늘리지 않고도 정적 랜딩의 인터랙션 요구를 충족하려고 단일 IIFE로 수명주기를 닫습니다.
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNav();
    initSmoothScroll();
    initRevealAnimations();
    initFloatingCTA();

    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function initNav() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav__toggle');
    var mobileMenu = document.querySelector('.nav__mobile');
    var mobileLinks = mobileMenu ? Array.from(mobileMenu.querySelectorAll('a')) : [];

    // 모바일 메뉴는 단순 토글보다 접근성 손실이 커서, 포커스 이동과 스크롤 잠금을 한 함수에서 같이 관리합니다.
    function setMobileMenuState(isOpen, returnFocus) {
      if (!toggle || !mobileMenu) return;
      mobileMenu.hidden = !isOpen;
      mobileMenu.classList.toggle('is-open', isOpen);
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (isOpen && mobileLinks[0]) mobileLinks[0].focus();
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
        var focusable = [toggle].concat(mobileLinks).filter(function (el) {
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

  function initFloatingCTA() {
    var fab = document.querySelector('.floating-cta');
    if (!fab) return;

    // 첫 화면에서는 메인 CTA와 경쟁하지 않게 숨기고, 히어로를 지난 뒤에만 재호출 수단으로 보여 줍니다.
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) fab.classList.remove('is-visible');
        else fab.classList.add('is-visible');
      });
    }, { threshold: 0.4 });

    var hero = document.querySelector('.hero');
    if (hero) observer.observe(hero);
  }

})();
