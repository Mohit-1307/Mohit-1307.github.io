/* ═══════════════════════════════════════════════════════
   MSR.ai — Live data layer
   GitHub REST API + LeetCode stats, with localStorage
   caching (1h TTL) and graceful curated fallbacks.
   ═══════════════════════════════════════════════════════ */
(() => {
'use strict';
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const TTL = 3e4; // 30 seconds — keeps stats close to real-time
const LIVE_REFRESH_MS = 3e4; // re-poll cadence for leetcode + github widgets

async function cachedJSON(key, url) {
  const k = 'msr.cache.' + key;
  try {
    const hit = JSON.parse(localStorage.getItem(k));
    if (hit && Date.now() - hit.t < TTL) return hit.d;
  } catch {}
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  const d = await res.json();
  try { localStorage.setItem(k, JSON.stringify({ t: Date.now(), d })); } catch {}
  return d;
}

const fmtDate = iso => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—';
const fmtSize = kb => kb > 1024 ? (kb / 1024).toFixed(1) + ' MB' : kb + ' KB';

/* ════════ PROJECTS ════════ */
const projState = { cat: 'All', q: '', data: [] };

async function loadProjects() {
  // one call for all repos (cheap on rate limit), then map to curated list
  let repoMap = {};
  try {
    const repos = await cachedJSON('repos', `https://api.github.com/users/${MSR.GH_USER}/repos?per_page=100&sort=updated`);
    repos.forEach(r => repoMap[r.name] = r);
  } catch (e) { console.warn('GitHub API unavailable, using curated fallback.', e); }

  projState.data = MSR.PROJECTS.map(p => {
    const r = repoMap[p.repo] || {};
    return {
      ...p,
      desc: r.description || p.fallbackDesc,
      stars: r.stargazers_count ?? null,
      forks: r.forks_count ?? null,
      lang: r.language || 'Python',
      topics: r.topics || [],
      size: r.size ?? null,
      updated: r.pushed_at || null,
      homepage: r.homepage || null,
      url: `https://github.com/${MSR.GH_USER}/${p.repo}`
    };
  });

  // enrich course cards from the same repo list
  $$('.course-meta[data-repo]').forEach(el => {
    const r = repoMap[el.dataset.repo];
    if (!r) return;
    $('.c-stars', el).textContent = r.stargazers_count;
    $('.c-updated', el).textContent = 'updated ' + fmtDate(r.pushed_at);
  });
  const repoCount = Object.keys(repoMap).length;
  if (repoCount) $('#gh-profile-meta').textContent = `Open-source portfolio · ${repoCount} public repos`;

  renderProjectFilters();
  renderProjects();
}

function renderProjectFilters() {
  const cats = ['All', ...new Set(MSR.PROJECTS.map(p => p.cat))];
  $('#project-filters').innerHTML = cats.map(c =>
    `<button class="chip${c === projState.cat ? ' active' : ''}" data-cat="${c}">${c}</button>`).join('');
}

function renderProjects() {
  const list = projState.data.filter(p =>
    (projState.cat === 'All' || p.cat === projState.cat) &&
    (!projState.q || (p.repo + ' ' + p.desc + ' ' + p.topics.join(' ')).toLowerCase().includes(projState.q)));
  const grid = $('#projects-grid');
  grid.innerHTML = list.length ? list.map((p, i) => `
    <article class="project-card" style="--i:${i}">
      <div class="project-banner"><span class="project-cat mono">${p.cat}</span><i class="${p.icon}" aria-hidden="true"></i></div>
      <div class="project-body">
        <h3 class="project-name">${p.repo.replace(/-/g, ' ')}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-meta">
          ${p.stars !== null ? `<span><i class="fa-solid fa-star"></i>${p.stars}</span>` : ''}
          ${p.forks !== null ? `<span><i class="fa-solid fa-code-fork"></i>${p.forks}</span>` : ''}
          <span><i class="fa-solid fa-circle-dot"></i>${p.lang}</span>
          ${p.updated ? `<span><i class="fa-regular fa-clock"></i>${fmtDate(p.updated)}</span>` : ''}
        </div>
        <div class="project-langs">${(p.topics.slice(0, 4).length ? p.topics.slice(0, 4) : [p.lang]).map(t => `<span class="lang-tag">${t}</span>`).join('')}</div>
        <div class="project-actions">
          <button class="mini-btn solid" data-details="${p.repo}"><i class="fa-solid fa-circle-info"></i> Details</button>
          <a class="mini-btn" href="${p.url}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> Code</a>
          ${p.homepage ? `<a class="mini-btn" href="${p.homepage}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Demo</a>` : ''}
        </div>
      </div>
    </article>`).join('')
    : `<p class="no-results">No projects match “${projState.q}”.</p>`;
}

$('#project-filters').addEventListener('click', e => {
  const b = e.target.closest('[data-cat]'); if (!b) return;
  projState.cat = b.dataset.cat; renderProjectFilters(); renderProjects();
});
$('#project-search').addEventListener('input', (window.MSR_debounce || (f => f))(e => { projState.q = e.target.value.trim().toLowerCase(); renderProjects(); }));

/* project modal */
const modal = $('#project-modal'), pmPanel = $('#pm-panel');
$('#projects-grid').addEventListener('click', e => {
  const btn = e.target.closest('[data-details]'); if (!btn) return;
  const p = projState.data.find(x => x.repo === btn.dataset.details); if (!p) return;
  pmPanel.innerHTML = `
    <button class="pm-close nav-icon-btn" data-pm-close aria-label="Close details"><i class="fa-solid fa-xmark"></i></button>
    <h3>${p.repo.replace(/-/g, ' ')}</h3>
    <p class="pm-sub mono">${p.cat} · ${p.timeline}</p>
    <div class="pm-stat-row">
      ${p.stars !== null ? `<span><i class="fa-solid fa-star"></i>${p.stars} stars</span>` : ''}
      ${p.forks !== null ? `<span><i class="fa-solid fa-code-fork"></i>${p.forks} forks</span>` : ''}
      <span><i class="fa-solid fa-circle-dot"></i>${p.lang}</span>
      ${p.size !== null ? `<span><i class="fa-solid fa-weight-hanging"></i>${fmtSize(p.size)}</span>` : ''}
      ${p.updated ? `<span><i class="fa-regular fa-clock"></i>updated ${fmtDate(p.updated)}</span>` : ''}
    </div>
    <p class="pm-desc">${p.desc}</p>
    <div class="pm-section"><h4>Architecture</h4><p class="pm-desc">${p.arch}</p></div>
    <div class="pm-section"><h4>Key features</h4><ul class="pm-features">${p.features.map(f => `<li>${f}</li>`).join('')}</ul></div>
    ${p.topics.length ? `<div class="pm-section"><h4>Topics</h4><div class="project-langs">${p.topics.map(t => `<span class="lang-tag">${t}</span>`).join('')}</div></div>` : ''}
    <div class="project-actions">
      <a class="mini-btn solid" href="${p.url}" target="_blank" rel="noopener"><i class="fa-brands fa-github"></i> View on GitHub</a>
      ${p.homepage ? `<a class="mini-btn" href="${p.homepage}" target="_blank" rel="noopener"><i class="fa-solid fa-arrow-up-right-from-square"></i> Live Demo</a>` : ''}
    </div>`;
  modal.hidden = false;
});
modal.addEventListener('click', e => { if (e.target.closest('[data-pm-close]')) modal.hidden = true; });

/* ════════ LEETCODE ════════ */
const LC_COLORS = { Easy: '#22c55e', Medium: '#f59e0b', Hard: '#ef4444' };
const LC_FALLBACK = { totalSolved: 475, easySolved: 173, totalEasy: 958, mediumSolved: 198, totalMedium: 2098, hardSolved: 104, totalHard: 961, ranking: null, submissionCalendar: null };

const LC_USER = 'MOHIT_SINGH_RAJPUT';
const LC_MIRRORS = [
  `https://leetcode-stats-api.herokuapp.com/${LC_USER}`,
  `https://alfa-leetcode-api.onrender.com/${LC_USER}/solved`,
  `https://leetcodeapi-v1.vercel.app/${LC_USER}`,
];

async function fetchLeetCodeLive() {
  for (const url of LC_MIRRORS) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const raw = await res.json();
      const d = normalizeLC(raw);
      if (d && d.totalSolved) return d;
    } catch { /* try next mirror */ }
  }
  return null;
}

// different mirrors use different field names — normalize to one shape
function normalizeLC(raw) {
  if (raw.totalSolved != null) return raw; // leetcode-stats-api shape
  if (raw.solvedProblem != null || raw.easySolved != null) {
    return {
      totalSolved: raw.solvedProblem ?? raw.totalSolved ?? 0,
      easySolved: raw.easySolved ?? 0, totalEasy: raw.totalEasy ?? raw.easyTotal ?? 0,
      mediumSolved: raw.mediumSolved ?? 0, totalMedium: raw.totalMedium ?? raw.mediumTotal ?? 0,
      hardSolved: raw.hardSolved ?? 0, totalHard: raw.totalHard ?? raw.hardTotal ?? 0,
      ranking: raw.ranking ?? null, submissionCalendar: raw.submissionCalendar ?? null
    };
  }
  return null;
}

async function loadLeetCode() {
  let d = LC_FALLBACK, live = true;
  try {
    const fresh = await fetchLeetCodeLive();
    if (fresh) d = fresh; else throw new Error('all mirrors failed');
  } catch { d = LC_FALLBACK; live = false; }

  // headline
  animateNumber($('#lc-solved'), d.totalSolved);
  $('#lc-rank').textContent = d.ranking ? `global ranking #${Number(d.ranking).toLocaleString()}` : (live ? 'live from LeetCode' : 'snapshot · live API unavailable');
  const noteEl = $('#lc-refresh-note');
  if (noteEl) noteEl.textContent = live ? `live · updated ${new Date().toLocaleTimeString()} · refreshes every 30s` : 'snapshot shown · retrying every 30s';
  const centerTotal = $('#lc-doughnut-total');
  if (centerTotal) animateNumber(centerTotal, d.totalSolved);

  // difficulty bars — scale relative to solved counts (site-wide totals aren't
  // reliably returned by every mirror, so anchoring to them left bars empty)
  const rows = [
    ['Easy', d.easySolved, d.totalEasy], ['Medium', d.mediumSolved, d.totalMedium], ['Hard', d.hardSolved, d.totalHard]
  ];
  const maxSolved = Math.max(d.easySolved || 0, d.mediumSolved || 0, d.hardSolved || 0, 1);
  $('#lc-bars').innerHTML = rows.map(([n, v, t]) => `
    <div class="lc-bar-row">
      <span class="diff" style="color:${LC_COLORS[n]}">${n}</span>
      <span class="lc-bar-track"><span class="lc-bar-fill" data-w="${Math.max((v || 0) / maxSolved * 100, v ? 4 : 0)}" style="background:${LC_COLORS[n]}"></span></span>
      <span class="val mono">${v}${t ? ' / ' + t : ''}</span>
    </div>`).join('');
  requestAnimationFrame(() => setTimeout(() =>
    $$('.lc-bar-fill').forEach(b => b.style.width = b.dataset.w + '%'), 60));

  // doughnut chart
  if (window.Chart) {
    const styles = getComputedStyle(document.documentElement);
    // avoid leaking/duplicating chart instances if loadLeetCode() ever runs twice
    const existing = Chart.getChart($('#lc-doughnut'));
    if (existing) existing.destroy();
    new Chart($('#lc-doughnut'), {
      type: 'doughnut',
      data: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
          data: [d.easySolved, d.mediumSolved, d.hardSolved],
          backgroundColor: Object.values(LC_COLORS),
          borderWidth: 0, hoverOffset: 10
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false, cutout: '68%',
        plugins: { legend: { position: 'bottom', labels: { color: styles.getPropertyValue('--muted').trim(), usePointStyle: true, padding: 18, font: { family: 'Inter', size: 12 } } } },
        animation: { animateRotate: true, duration: 1400, easing: 'easeOutQuart' }
      }
    });
  }

  // submission activity — full-year animated calendar (same treatment as the GitHub graph)
  renderHeatmap(d.submissionCalendar);
}

function animateNumber(el, end) {
  const t0 = performance.now(), dur = 1500;
  (function run(t) {
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(run);
  })(t0);
}

function renderHeatmap(calendar) {
  const grid = $('#lc-heatmap'), monthsRow = $('#lc-contrib-months'), tip = $('#lc-heatmap-note'), totalEl = $('#lc-contrib-total');
  if (!grid) return;

  let counts = null;
  if (calendar) {
    try {
      const cal = typeof calendar === 'string' ? JSON.parse(calendar) : calendar;
      counts = {};
      for (const [ts, c] of Object.entries(cal)) counts[Math.floor(+ts / 86400) * 86400] = c;
    } catch { calendar = null; }
  }

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const start = new Date(today); start.setDate(start.getDate() - 370);
  start.setDate(start.getDate() - start.getDay()); // align to preceding Sunday

  const seedCount = d => { // deterministic pseudo-pattern, used only when live data is unavailable
    const seed = (d.getDate() * 7 + d.getMonth() * 3 + d.getDay() * 5) % 11;
    return seed > 6 ? seed - 6 : 0;
  };
  const levelOf = c => c === 0 ? 0 : c < 2 ? 1 : c < 4 ? 2 : c < 7 ? 3 : 4;

  const weeks = [];
  let cur = new Date(start), total = 0, week = [];
  while (cur <= today) {
    const key = Math.floor(cur.getTime() / 1000 / 86400) * 86400;
    const inRange = cur >= new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const count = counts ? (counts[key] ?? 0) : seedCount(cur);
    if (inRange) total += count;
    week.push({ date: new Date(cur), count, inRange });
    if (cur.getDay() === 6) { weeks.push(week); week = []; }
    cur.setDate(cur.getDate() + 1);
  }
  if (week.length) weeks.push(week);

  totalEl.textContent = total.toLocaleString();

  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((w, wi) => {
    const firstValid = w.find(d => d.inRange) || w[0];
    const m = firstValid.date.getMonth();
    if (m !== lastMonth) { monthLabels.push({ i: wi, label: firstValid.date.toLocaleString('en-US', { month: 'short' }) }); lastMonth = m; }
  });
  monthsRow.innerHTML = monthLabels.map((m, i) => {
    const nextI = monthLabels[i + 1]?.i ?? weeks.length;
    return `<span style="grid-column:span ${nextI - m.i}">${m.label}</span>`;
  }).join('');
  monthsRow.style.gridTemplateColumns = `repeat(${weeks.length},1fr)`;

  grid.style.gridTemplateColumns = `repeat(${weeks.length},1fr)`;
  grid.innerHTML = weeks.map((w, wi) => `
    <div class="contrib-col">${w.map((d, di) => d.inRange
      ? `<span class="contrib-cell lc-cell" data-l="${levelOf(d.count)}" style="--i:${wi * 7 + di}" data-date="${d.date.toDateString()}" data-count="${d.count}"></span>`
      : `<span class="contrib-cell contrib-cell-empty" aria-hidden="true"></span>`
    ).join('')}</div>`).join('');

  requestAnimationFrame(() => $$('.lc-cell[data-l]', grid).forEach(c => {
    setTimeout(() => c.classList.add('in'), Number(c.style.getPropertyValue('--i')) * 2.2);
  }));

  grid.addEventListener('pointerover', e => {
    const c = e.target.closest('.lc-cell[data-date]');
    if (!c) return;
    const n = Number(c.dataset.count);
    tip.textContent = `${n} submission${n === 1 ? '' : 's'} on ${c.dataset.date}`;
  });
  grid.addEventListener('pointerleave', () => {
    tip.textContent = calendar ? 'Live submission calendar · hover a square for details' : 'Representative activity pattern · hover a square for details';
  }, true);
  tip.textContent = calendar ? 'Live submission calendar · hover a square for details' : 'Representative activity pattern · live calendar unavailable';
  const card = $('#lc-contrib-card');
  if (card) card.classList.toggle('contrib-fallback', !calendar);
}

/* ════════ GITHUB CONTRIBUTION GRAPH (custom-built, animated) ════════
   Pulls the real daily contribution calendar from a public GitHub
   GraphQL mirror; falls back to a deterministic pattern that still
   looks like a genuine year of activity if the mirror is unreachable. */
const GH_CONTRIB_MIRRORS = [
  `https://github-contributions-api.jogruber.de/v4/${MSR.GH_USER}?y=last`,
  `https://github-contributions-api.deno.dev/${MSR.GH_USER}.json`
];

async function fetchGithubContribLive() {
  for (const url of GH_CONTRIB_MIRRORS) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) continue;
      const raw = await res.json();
      const days = raw.contributions || raw.days;
      if (Array.isArray(days) && days.length) {
        const map = {};
        days.forEach(d => { map[d.date] = d.count ?? d.contributionCount ?? 0; });
        return map;
      }
    } catch { /* try next mirror */ }
  }
  return null;
}

function buildGithubContribGraph(liveMap) {
  const grid = $('#gh-contrib-grid'), monthsRow = $('#gh-contrib-months'), tip = $('#gh-contrib-tip'), totalEl = $('#gh-contrib-total');
  if (!grid) return;

  const today = new Date();
  const start = new Date(today); start.setDate(start.getDate() - 370);
  // align to the preceding Sunday so weeks stack into clean columns
  start.setDate(start.getDate() - start.getDay());

  const dayKey = d => d.toISOString().slice(0, 10);
  const seedCount = d => { // deterministic pseudo-pattern, used only when live data is unavailable
    const seed = (d.getDate() * 7 + d.getMonth() * 5 + d.getDay() * 3) % 13;
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const base = seed > 8 ? seed - 8 : (seed > 5 ? 1 : 0);
    return isWeekend ? Math.max(0, base - 1) : base;
  };
  const levelOf = c => c === 0 ? 0 : c < 3 ? 1 : c < 6 ? 2 : c < 10 ? 3 : 4;

  const weeks = [];
  let cur = new Date(start), total = 0, week = [];
  while (cur <= today) {
    const key = dayKey(cur);
    const inRange = cur >= new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const count = liveMap ? (liveMap[key] ?? 0) : seedCount(cur);
    if (inRange) total += count;
    week.push({ date: new Date(cur), count, inRange });
    if (cur.getDay() === 6) { weeks.push(week); week = []; }
    cur.setDate(cur.getDate() + 1);
  }
  if (week.length) weeks.push(week);

  totalEl.textContent = total.toLocaleString();

  // month labels — one per column where a new month begins, always including
  // every month the range spans (so "Aug" shows even at the very first column)
  const monthLabels = [];
  let lastMonth = -1;
  weeks.forEach((w, wi) => {
    const firstValid = w.find(d => d.inRange) || w[0];
    const m = firstValid.date.getMonth();
    if (m !== lastMonth) { monthLabels.push({ i: wi, label: firstValid.date.toLocaleString('en-US', { month: 'short' }) }); lastMonth = m; }
  });
  monthsRow.innerHTML = monthLabels.map((m, i) => {
    const nextI = monthLabels[i + 1]?.i ?? weeks.length;
    const span = nextI - m.i;
    return `<span style="grid-column:span ${span}">${m.label}</span>`;
  }).join('');
  monthsRow.style.gridTemplateColumns = `repeat(${weeks.length},1fr)`;

  grid.style.gridTemplateColumns = `repeat(${weeks.length},1fr)`;
  grid.innerHTML = weeks.map((w, wi) => `
    <div class="contrib-col">${w.map((d, di) => d.inRange
      ? `<span class="contrib-cell" data-l="${levelOf(d.count)}" style="--i:${wi * 7 + di}" data-date="${d.date.toDateString()}" data-count="${d.count}"></span>`
      : `<span class="contrib-cell contrib-cell-empty" aria-hidden="true"></span>`
    ).join('')}</div>`).join('');

  // staggered fade/scale-in, wave sweeping left to right
  requestAnimationFrame(() => $$('.contrib-cell[data-l]', grid).forEach(c => {
    setTimeout(() => c.classList.add('in'), Number(c.style.getPropertyValue('--i')) * 2.2);
  }));

  // hover tooltip
  grid.addEventListener('pointerover', e => {
    const c = e.target.closest('.contrib-cell[data-date]');
    if (!c) return;
    const n = Number(c.dataset.count);
    tip.textContent = `${n} contribution${n === 1 ? '' : 's'} on ${c.dataset.date}`;
  });
  grid.addEventListener('pointerleave', () => tip.textContent = 'hover a square for details', true);
}

let ghContribLoaded = false;
async function loadGithubContrib() {
  if (ghContribLoaded) return;
  ghContribLoaded = true;
  let live = null;
  try { live = await fetchGithubContribLive(); } catch { /* fall through to pattern */ }
  buildGithubContribGraph(live);
  const card = $('#gh-contrib-card');
  if (card && !live) card.classList.add('contrib-fallback');
}


function refreshGithubWidgets() {
  const stamp = Date.now();
  const img = $('#gh-img-langs');
  if (img && img.dataset.srcBase) {
    const sep = img.dataset.srcBase.includes('?') ? '&' : '?';
    img.src = `${img.dataset.srcBase}${sep}_ts=${stamp}`;
  }
  const note = $('#gh-refresh-note');
  if (note) note.textContent = `auto-refreshing every 30s · last pull ${new Date().toLocaleTimeString()}`;
}

/* ════════ INIT (lazy — only when sections near viewport) ════════ */
const lazyInit = new IntersectionObserver(entries => {
  for (const e of entries) {
    if (!e.isIntersecting) continue;
    lazyInit.unobserve(e.target);
    if (e.target.id === 'projects-section') loadProjects().catch(console.warn);
    if (e.target.id === 'leetcode-section') loadLeetCode().catch(console.warn);
    if (e.target.id === 'achievements-section') loadGithubContrib().catch(console.warn);
  }
}, { rootMargin: '600px' });
lazyInit.observe($('#projects-section'));
lazyInit.observe($('#leetcode-section'));
lazyInit.observe($('#achievements-section'));

// live polling — only fires while the relevant section is actually visible,
// so it stays lightweight when the user has scrolled away
let lcSectionVisible = false, ghSectionVisible = false;
new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.target.id === 'leetcode-section') lcSectionVisible = e.isIntersecting; });
}, { threshold: .1 }).observe($('#leetcode-section'));
const ghSection = $('#achievements-section');
if (ghSection) {
  new IntersectionObserver(entries => {
    entries.forEach(e => { ghSectionVisible = e.isIntersecting; });
  }, { threshold: .1 }).observe(ghSection);
}

const GH_CONTRIB_REFRESH_MS = 6e5; // 10 minutes — daily contribution data doesn't need 30s polling
setInterval(() => { if (lcSectionVisible) loadLeetCode().catch(console.warn); }, LIVE_REFRESH_MS);
setInterval(() => { if (ghSectionVisible) refreshGithubWidgets(); }, LIVE_REFRESH_MS);
setInterval(() => {
  if (!ghSectionVisible) return;
  ghContribLoaded = false;
  loadGithubContrib().catch(console.warn);
}, GH_CONTRIB_REFRESH_MS);
})();
