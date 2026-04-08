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

  // ── OFFICE SELECTOR (Contact page) ──
  window.selectOffice = function(val) {
    const hiddenInput = document.getElementById('selected-office');
    if (hiddenInput) hiddenInput.value = val;

    const lblF   = document.getElementById('lbl-factory');
    const lblA   = document.getElementById('lbl-admin');
    const radF   = document.getElementById('radio-factory');
    const radA   = document.getElementById('radio-admin');
    const notice = document.getElementById('email-notice-text');
    const nBox   = document.getElementById('email-notice');
    const dot    = '<div style="width:10px;height:10px;border-radius:50%;background:var(--red);"></div>';

    if (val === 'factory') {
      if (lblF) { lblF.style.borderColor = 'var(--red)'; lblF.style.background = '#fff8f8'; }
      if (lblA) { lblA.style.borderColor = 'var(--border)'; lblA.style.background = '#fff'; }
      if (radF) { radF.style.borderColor = 'var(--red)'; radF.innerHTML = dot; }
      if (radA) { radA.style.borderColor = '#ccc'; radA.innerHTML = ''; }
      if (notice) notice.textContent = '✅ Enquiry will be sent to info@shivamcartons.com (Factory — Chandkhed, Maval)';
    } else {
      if (lblA) { lblA.style.borderColor = 'var(--red)'; lblA.style.background = '#fff8f8'; }
      if (lblF) { lblF.style.borderColor = 'var(--border)'; lblF.style.background = '#fff'; }
      if (radA) { radA.style.borderColor = 'var(--red)'; radA.innerHTML = dot; }
      if (radF) { radF.style.borderColor = '#ccc'; radF.innerHTML = ''; }
      if (notice) notice.textContent = '✅ Enquiry will be sent to admin@shivamcartons.com (Admin Office — Model Colony, Pune)';
    }
    if (nBox) { nBox.style.background = '#f0fff4'; nBox.style.borderColor = '#a5d6a7'; }
  };

  // ── SUBMIT ENQUIRY ──
  window.submitEnquiry = function() {
    const name      = document.getElementById('eq-name')?.value.trim();
    const company   = document.getElementById('eq-company')?.value.trim();
    const phone     = document.getElementById('eq-phone')?.value.trim();
    const email     = document.getElementById('eq-email')?.value.trim();
    const product   = document.getElementById('eq-product')?.value;
    const qty       = document.getElementById('eq-qty')?.value.trim();
    const city      = document.getElementById('eq-city')?.value.trim();
    const details   = document.getElementById('eq-details')?.value.trim();
    const officeVal = document.getElementById('selected-office')?.value;

    if (!name)      { alert('Please enter your name.'); return; }
    if (!phone)     { alert('Please enter your phone number.'); return; }
    if (!officeVal) { alert('Please select a contact office.'); return; }

    const toEmail     = officeVal === 'factory' ? 'info@shivamcartons.com' : 'admin@shivamcartons.com';
    const officeLabel = officeVal === 'factory'
      ? '🏭 Factory — Survey No. 284/1, Chandkhed, Maval, Pune 410 506'
      : '🏢 Admin  — 1126/2, Padmaban Apts, Model Colony, Pune 411 016';

    const subject = encodeURIComponent(`New Packaging Enquiry from ${name}${company ? ' – ' + company : ''}`);
    const body    = encodeURIComponent(
`New enquiry from shivamcartons.com:

━━━━━━━━━━━━━━━━━━━━━
CONTACT DETAILS
━━━━━━━━━━━━━━━━━━━━━
Name        : ${name}
Company     : ${company   || '—'}
Phone       : ${phone}
Email       : ${email     || '—'}
City        : ${city      || '—'}

━━━━━━━━━━━━━━━━━━━━━
REQUIREMENT
━━━━━━━━━━━━━━━━━━━━━
Product     : ${product   || '—'}
Quantity    : ${qty       || '—'}
Details     : ${details   || '—'}

━━━━━━━━━━━━━━━━━━━━━
Office      : ${officeLabel}
━━━━━━━━━━━━━━━━━━━━━`
    );

    window.location.href = `mailto:${toEmail}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      const s = document.getElementById('form-success');
      if (s) { s.style.display = 'flex'; s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }, 600);
  };

});