/* ================================================================
   XADA SITE ENGINE
   Do not normally edit this file. Customize config.js instead.
   ================================================================ */
const cfg = window.SITE_CONFIG;
const productsRoot = document.querySelector('#store-window');
const controlsRoot = document.querySelector('#store-controls');
let products = [];
let current = 0;
let timer;

const escapeHtml = (value = '') => { const d = document.createElement('div'); d.textContent = value; return d.innerHTML; };
const escapeAttr = (value = '') => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------- Site content ----------
document.title = `${cfg.identity.name} — Presence`;
document.querySelector('#site-name').textContent = cfg.identity.name;
document.querySelector('#site-tagline').textContent = cfg.identity.tagline;
document.querySelector('#store-link').href = cfg.store.url;
document.querySelector('#footer-quote').innerHTML = cfg.footer.quoteHtml;
document.querySelector('#footer-copy').textContent = `© ${new Date().getFullYear()} ${cfg.identity.name}`;
document.querySelector('#logo-fallback').textContent = cfg.identity.fallbackRune || 'ᛉ';

if (cfg.identity.logo) {
  const logo = document.querySelector('#site-logo');
  logo.src = cfg.identity.logo;
  logo.hidden = false;
  document.querySelector('#logo-fallback').hidden = true;
}

// ---------- Links ----------
document.querySelector('#social-links').innerHTML = (cfg.links || []).map(item => `
  <a class="${item.primary ? 'primary' : ''}" href="${escapeAttr(item.url)}" target="_blank" rel="noopener noreferrer">
    <span class="symbol">${escapeHtml(item.symbol || '᛫')}</span>
    <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.subtitle || '')}</small></span>
    <b>↗</b>
  </a>`).join('');

// ---------- Jinxxy: original visual carousel, live item count ----------
function normalizeProduct(p, index, manual = {}) {
  return {
    id: String(p?.id ?? manual.id ?? `product-${index}`),
    name: p?.name || manual.name || `Creation ${index + 1}`,
    description: manual.description || p?.description || p?.short_description || 'A creation from the XaDa store.',
    tag: manual.tag || p?.tag || (p?.base_price === 0 ? 'FREE ASSET' : 'CREATION'),
    url: manual.url || p?.url || cfg.store.url,
    image: manual.image || '' // IMPORTANT: image is always controlled locally.
  };
}

function manualForLiveProduct(live, index) {
  const manual = cfg.store.products || [];
  const liveId = String(live?.id ?? '');
  const liveName = String(live?.name ?? '').trim().toLowerCase();
  return manual.find(m => String(m.id) === liveId) || manual.find(m => String(m.name).trim().toLowerCase() === liveName) || manual[index] || {};
}

async function fetchLiveProducts() {
  if (!cfg.store.jinxxyProxyUrl) return null;
  const response = await fetch(cfg.store.jinxxyProxyUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Jinxxy feed returned ${response.status}`);
  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.results || data.products || []);
  return list.filter(Boolean);
}

function renderProducts(liveList = null) {
  const manual = cfg.store.products || [];
  let source;
  if (Array.isArray(liveList) && liveList.length) {
    // Live data determines how many products are shown. Local config determines images.
    source = liveList.map((live, i) => normalizeProduct(live, i, manualForLiveProduct(live, i)));
  } else {
    source = manual.map((p, i) => normalizeProduct(p, i, p));
  }
  products = source;

  if (!products.length) {
    productsRoot.innerHTML = '<div class="store-empty">No creations configured yet.</div>';
    controlsRoot.innerHTML = '';
    return;
  }

  current = Math.min(current, products.length - 1);
  productsRoot.innerHTML = products.map((p, i) => `
    <article class="product ${i === current ? 'active' : ''}">
      <div class="product-art ${p.image ? 'has-image' : ''}">
        ${p.image ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" loading="lazy">` : `<span aria-hidden="true">${i % 2 ? 'ᛟ' : 'ᛏ'}</span>`}
      </div>
      <div class="product-copy">
        <span class="tag">${escapeHtml(p.tag)}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <a href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer">See on Jinxxy ↗</a>
      </div>
    </article>`).join('');

  controlsRoot.innerHTML = products.map((p, i) =>
    `<button class="dot ${i === current ? 'active' : ''}" data-slide="${i}" aria-label="Show ${escapeAttr(p.name)}"></button>`).join('');

  controlsRoot.querySelectorAll('.dot').forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restart(); }));
  restart();
}

function showSlide(index) {
  if (!products.length) return;
  current = (index + products.length) % products.length;
  productsRoot.querySelectorAll('.product').forEach((p, i) => p.classList.toggle('active', i === current));
  controlsRoot.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}
function restart() {
  clearInterval(timer);
  if (products.length > 1) timer = setInterval(() => showSlide(current + 1), 4200);
}
async function loadStore() {
  try { renderProducts(await fetchLiveProducts()); }
  catch (error) { console.info('Live Jinxxy feed unavailable; using local carousel items.', error); renderProducts(null); }
}
loadStore();
if (cfg.store.jinxxyProxyUrl) setInterval(loadStore, cfg.store.refreshMs || 120000);

// ---------- Visible Norse rune magic ----------
const particleRoot = document.querySelector('#rune-particles');
const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛋ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];
const particleCount = window.matchMedia('(max-width: 600px)').matches ? 14 : 26;
for (let i = 0; i < particleCount; i++) {
  const rune = document.createElement('span');
  rune.className = 'rune-particle';
  rune.textContent = runes[Math.floor(Math.random() * runes.length)];
  rune.style.left = `${4 + Math.random() * 92}%`;
  rune.style.top = `${4 + Math.random() * 92}%`;
  rune.style.fontSize = `${13 + Math.random() * 19}px`;
  rune.style.animationDelay = `${-Math.random() * 14}s`;
  rune.style.animationDuration = `${8 + Math.random() * 8}s`;
  rune.style.setProperty('--drift-x', `${-45 + Math.random() * 90}px`);
  rune.style.setProperty('--drift-y', `${-40 + Math.random() * 80}px`);
  particleRoot.appendChild(rune);
}

// ---------- Reliable ambient audio ----------
const ambientAudio = document.querySelector('#ambient-audio');
const ambientButton = document.querySelector('#ambient-toggle');
const ambientState = document.querySelector('#ambient-state');
const ambientHint = document.querySelector('#ambient-hint');
ambientAudio.volume = Math.max(0, Math.min(1, cfg.ambient.volume ?? 0.22));

ambientButton.addEventListener('click', async () => {
  try {
    if (ambientAudio.paused) {
      await ambientAudio.play();
      ambientButton.setAttribute('aria-pressed', 'true');
      ambientState.textContent = 'ON';
      ambientHint.textContent = 'Ambient atmosphere awakened';
    } else {
      ambientAudio.pause();
      ambientButton.setAttribute('aria-pressed', 'false');
      ambientState.textContent = 'OFF';
      ambientHint.textContent = 'Click to awaken the ambient atmosphere';
    }
  } catch (error) {
    ambientHint.textContent = 'Audio could not start — check the audio file path';
    console.warn('Ambient audio could not start:', error);
  }
});
