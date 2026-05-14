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

  window.playYT = function(el) {
    const id = el.dataset.ytid;
    if (!id) return;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    iframe.style.cssText = 'width:100%;height:100%;border:0;display:block;';
    el.style.cursor = 'default';
    el.onclick = null;
    el.innerHTML = '';
    el.appendChild(iframe);
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
  window.submitEnquiry = async function() {
    const name    = document.getElementById('eq-name')?.value.trim();
    const company = document.getElementById('eq-company')?.value.trim();
    const address = document.getElementById('eq-address')?.value.trim();
    const phone   = document.getElementById('eq-phone')?.value.trim();
    const email   = document.getElementById('eq-email')?.value.trim();
    const city    = document.getElementById('eq-city')?.value.trim();

    if (!name)  { alert('Please enter your name.'); return; }
    if (!phone) { alert('Please enter your phone number.'); return; }

    const btn = document.querySelector('.sbtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px;"></i>Sending...'; }

    const message = [
      'Name    : ' + name,
      'Company : ' + (company || '—'),
      'Address : ' + (address || '—'),
      'Phone   : ' + phone,
      'Email   : ' + (email   || '—'),
      'City    : ' + (city    || '—'),
    ].join('\n');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: '6460884c-c141-47db-8211-1d273c6cb3e6',
          subject: 'New Packaging Enquiry from ' + name + (company ? ' – ' + company : ''),
          from_name: 'Shivam Cartons Website',
          name, email: email || 'not provided', phone, message,
          botcheck: ''
        })
      });
      const data = await res.json();
      if (data.success) {
        const s = document.getElementById('form-success');
        if (s) { s.style.display = 'flex'; s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
        document.getElementById('eq-name').value = '';
        document.getElementById('eq-company').value = '';
        document.getElementById('eq-address').value = '';
        document.getElementById('eq-phone').value = '';
        document.getElementById('eq-email').value = '';
        document.getElementById('eq-city').value = '';
      } else {
        alert('Something went wrong. Please call us or email info@shivamcartons.com directly.');
      }
    } catch (e) {
      alert('Network error. Please call us or email info@shivamcartons.com directly.');
    }

    if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:8px;"></i>Send Enquiry'; }
  };

});

document.getElementById("dynamic-year").textContent = new Date().getFullYear();