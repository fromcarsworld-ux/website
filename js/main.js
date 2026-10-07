/* =========================================================================
   Behaviour: fit-to-width scaling, news rail, services carousel, anchors.
   ========================================================================= */
(function () {
  'use strict';

  var PAGE_W = 1440;
  var PAGE_H = 3017.77;
  var stage = document.getElementById('stage');

  /* ------------------------- fit-to-width scaling ------------------------ */
  function fit() {
    var vw = document.documentElement.clientWidth;
    if (vw < PAGE_W) {
      var s = vw / PAGE_W;
      stage.style.transform = 'scale(' + s + ')';
      document.body.style.height = Math.ceil(PAGE_H * s) + 'px';
      document.body.classList.add('is-fitting');
    } else {
      stage.style.transform = '';
      document.body.style.height = '';
      document.body.classList.remove('is-fitting');
    }
  }
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', fit);

  /* ---------------- anchor scrolling that respects the scale -------------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    var y = t.getBoundingClientRect().top + window.pageYOffset - 24;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  });

  /* ============================ NEWS RAIL ================================ */
  /* Rail cards sit on a 320px pitch starting at x708 and slide underneath the
     two pinned cards. Travel ends when the last card is flush with x1440.   */
  (function () {
    var track = document.getElementById('newsTrack');
    if (!track) return;
    var prev = document.getElementById('newsPrev');
    var next = document.getElementById('newsNext');
    var STEP = 320;
    var RAIL_RIGHT = 1440;
    var pos = 0;

    function maxTravel() {
      var cards = track.children;
      if (!cards.length) return 0;
      var last = cards[cards.length - 1];
      return Math.max(0, last.offsetLeft + last.offsetWidth - RAIL_RIGHT);
    }
    function render() {
      track.style.transform = 'translateX(' + -pos + 'px)';
      prev.disabled = pos <= 0;
      next.disabled = pos >= maxTravel();
    }
    function go(p) {
      pos = Math.min(maxTravel(), Math.max(0, p));
      render();
    }
    prev.addEventListener('click', function () { go(pos - STEP); });
    next.addEventListener('click', function () { go(pos + STEP); });
    render();
    window.addEventListener('resize', render);
  })();

  /* ========================= SERVICES CAROUSEL =========================== */
  (function () {
    var track = document.getElementById('svcTrack');
    if (!track) return;
    var slides = track.children;
    var tabs = document.querySelectorAll('.tabs .tab');
    var dots = document.querySelectorAll('.svc__dots .dot');
    var prev = document.getElementById('svcPrev');
    var next = document.getElementById('svcNext');
    var W = 1296;
    var index = 0;
    var last = slides.length - 1;

    function render() {
      track.style.transform = 'translateX(' + -index * W + 'px)';
      for (var i = 0; i < slides.length; i++) {
        var on = i === index;
        slides[i].setAttribute('aria-hidden', on ? 'false' : 'true');
        if (tabs[i]) {
          tabs[i].classList.toggle('is-active', on);
          tabs[i].setAttribute('aria-selected', on ? 'true' : 'false');
          tabs[i].setAttribute('tabindex', on ? '0' : '-1');
        }
        if (dots[i]) {
          dots[i].classList.toggle('is-active', on);
          dots[i].setAttribute('aria-current', on ? 'true' : 'false');
        }
      }
      prev.disabled = index === 0;
      next.disabled = index === last;
    }
    function go(i) { index = Math.min(last, Math.max(0, i)); render(); }

    prev.addEventListener('click', function () { go(index - 1); });
    next.addEventListener('click', function () { go(index + 1); });
    Array.prototype.forEach.call(tabs, function (t, i) {
      t.addEventListener('click', function () { go(i); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); tabs[index].focus(); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); tabs[index].focus(); }
      });
    });
    Array.prototype.forEach.call(dots, function (d, i) {
      d.addEventListener('click', function () { go(i); });
    });
    render();
  })();
})();
