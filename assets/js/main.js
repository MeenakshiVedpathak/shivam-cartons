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

  // ── HERO DUAL VIDEO BACKGROUND ──
  (function() {
    var vid1 = document.getElementById('heroVid1');
    var vid2 = document.getElementById('heroVid2');
    if (!vid1 || !vid2) return;

    function switchTo(next, prev) {
      next.currentTime = 0;
      var playPromise = next.play();
      if (playPromise !== undefined) {
        playPromise.catch(function() {});
      }
      next.classList.add('active');
      prev.classList.remove('active');
    }

    vid1.addEventListener('ended', function() { switchTo(vid2, vid1); });
    vid2.addEventListener('ended', function() { switchTo(vid1, vid2); });

    // Attempt autoplay; browsers may block unmuted autoplay
    vid1.play().catch(function() {});
  })();

  // ── SUBMIT ENQUIRY ──
  window.submitEnquiry = async function() {
    const name    = document.getElementById('eq-name')?.value.trim();
    const company = document.getElementById('eq-company')?.value.trim();
    const address = document.getElementById('eq-address')?.value.trim();
    const phone   = document.getElementById('eq-phone')?.value.trim();
    const email   = document.getElementById('eq-email')?.value.trim();
    const city    = document.getElementById('eq-city')?.value.trim();
    const enq_description    = document.getElementById('eq-description')?.value.trim();

    if (!name)  { alert('Please enter your name.'); return; }
    if (!phone) { alert('Please enter your phone number.'); return; }
    if (!/^[6-9]\d{9}$/.test(phone.replace(/[\s\-\+]/g, '').replace(/^91/, ''))) { alert('Please enter a valid 10-digit Indian mobile number.'); return; }
    if (!email) { alert('Please enter your email.'); return; }
    if (!city) { alert('Please enter city.'); return; }
    if (!enq_description) { alert('Please enter enquiry details.'); return; }


    const btn = document.querySelector('.sbtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:8px;"></i>Sending...'; }

    const message = [
      'Name    : ' + name,
      'Company : ' + (company || '—'),
      'Address : ' + (address || '—'),
      'Phone   : ' + phone,
      'Email   : ' + (email   || '—'),
      'City    : ' + (city    || '—'),
      'Enquiry : ' + enq_description
    ].join('\n');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          access_key: 'b621768c-e588-4d0d-8844-db0aa0151f94',
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
        document.getElementById('eq-description').value = '';
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