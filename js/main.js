/* ============================================
   Main JS — EY보컬스튜디오
   Zero dependencies
   ============================================ */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNav();
    initSmoothScroll();
    initRevealAnimations();
    initInstructorToggle();
    initFloatingCTA();

    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function initNav() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav__toggle');
    var mobileMenu = document.querySelector('.nav__mobile');
    var mobileLinks = mobileMenu ? Array.from(mobileMenu.querySelectorAll('a')) : [];

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

  function initInstructorToggle() {
    var btn = document.querySelector('.instructor__more');
    var extra = document.querySelector('.instructor__extra');
    if (!btn || !extra) return;

    btn.addEventListener('click', function () {
      var isOpen = extra.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen);
      btn.querySelector('.instructor__more-text').textContent = isOpen ? '접기' : '레슨 안내 더 보기';
      btn.querySelector('.instructor__more-arrow').textContent = isOpen ? '↑' : '↓';
    });
  }

  function initFloatingCTA() {
    var fab = document.querySelector('.floating-cta');
    if (!fab) return;

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
