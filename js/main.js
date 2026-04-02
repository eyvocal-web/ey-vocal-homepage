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
    initLightbox();
    initTrialForm();

    var yearEl = document.getElementById('current-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    const mobileMenu = document.querySelector('.nav__mobile');
    const mobileLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    function closeMobileMenu(returnFocus) {
      if (!toggle || !mobileMenu) return;
      mobileMenu.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', '메뉴 열기');
      document.body.style.overflow = '';
      if (returnFocus) toggle.focus();
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
        const isOpen = mobileMenu.classList.toggle('is-open');
        toggle.classList.toggle('is-active');
        toggle.setAttribute('aria-expanded', isOpen);
        toggle.setAttribute('aria-label', isOpen ? '메뉴 닫기' : '메뉴 열기');
        document.body.style.overflow = isOpen ? 'hidden' : '';
        const firstLink = mobileMenu.querySelector('a');
        if (isOpen && firstLink) firstLink.focus();
      });

      mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
          closeMobileMenu(false);
        });
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
          closeMobileMenu(true);
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

  function initLightbox() {
    var lightbox = document.querySelector('.lightbox');
    if (!lightbox) return;

    var lightboxImg = lightbox.querySelector('.lightbox__img');
    var closeBtn = lightbox.querySelector('.lightbox__close');
    var lastTrigger = null;

    function openLightbox(item) {
      var img = item.querySelector('img');
      if (!img) return;
      lastTrigger = item;
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.setAttribute('aria-modal', 'true');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    }

    document.querySelectorAll('.gallery__item').forEach(function (item) {
      item.addEventListener('click', function () {
        openLightbox(item);
      });
    });

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastTrigger) lastTrigger.focus();
    }

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();

      if (e.key === 'Tab' && lightbox.classList.contains('is-open')) {
        var focusable = [closeBtn, lightboxImg];
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  function initTrialForm() {
    var form = document.getElementById('trial-form');
    if (!form) return;

    var status = document.getElementById('trial-form-status');
    var kakaoUrl = 'https://open.kakao.com/o/seso1YLg';

    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var nameEl = document.getElementById('trial-name');
      var phoneEl = document.getElementById('trial-phone');
      var name = nameEl.value.trim();
      var phone = phoneEl.value.trim();
      var date = document.getElementById('trial-date').value.trim();
      var time = document.getElementById('trial-time').value.trim();
      var purpose = document.getElementById('trial-purpose').value;
      var note = document.getElementById('trial-note').value.trim();

      var nameField = nameEl.closest('.trial-form__field');
      var phoneField = phoneEl.closest('.trial-form__field');
      nameField.classList.remove('is-error');
      phoneField.classList.remove('is-error');

      if (!name || !phone) {
        if (!name) nameField.classList.add('is-error');
        if (!phone) phoneField.classList.add('is-error');
        status.textContent = '이름과 연락처를 먼저 입력해 주세요.';
        status.className = 'trial-form__status is-error';
        return;
      }

      var lines = [
        '[체험레슨 예약 요청]',
        '이름: ' + name,
        '연락처: ' + phone,
        '희망 날짜: ' + (date || '미정'),
        '희망 시간: ' + (time || '미정'),
        '레슨 목적: ' + purpose,
        '남기실 말씀: ' + (note || '없음')
      ];
      var message = lines.join('\n');

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(message);
          status.textContent = '예약 요청 내용이 복사되었습니다. 열리는 카카오톡 창에 붙여넣어 보내 주세요.';
          status.className = 'trial-form__status is-success';
        } else {
          status.textContent = '자동 복사가 지원되지 않아 직접 복사해 주세요.';
          status.className = 'trial-form__status is-error';
        }
      } catch (error) {
        status.textContent = '복사 권한이 없어 직접 복사해 주세요.';
        status.className = 'trial-form__status is-error';
      }

      window.open(kakaoUrl, '_blank', 'noopener');
    });
  }
})();
