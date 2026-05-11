/* ============================================================
   Shivam Cartons Pvt. Ltd. — Shared JavaScript
   File: assets/js/main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── ACTIVE NAV LINK ──
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nl>li>a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('act');
  });

  // ── MOBILE NAV ──
  const mobNav  = document.getElementById('mobNav');
  const burger  = document.querySelector('.hburg');
  const mobClose= document.querySelector('.mob-cl');
  if (burger)   burger.addEventListener('click', () => mobNav.classList.add('on'));
  if (mobClose) mobClose.addEventListener('click', () => mobNav.classList.remove('on'));
  if (mobNav)   mobNav.addEventListener('click', e => { if (e.target === mobNav) mobNav.classList.remove('on'); });

  // ── SCROLL REVEAL ──
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

  // ── COUNTER ANIMATION (stats strip) ──
  function animateCounter(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    if (el.dataset.text) return;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    let cur = 0;
    const t = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur.toLocaleString() + suffix;
      if (cur >= target) clearInterval(t);
    }, 16);
  }
  const statsStrip = document.querySelector('.stats');
  if (statsStrip) {
    const sObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.n[data-target]').forEach(el => {
            if (!el.dataset.counted) { el.dataset.counted = '1'; animateCounter(el); }
          });
        }
      });
    }, { threshold: 0.5 });
    sObs.observe(statsStrip);
  }

  // ── VIDEO PLAY ──
  window.playV = function(el) {
    const v  = el.querySelector('video');
    const ov = el.querySelector('.vplay');
    if (v) {
      if (v.paused) { v.play(); if (ov) ov.style.display = 'none'; }
      else          { v.pause(); if (ov) ov.style.display = 'flex'; }
    }
  };

  // ── QUALITY TABS ──
  window.qt = function(tab) {
    document.querySelectorAll('.qtb').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
    document.querySelectorAll('.qtcont').forEach(c => c.classList.toggle('on', c.id === 'qc-' + tab));
  };

  // ── HERO SLIDER ──
  (function() {
    var slides = document.querySelectorAll('.hslide');
    var dots   = document.querySelectorAll('.hs-dot');
    if (!slides.length) return;
    var current = 0;
    var timer;

    function goTo(n) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = (n + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function startAuto() {
      clearInterval(timer);
      timer = setInterval(next, 4000);
    }

    var btnPrev = document.querySelector('.hs-prev');
    var btnNext = document.querySelector('.hs-next');
    if (btnPrev) btnPrev.addEventListener('click', function() { prev(); startAuto(); });
    if (btnNext) btnNext.addEventListener('click', function() { next(); startAuto(); });

    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        goTo(parseInt(this.dataset.index, 10));
        startAuto();
      });
    });

    startAuto();
  })();

  // ── SUBMIT ENQUIRY ──
  window.submitEnquiry = function() {
    const name    = document.getElementById('eq-name')?.value.trim();
    const company = document.getElementById('eq-company')?.value.trim();
    const address = document.getElementById('eq-address')?.value.trim();
    const phone   = document.getElementById('eq-phone')?.value.trim();
    const email   = document.getElementById('eq-email')?.value.trim();
    const city    = document.getElementById('eq-city')?.value.trim();

    if (!name)  { alert('Please enter your name.'); return; }
    if (!phone) { alert('Please enter your phone number.'); return; }

    const subject = encodeURIComponent(`New Packaging Enquiry from ${name}${company ? ' – ' + company : ''}`);
    const body    = encodeURIComponent(
`New enquiry from shivamcartons.com:

━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━
Name        : ${name}
Company     : ${company || '—'}
Address     : ${address || '—'}
Phone       : ${phone}
Email       : ${email   || '—'}
City        : ${city    || '—'}
━━━━━━━━━━━━━━━━━━━━━`
    );

    window.location.href = `mailto:info@shivamcartons.com?subject=${subject}&body=${body}`;

    setTimeout(() => {
      const s = document.getElementById('form-success');
      if (s) { s.style.display = 'flex'; s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }, 600);
  };

});