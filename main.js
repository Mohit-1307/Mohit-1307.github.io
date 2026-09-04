/* ═══════════════════════════════════════════════════════
   MSR.ai — Core application
   Theme engine · motion system · command palette ·
   section renderers · assistant · a11y controls
   ═══════════════════════════════════════════════════════ */
(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const html = document.documentElement;
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem('msr.' + k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem('msr.' + k, JSON.stringify(v)); } catch {} }
};
const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const debounce = (fn, ms = 120) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
window.MSR_debounce = debounce; // shared with api.js

/* ════════ SOUND ENGINE (tiny synth, opt-in) ════════ */
let audioCtx = null;
const sound = {
  on: store.get('sound', false),
  play(freq = 660, dur = .06, type = 'sine', gain = .04) {
    if (!this.on) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume(); // browsers start ctx suspended until a user gesture
      const o = audioCtx.createOscillator(), g = audioCtx.createGain();
      o.type = type; o.frequency.value = freq;
      g.gain.setValueAtTime(gain, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(.0001, audioCtx.currentTime + dur);
      o.connect(g).connect(audioCtx.destination);
      o.start(); o.stop(audioCtx.currentTime + dur);
    } catch {}
  },
  tick() { this.play(880, .04, 'sine', .03); },
  pop() { this.play(520, .09, 'triangle', .05); },
  // soft, quick blip for general touch/click feedback across the whole UI
  touch() { this.play(700, .045, 'sine', .025); }
};
// Generic touch/click sound — fires on any interactive element so the "UI sounds"
// toggle actually has something to say on nav links, cards, chips, socials, etc.,
// not just the handful of spots that already call sound.tick()/pop() explicitly.
document.addEventListener('pointerdown', e => {
  if (e.target.closest('a,button,.chip,.mode-toggle')) sound.touch();
});

/* ════════ TOASTS ════════ */
function toast(msg, icon = 'fa-circle-check') {
  const stack = $('#toast-stack');
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
  stack.appendChild(el);
  setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 450); }, 2600);
}

/* ════════ ORACLE AI THEME ════════
   Single hardcoded Oracle AI theme — no switching.
   Favicon uses Oracle teal. */
function toggleThemePanel() {} // stub so command palette reference doesn't break
(() => {
  const p = encodeURIComponent('#006b8f');
  const fav = $('#favicon');
  if (fav) fav.href = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='${p}'/%3E%3Ctext x='32' y='43' font-size='28' font-family='Inter' font-weight='700' fill='white' text-anchor='middle'%3EM%3C/text%3E%3C/svg%3E`;
  const meta = $('meta[name="theme-color"]');
  if (meta) meta.content = '#F5F2EC';
})();

/* ════════ ORACLE CONTACT WIDGET ════════
   Two stacked icon buttons on the right side (chat + call).
   Chat opens the AI assistant panel.
   Call/info button shows the contact popup (image 2 style). */
const oracleWidget = {
  popup: null,
  init() {
    this.popup = $('#oracle-contact-popup');
    const chatBtn = $('#ocw-chat-btn');
    const callBtn = $('#ocw-call-btn');
    const closeBtn = $('#ocp-close');
    const openChatRow = $('#ocp-open-chat');
    const togglePopup = (show) => { if (this.popup) this.popup.hidden = !show; };

    chatBtn?.addEventListener('click', () => {
      // chat button directly opens AI assistant
      openChat(chatPanel.hidden);
      togglePopup(false);
    });
    callBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePopup(!!this.popup?.hidden);
    });
    closeBtn?.addEventListener('click', () => togglePopup(false));
    openChatRow?.addEventListener('click', () => {
      togglePopup(false);
      openChat(true);
    });
    document.addEventListener('click', (e) => {
      if (!this.popup?.hidden &&
          !this.popup?.contains(e.target) &&
          !callBtn?.contains(e.target)) {
        togglePopup(false);
      }
    });
  }
};

/* ════════ ACCESSIBILITY (auto, follows system preference) ════════ */
html.classList.toggle('reduce-motion', prefersReduced);

/* ════════ BACK TO TOP ════════ */
const backToTop = $('#back-to-top');
backToTop.addEventListener('click', () => scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));

/* ════════ LOADER ════════ */
(() => {
  let hidden = false;
  const hide = () => { if (hidden) return; hidden = true; $('#loader').classList.add('done'); };
  window.addEventListener('load', () => setTimeout(hide, 900));
  setTimeout(hide, 3500); // failsafe, guarded so it can't fight the load-triggered hide
})();

/* ════════ GREETING (time-aware) ════════ */
(() => {
  const h = new Date().getHours();
  $('#greeting-text').textContent = h < 5 ? 'Burning the midnight oil' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
})();

/* ════════ TYPING EFFECT ════════ */
(() => {
  const el = $('#typing-target');
  let pi = 0, ci = 0, del = false;
  function tick() {
    if (html.classList.contains('reduce-motion')) { el.textContent = MSR.TYPED[0]; return; }
    const word = MSR.TYPED[pi];
    ci += del ? -1 : 1;
    el.textContent = word.slice(0, ci);
    let wait = del ? 34 : 72;
    if (!del && ci === word.length) { wait = 1900; del = true; }
    else if (del && ci === 0) { del = false; pi = (pi + 1) % MSR.TYPED.length; wait = 350; }
    setTimeout(tick, wait);
  }
  setTimeout(tick, 1300);
})();

/* ════════ SCROLL SYSTEMS ════════ */
const progressBar = $('#scroll-progress span');
const nav = $('#site-nav');
let lastY = 0, scrollTicking = false;
function onScrollFrame() {
  const y = scrollY;
  const max = document.body.scrollHeight - innerHeight; // one layout read per animation frame, not per scroll event
  progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
  nav.classList.toggle('hidden-nav', y > 400 && y > lastY);
  nav.classList.toggle('scrolled', y > 20);
  backToTop.classList.toggle('visible', y > 500);
  lastY = y;
  scrollTicking = false;
}
addEventListener('scroll', () => {
  if (!scrollTicking) { requestAnimationFrame(onScrollFrame); scrollTicking = true; }
}, { passive: true });

// reveal on scroll
const revealObs = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
}, { threshold: .12, rootMargin: '0px 0px -40px' });
// observe every current .reveal element, and expose a helper so content injected
// later (courses, experience, certs, blog, etc.) gets registered too — otherwise
// anything rendered after this line stays permanently invisible (opacity:0).
function observeReveals(root = document) {
  root.querySelectorAll('.reveal').forEach(el => {
    if (el.dataset.revealBound) return;
    el.dataset.revealBound = '1';
    revealObs.observe(el);
  });
}
window.MSR_observeReveals = observeReveals;
observeReveals();

// active nav link
const sections = $$('main section[id]');
const navMap = new Map($$('[data-nav]').map(a => [a.getAttribute('href').slice(1), a]));
const spy = new IntersectionObserver(entries => {
  for (const e of entries) if (e.isIntersecting) {
    navMap.forEach(a => a.classList.remove('active'));
    const link = navMap.get(e.target.id);
    if (link) link.classList.add('active');
  }
}, { rootMargin: '-35% 0px -55%' });
sections.forEach(s => spy.observe(s));

// mobile burger
const burger = $('#nav-burger'), navLinks = $('#nav-links');
burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
navLinks.addEventListener('click', e => { if (e.target.matches('a')) { navLinks.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });

/* ════════ CURSOR ════════ */
/* The real OS cursor is always shown — #cursor-dot is only a soft glow
   trailing behind it. A higher lerp factor keeps that trail tight to the
   pointer so movement never feels laggy. */
(() => {
  if (!matchMedia('(pointer:fine)').matches) return;
  const dot = $('#cursor-dot');
  let shown = false;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  const LERP = .55; // higher = trail sticks closer to the actual cursor, feels faster
  addEventListener('pointermove', e => {
    if (!shown) {
      dot.style.opacity = 1; shown = true;
      tx = cx = e.clientX; ty = cy = e.clientY;
      dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    }
    tx = e.clientX; ty = e.clientY;
  }, { passive: true });
  document.addEventListener('mouseleave', () => { dot.style.opacity = 0; shown = false; });
  document.addEventListener('mouseout', e => { if (!e.relatedTarget && !e.toElement) { dot.style.opacity = 0; shown = false; } });
  function raf() {
    cx += (tx - cx) * LERP;
    cy += (ty - cy) * LERP;
    if (shown) dot.style.transform = `translate(${cx}px,${cy}px) translate(-50%,-50%)`;
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  document.addEventListener('pointerover', e => {
    dot.classList.toggle('hovering', !!e.target.closest('a,button,input,textarea,.skill-card,.project-card'));
  });
})();

/* ════════ MAGNETIC BUTTONS ════════ */

/* ─── Social icon magnetic (unchanged — this is the reference feel) ─── */
$$('.magnetic').forEach(btn => {
  btn.addEventListener('pointermove', e => {
    if (html.classList.contains('reduce-motion')) return;
    const r = btn.getBoundingClientRect();
    btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .28}px)`;
  });
  btn.addEventListener('pointerleave', () => {
    btn.style.transition = 'transform .4s cubic-bezier(.23,1,.32,1)';
    btn.style.transform  = '';
    setTimeout(() => (btn.style.transition = ''), 400);
  });
});

/* ─── Card magnetic — IDENTICAL algorithm to social icons ─── */
// Key: NO transition on pointermove (instant = smooth), spring on pointerleave
const CARD_MAG = '.project-card,.skill-card,.cert-card,.course-card,.edu-card,.blog-card,.ach-card,.profile-links a,.hero-stats li,.xp-card,.lc-card';

function attachMag(card) {
  if (card._m) return;
  card._m = true;

  // Cap movement: max 12px regardless of card size
  card.addEventListener('pointerenter', () => {
    card.style.transition = 'none'; // instant tracking — no lag at all
    card.style.willChange = 'transform';
  });

  card.addEventListener('pointermove', e => {
    if (html.classList.contains('reduce-motion')) return;
    const r   = card.getBoundingClientRect();
    // Same factor as social icons (.18/.28) — capped to ±12px for large cards
    const rawX = (e.clientX - r.left  - r.width  / 2) * .18;
    const rawY = (e.clientY - r.top   - r.height / 2) * .18;
    const dx   = Math.max(-12, Math.min(12, rawX));
    const dy   = Math.max(-12, Math.min(12, rawY));
    card.style.transform = `translate(${dx}px,${dy}px)`;
  });

  card.addEventListener('pointerleave', () => {
    // Spring back exactly like social icons
    card.style.transition = 'transform .45s cubic-bezier(.23,1,.32,1), box-shadow .45s';
    card.style.transform  = '';
    card.style.boxShadow  = '';
    card.style.willChange = 'auto';
    setTimeout(() => (card.style.transition = ''), 460);
  });
}

function initAllCards() { $$(CARD_MAG).forEach(attachMag); }
initAllCards();
// Auto-attach to cards added after page load (API renders projects, skills, certs)
new MutationObserver(initAllCards).observe(document.body, { childList: true, subtree: true });


/* ════════ HERO TILT ════════ */
(() => {
  const scene = $('#hero-tilt');
  const wrap = $('.hero-visual');
  if (!scene || !matchMedia('(pointer:fine)').matches) return;
  wrap.addEventListener('pointermove', e => {
    if (html.classList.contains('reduce-motion')) return;
    const r = wrap.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - .5) * -14;
    const ry = ((e.clientX - r.left) / r.width - .5) * 16;
    scene.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  wrap.addEventListener('pointerleave', () => scene.style.transform = '');
})();

/* ════════ COUNTERS ════════ */
const counterObs = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    counterObs.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    (function run(t) {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(run);
    })(t0);
  }
}, { threshold: .6 });
$$('.counter').forEach(el => counterObs.observe(el));

/* ════════ SKILLS (logo grid — official icons, no bars/levels) ════════ */
function renderSkillFilters() {} // filters removed — all 27 skills shown
function renderSkills() {
  const grid = $('#skills-grid');
  if (!grid) return;
  grid.innerHTML = MSR.SKILLS.map((s, i) => `
    <article class="skill-card reveal" style="--i:${i}" data-name="${s.name}">
      <div class="skill-icon">
        ${s.img
          ? `<img src="${s.img}" alt="${s.name}" width="40" height="40" loading="lazy" onerror="this.style.display='none'">`
          : `<i class="${s.icon}" style="color:${s.color||'var(--primary)'}" aria-hidden="true"></i>`}
      </div>
      <span class="skill-name">${s.name}</span>
    </article>`).join('');
}
// Safe event binding (elements may be hidden/absent when filters removed)
// Skill search — filter cards by name as user types
$('#skill-filters')?.addEventListener('click', () => {});
$('#skill-search')?.addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  $$('#skills-grid .skill-card').forEach(card => {
    const name = (card.dataset.name || '').toLowerCase();
    card.style.display = (!q || name.includes(q)) ? '' : 'none';
  });
});
// Clear summary stat cards — removed by design
const skillSummaryEl = $('#skills-summary');
if (skillSummaryEl) skillSummaryEl.innerHTML = '';
renderSkills();


/* ════════ COURSES ════════ */
$('#course-track').innerHTML = MSR.COURSES.map((c, i) => `
  <li class="course-item reveal" style="--d:${i}">
    <div class="course-card">
      <h3><i class="${c.icon}" aria-hidden="true"></i>${c.title}<span class="xp-badge">${c.period}</span></h3>
      <p>${c.desc}</p>
      <div class="course-meta" data-repo="${c.repo}">
        <span><i class="fa-solid fa-star"></i><span class="c-stars">—</span> stars</span>
        <span><i class="fa-solid fa-code-commit"></i><span class="c-updated">—</span></span>
        <a href="https://github.com/${MSR.GH_USER}/${c.repo}" target="_blank" rel="noopener">View repository <i class="fa-solid fa-arrow-up-right-from-square"></i></a>
      </div>
    </div>
  </li>`).join('');
observeReveals($('#course-track'));

/* ════════ EXPERIENCE ════════ */
$('#xp-timeline').innerHTML = MSR.EXPERIENCE.map((x, i) => `
  <li class="xp-item reveal" style="--d:${i}">
    <div class="xp-card">
      <div class="xp-head"><h3>${x.role}</h3><span class="xp-badge">${x.badge}</span></div>
      <p class="xp-org">${x.org}</p>
      <p class="xp-date mono"><i class="fa-regular fa-calendar"></i> ${x.date}</p>
      <ul class="xp-points">${x.points.map(p => `<li>${p}</li>`).join('')}</ul>
      <div class="xp-stack">${x.stack.map(s => `<span class="lang-tag">${s}</span>`).join('')}</div>
    </div>
  </li>`).join('');
observeReveals($('#xp-timeline'));

/* ════════ CERTIFICATES ════════ */
const certState = { cat: 'All', q: '' };
function renderCertFilters() {
  const cats = ['All', ...new Set(MSR.CERTS.map(c => c.cat))];
  $('#cert-filters').innerHTML = cats.map(c =>
    `<button class="chip${c === certState.cat ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('');
}
function renderCerts() {
  const list = MSR.CERTS.filter(c =>
    (certState.cat === 'All' || c.cat === certState.cat) &&
    (!certState.q || (c.title + c.issuer).toLowerCase().includes(certState.q)));
  $('#cert-grid').innerHTML = list.length ? list.map((c, i) => {
    const iconHtml = c.img
      ? `<img src="${c.img}" alt="${c.issuer}" width="52" height="52" class="cert-issuer-img" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<i class=\\'fa-solid fa-award\\' style=\\'color:var(--primary);font-size:2rem\\'></i>')">`
      : `<i class="${c.icon||'fa-solid fa-award'}" style="color:${c.color||'var(--primary)'};font-size:2rem" aria-hidden="true"></i>`;
    const fileBtn = c.file
      ? `<a class="mini-btn solid cert-view-btn" href="${c.file}" target="_blank" rel="noopener" onclick="event.stopPropagation()"><i class="fa-solid fa-arrow-up-right-from-square"></i> View Certificate</a>`
      : '';
    return `<div class="cert-card" style="--i:${i}" data-idx="${MSR.CERTS.indexOf(c)}">`
      + `<div class="cert-art">${iconHtml}</div>`
      + `<div class="cert-body">`
      + `<h3 class="cert-title">${c.title}</h3>`
      + `<p class="cert-issuer">${c.issuer} · ${c.year}</p>`
      + `<div class="cert-actions">${fileBtn}</div>`
      + `</div></div>`;
  }).join('')
    : `<p class="no-results">No certificates match "${certState.q}".</p>`;
}
$('#cert-filters').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  certState.cat = b.dataset.cat; renderCertFilters(); renderCerts(); sound.tick();
});
$('#cert-search').addEventListener('input', debounce(e => { certState.q = e.target.value.trim().toLowerCase(); renderCerts(); }));
renderCertFilters(); renderCerts();

// lightbox
const lightbox = $('#lightbox');
$('#cert-grid').addEventListener('click', e => {
  const card = e.target.closest('.cert-card'); if (!card) return;
  const c = MSR.CERTS[+card.dataset.idx];
  $('#lb-art').innerHTML = `<i class="${c.icon}"></i>`;
  $('#lb-title').textContent = c.title;
  $('#lb-meta').textContent = `${c.issuer} · ${c.year} · ${c.cat}`;
  const fileLink = $('#lb-file');
  if (c.file) { fileLink.href = c.file; fileLink.hidden = false; }
  else { fileLink.hidden = true; }
  lightbox.hidden = false; sound.pop();
});
lightbox.addEventListener('click', e => { if (e.target.closest('[data-lb-close]')) lightbox.hidden = true; });

/* ════════ CONTACT FORM ════════ */
(() => {
  const form = $('#contact-form'), submit = $('#cf-submit');
  const fields = ['name', 'email', 'subject', 'message'].map(n => $('#cf-' + n));

  // ── EmailJS config ──────────────────────────────────────────
  // 1. Create a free account at https://www.emailjs.com
  // 2. Add an Email Service (e.g. Gmail) → copy its Service ID
  // 3. Create an Email Template with {{name}} {{email}} {{subject}} {{message}}
  //    as variables → copy its Template ID
  // 4. Account → General → copy your Public Key
  // 5. Paste all three below. Until they're filled in, the form
  //    falls back to opening the visitor's own mail client.
  const EMAILJS_PUBLIC_KEY = '7_2VMXL8M3TTaD2oU';
  const EMAILJS_SERVICE_ID = 'service_xz0n81b';
  const EMAILJS_TEMPLATE_ID = 'template_780vyxw';
  const emailjsReady = EMAILJS_PUBLIC_KEY && EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && window.emailjs;
  if (emailjsReady) emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });

  function validate(input) {
    const wrap = input.closest('.field'), err = $('.field-error', wrap);
    let msg = '';
    if (!input.value.trim()) msg = 'This field is required.';
    else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) msg = 'Please enter a valid email.';
    wrap.classList.toggle('invalid', !!msg);
    err.textContent = msg;
    return !msg;
  }
  fields.forEach(f => f.addEventListener('blur', () => validate(f)));

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!fields.every(f => validate(f))) { sound.tick(); return; }
    submit.classList.add('sending');
    const [name, email, subject, message] = fields.map(f => f.value.trim());

    function done(sentDirectly) {
      submit.classList.remove('sending'); submit.classList.add('done');
      toast(sentDirectly ? 'Message sent!' : 'Opening your mail client…', 'fa-paper-plane'); sound.pop();
      setTimeout(() => { submit.classList.remove('done'); form.reset(); }, 3200);
    }

    if (emailjsReady) {
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { name, email, subject, message })
        .then(() => done(true))
        .catch(() => {
          // network/config failure — fall back so the visitor's message isn't lost
          location.href = `mailto:mohitsinghrajput1307@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + subject)}&body=${encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')')}`;
          done(false);
        });
    } else {
      setTimeout(() => {
        location.href = `mailto:mohitsinghrajput1307@gmail.com?subject=${encodeURIComponent('[Portfolio] ' + subject)}&body=${encodeURIComponent(message + '\n\n— ' + name + ' (' + email + ')')}`;
        done(false);
      }, 900);
    }
  });
})();

/* ════════ COMMAND PALETTE ════════ */
const cmdk = $('#cmdk'), cmdkInput = $('#cmdk-input'), cmdkList = $('#cmdk-list');
let cmdItems = [], cmdSel = 0;
function buildCommands() {
  cmdItems = [
    ...MSR.CMD_SECTIONS.map(([label, target, icon]) => ({ label, icon, kind: 'section', run: () => { $(target)?.scrollIntoView({ behavior: 'smooth' }); } })),
    { label: 'Open AI Assistant', icon: 'fa-solid fa-robot', kind: 'action', run: () => openChat(true) },
    ...MSR.CMD_LINKS.map(([label, url, icon]) => ({ label, icon, kind: 'link', run: () => window.open(url, '_blank', 'noopener') }))
  ];
}
function renderCmd(q = '') {
  const list = cmdItems.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
  cmdSel = 0;
  cmdkList.innerHTML = list.length
    ? list.map((i, idx) => `<li data-idx="${cmdItems.indexOf(i)}" class="${idx === 0 ? 'sel' : ''}" role="option"><i class="${i.icon}"></i>${i.label}<span class="cmdk-kind">${i.kind}</span></li>`).join('')
    : '<li style="pointer-events:none">No results.</li>';
}
function openCmdk(open) {
  cmdk.hidden = !open;
  if (open) { buildCommands(); renderCmd(); cmdkInput.value = ''; setTimeout(() => cmdkInput.focus(), 40); sound.pop(); }
}
$('#cmdk-trigger').addEventListener('click', () => openCmdk(true));
cmdk.addEventListener('click', e => { if (e.target.closest('[data-cmdk-close]')) openCmdk(false); });
cmdkInput.addEventListener('input', () => renderCmd(cmdkInput.value));
cmdkList.addEventListener('click', e => {
  const li = e.target.closest('li[data-idx]'); if (!li) return;
  openCmdk(false); cmdItems[+li.dataset.idx].run();
});
cmdkInput.addEventListener('keydown', e => {
  const items = $$('li[data-idx]', cmdkList);
  if (!items.length) return;
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    cmdSel = (cmdSel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items.forEach((it, i) => it.classList.toggle('sel', i === cmdSel));
    items[cmdSel].scrollIntoView({ block: 'nearest' });
    sound.tick();
  } else if (e.key === 'Enter') {
    e.preventDefault();
    openCmdk(false); cmdItems[+items[cmdSel].dataset.idx].run();
  }
});

/* keyboard shortcuts */
document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openCmdk(cmdk.hidden); }
  if (e.key === 'Escape') { openCmdk(false); lightbox.hidden = true; $('#project-modal').hidden = true; $('#blog-modal').hidden = true; if ($('#oracle-contact-popup')) $('#oracle-contact-popup').hidden = true; openChat(false); }
  if (e.key === '/' && !e.target.matches('input,textarea')) { e.preventDefault(); $('#skill-search').focus(); }
});

/* ════════ AI ASSISTANT ════════ */
const chatPanel = $('#chat-panel'), chatLog = $('#chat-log'), chatForm = $('#chat-form'), chatInput = $('#chat-input');
let chatBooted = false;
function openChat(open) {
  chatPanel.hidden = !open;
  if (open && !chatBooted) {
    chatBooted = true;
    botSay(MSR.BOT.greeting);
    $('#chat-suggest').innerHTML = MSR.BOT.suggestions.map(s => `<button type="button">${s}</button>`).join('');
  }
  if (open) chatInput.focus();
}
function addMsg(htmlStr, who) {
  const el = document.createElement('div');
  el.className = 'chat-msg ' + who;
  el.innerHTML = htmlStr;
  chatLog.appendChild(el);
  chatLog.scrollTop = chatLog.scrollHeight;
  return el;
}
function botSay(answer) {
  const ind = addMsg('<span class="typing-ind"><i></i><i></i><i></i></span>', 'bot');
  setTimeout(() => { ind.innerHTML = answer; chatLog.scrollTop = chatLog.scrollHeight; sound.tick(); }, 650 + Math.random() * 500);
}
function botAnswer(q) {
  const l = q.toLowerCase();
  const rule = MSR.BOT.rules.find(r => r.k.some(k => l.includes(k)));
  botSay(rule ? rule.a : MSR.BOT.fallback);
}
// chat-fab replaced by Oracle widget — see oracleWidget.init()
$('#chat-close').addEventListener('click', () => openChat(false));
$('#chat-suggest').addEventListener('click', e => {
  if (!e.target.matches('button')) return;
  addMsg(e.target.textContent, 'user'); botAnswer(e.target.textContent);
});
chatForm.addEventListener('submit', e => {
  e.preventDefault();
  const q = chatInput.value.trim(); if (!q) return;
  addMsg(q.replace(/</g, '&lt;'), 'user');
  chatInput.value = '';
  botAnswer(q);
});

/* ════════ ORACLE WIDGET INIT ════════ */
oracleWidget.init();

/* ════════ 3D CARD TILT — project, skill, cert, course cards ════════ */
(() => {
  const CARD_SELECTORS = '.project-card,.skill-card,.cert-card,.course-card,.edu-card,.blog-card,.ach-card';
  function initTilt(card) {
    if (card._tiltInit) return;
    card._tiltInit = true;
    const MAX_ROT = 8; // max degrees
    const MAX_LIFT = 6; // px
    card.style.transition = 'transform .25s cubic-bezier(.25,.8,.25,1),box-shadow .25s';
    card.addEventListener('pointermove', e => {
      if (html.classList.contains('reduce-motion')) return;
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      card.style.transform = `perspective(700px) rotateY(${x * MAX_ROT}deg) rotateX(${-y * MAX_ROT}deg) translateY(-${MAX_LIFT}px) scale(1.012)`;
      card.style.boxShadow = `${-x*6}px ${-y*6}px 28px rgba(22,21,19,.13)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  }
  // Observe DOM for dynamically added cards
  const tiltObs = new MutationObserver(() => {
    $$(CARD_SELECTORS).forEach(initTilt);
  });
  tiltObs.observe(document.body, { childList: true, subtree: true });
  // Init existing cards
  $$(CARD_SELECTORS).forEach(initTilt);
})();

/* ════════ ORACLE AI CARD — Web Speech Introduction ════════ */
(() => {
  const INTRO = `Hi! I'm an AI assistant introducing Mohit Singh Rajput — an AI and Machine Learning Engineer based in Jaipur, India. Mohit is a final-year Computer Science student who builds intelligent systems that see, listen, reason, and respond. His core expertise spans multi-agent LLM orchestration using LangGraph and LangChain, RAG pipelines, real-time computer vision, and speech emotion recognition. He has interned at Labmentix and CodeAlpha, solved over 500 LeetCode problems, and holds certifications from Oracle, Google Cloud, Microsoft, and Anthropic. If you're looking for a passionate AI engineer who ships production-grade systems — Mohit is your person.`;
  const playBtn = $('#ai-play-btn');
  const playIcon = $('#ai-play-icon');
  const wave = $('#ai-wave');
  const caption = $('#ai-caption');
  if (!playBtn || !window.speechSynthesis) return;
  let speaking = false;
  function stopSpeech() {
    window.speechSynthesis.cancel(); speaking = false;
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (wave) wave.hidden = true;
    if (caption) caption.textContent = '▶ 30-second AI introduction';
  }
  function startSpeech() {
    const utter = new SpeechSynthesisUtterance(INTRO);
    utter.rate = 1.0; utter.pitch = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const eng = voices.find(v => v.lang === 'en-US' && /google|premium/i.test(v.name))
             || voices.find(v => v.lang === 'en-US')
             || voices.find(v => v.lang.startsWith('en'))
             || voices[0];
    if (eng) utter.voice = eng;
    utter.onstart = () => { speaking = true; if (playIcon) playIcon.className = 'fa-solid fa-pause'; if (wave) wave.hidden = false; if (caption) caption.textContent = 'AI is speaking...'; };
    utter.onend = utter.onerror = () => stopSpeech();
    window.speechSynthesis.speak(utter);
  }
  playBtn.addEventListener('click', () => {
    if (speaking) { stopSpeech(); return; }
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) { window.speechSynthesis.onvoiceschanged = startSpeech; }
    else { startSpeech(); }
  });
})();

/* ════════ ORACLE AI VIDEO CARD — Web Speech Introduction ════════ */
(() => {
  const INTRO = `Hi! I'm an AI assistant introducing Mohit Singh Rajput — an AI and Machine Learning Engineer based in Jaipur, India. Mohit is a final-year Computer Science student who builds intelligent systems that see, listen, reason, and respond. His core expertise spans multi-agent LLM orchestration using LangGraph and LangChain, RAG pipelines powered by FAISS and Sentence Transformers, real-time computer vision with OpenCV and deep CNNs, and speech emotion recognition with Librosa and PyTorch. He's interned at Labmentix and CodeAlpha, solved over 500 LeetCode problems, and holds certifications from Oracle, Google Cloud, Microsoft, and Anthropic. If you're looking for a passionate AI engineer who ships production-grade systems — Mohit is your person. Reach him at mohitsinghrajput1307@gmail.com.`;

  const playBtn = $('#ai-play-btn');
  const playIcon = $('#ai-play-icon');
  const wave = $('#ai-wave');
  const caption = $('#ai-caption');
  if (!playBtn || !window.speechSynthesis) return;

  let speaking = false;
  let utter = null;

  function stopSpeech() {
    window.speechSynthesis.cancel();
    speaking = false;
    if (playIcon) playIcon.className = 'fa-solid fa-play';
    if (wave) wave.hidden = true;
    if (caption) caption.textContent = '▶ 30-second AI introduction';
  }

  function startSpeech() {
    utter = new SpeechSynthesisUtterance(INTRO);
    utter.rate = 1.0; utter.pitch = 1.0; utter.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const eng = voices.find(v => v.lang === 'en-US' && /google|natural|premium/i.test(v.name))
             || voices.find(v => v.lang === 'en-US')
             || voices.find(v => v.lang.startsWith('en'))
             || voices[0];
    if (eng) utter.voice = eng;
    utter.onstart = () => {
      speaking = true;
      if (playIcon) playIcon.className = 'fa-solid fa-pause';
      if (wave) wave.hidden = false;
      if (caption) caption.textContent = 'AI is speaking...';
    };
    utter.onend = utter.onerror = () => stopSpeech();
    window.speechSynthesis.speak(utter);
  }

  playBtn.addEventListener('click', () => {
    if (speaking) { stopSpeech(); }
    else {
      // Voices may not be loaded on first call
      if (!window.speechSynthesis.getVoices().length) {
        window.speechSynthesis.onvoiceschanged = () => { startSpeech(); };
      } else { startSpeech(); }
    }
  });
})();

/* ════════ VISITOR COUNTER + FOOTER ════════ */
(() => {
  const counterEl = $('#visitor-counter');
  // Real global counter via CountAPI (free, no signup). Falls back to a
  // local per-browser count if the network request fails.
  fetch('https://api.countapi.xyz/hit/mohit-1307-github-io/portfolio-visits')
    .then(r => r.json())
    .then(data => {
      counterEl.innerHTML = `<i class="fa-solid fa-eye"></i> ${data.value.toLocaleString()} visits`;
    })
    .catch(() => {
      let visits = store.get('visits', 0) + 1;
      store.set('visits', visits);
      counterEl.innerHTML = `<i class="fa-solid fa-eye"></i> ${visits.toLocaleString()} visits`;
    });
  $('#footer-year').textContent = `© ${new Date().getFullYear()} Mohit Singh Rajput`;
})();

/* konami-style easter egg: type "ai" 3 times fast? keep it simple — logo click x5 */
(() => {
  let clicks = 0, timer;
  $('.nav-brand').addEventListener('click', () => {
    clicks++; clearTimeout(timer);
    timer = setTimeout(() => clicks = 0, 1200);
    if (clicks === 5) { toast('🎉 You found the easter egg!', 'fa-wand-magic-sparkles'); clicks = 0; }
  });
})();
})();
