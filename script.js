/* ================================================================
   XADA SITE ENGINE
   Config-driven carousel, optional live Jinxxy feed, rune particles
   and low-volume ambient audio.
   ================================================================ */
const cfg = window.SITE_CONFIG;
const productsRoot = document.querySelector('#store-window');
const controlsRoot = document.querySelector('#store-controls');
let products = [];
let current = 0;
let timer;

// ---------- Basic site content ----------
document.title = `${cfg.name} — Presence`;
document.querySelector('#site-name').textContent = cfg.name;
document.querySelector('#site-tagline').textContent = cfg.tagline;
document.querySelector('#store-link').href = cfg.storeUrl;
document.querySelector('#footer-quote').innerHTML = cfg.footerQuote;
document.querySelector('#footer-copy').textContent = `© ${new Date().getFullYear()} ${cfg.name}`;

if (cfg.logo) {
  const logo = document.querySelector('#site-logo');
  logo.src = cfg.logo;
  logo.hidden = false;
  document.querySelector('#logo-fallback').hidden = true;
}

// ---------- Social / website links ----------
const socialRoot = document.querySelector('#social-links');
socialRoot.innerHTML = cfg.socials.map(item => `
  <a class="${item.primary ? 'primary' : ''}" href="${escapeAttr(item.url)}" target="_blank" rel="noopener noreferrer">
    <span class="symbol">${escapeHtml(item.symbol)}</span>
    <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.subtitle)}</small></span>
    <b>↗</b>
  </a>`).join('');

function escapeHtml(value = '') {
  const d = document.createElement('div');
  d.textContent = value;
  return d.innerHTML;
}
function escapeAttr(value = '') {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

// ---------- Jinxxy ----------
function normalizeProduct(p, index) {
  const image = p.image || p.image_url || p.thumbnail || p.thumbnail_url ||
    p.cover_image?.url || p.cover?.url || p.media?.[0]?.url || '';
  return {
    id: String(p.id ?? `product-${index}`),
    name: p.name || 'Unnamed creation',
    description: p.description || p.short_description || 'A creation from the XaDa store.',
    tag: p.tag || (p.base_price === 0 ? 'FREE ASSET' : 'CREATION'),
    url: p.url || cfg.storeUrl,
    image
  };
}

async function fetchLiveProducts() {
  if (!cfg.jinxxyProxyUrl) return null;
  const response = await fetch(cfg.jinxxyProxyUrl, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Jinxxy feed returned ${response.status}`);
  const data = await response.json();
  const list = Array.isArray(data) ? data : (data.results || data.products || []);
  return list.map(normalizeProduct).filter(p => p.name);
}

function renderProducts(list) {
  const fallback = (cfg.products || []).map(normalizeProduct);
  products = list && list.length ? list : fallback;

  if (!products.length) {
    productsRoot.innerHTML = '<div class="store-empty">No creations configured yet.</div>';
    controlsRoot.innerHTML = '';
    return;
  }

  // Preserve the currently selected product when the live list refreshes.
  current = Math.max(0, Math.min(current, products.length - 1));

  // Same visual carousel structure as the original version, but generated
  // from however many products are currently in the config/live feed.
  productsRoot.innerHTML = products.map((p, i) => `
    <article class="product ${i === current ? 'active' : ''}">
      <div class="product-art ${p.image ? 'has-image' : ''}">
        ${p.image
          ? `<img src="${escapeAttr(p.image)}" alt="${escapeAttr(p.name)}" loading="lazy" onerror="this.parentElement.classList.remove('has-image');this.remove()">`
          : `<span aria-hidden="true">${i % 2 ? 'ᛟ' : 'ᛏ'}</span>`}
      </div>
      <div class="product-copy">
        <span class="tag">${escapeHtml(p.tag)}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <a href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer">See on Jinxxy ↗</a>
      </div>
    </article>`).join('');

  controlsRoot.innerHTML = products.map((p, i) =>
    `<button class="dot ${i === current ? 'active' : ''}" data-slide="${i}" aria-label="Show ${escapeAttr(p.name)}"></button>`
  ).join('');

  controlsRoot.querySelectorAll('.dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      showSlide(i);
      restart();
    });
  });

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
  if (products.length > 1) {
    timer = setInterval(() => showSlide(current + 1), 4200);
  }
}

async function loadStore() {
  try {
    const live = await fetchLiveProducts();
    renderProducts(live?.length ? live : null);
  } catch (error) {
    // Never let a proxy/API problem make the store disappear.
    console.info('Live Jinxxy feed unavailable; using configured products.', error);
    renderProducts(null);
  }
}

loadStore();
if (cfg.jinxxyProxyUrl) setInterval(loadStore, cfg.refreshMs || 120000);

// ---------- Animated Norse rune particles ----------
const particleRoot = document.querySelector('#rune-particles');
const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛋ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];
const particleCount = window.matchMedia('(max-width: 600px)').matches ? 18 : 32;

for (let i = 0; i < particleCount; i++) {
  const rune = document.createElement('span');
  rune.className = 'rune-particle';
  rune.textContent = runes[Math.floor(Math.random() * runes.length)];
  rune.style.left = `${Math.random() * 100}%`;
  rune.style.top = `${Math.random() * 100}%`;
  rune.style.fontSize = `${10 + Math.random() * 17}px`;
  rune.style.animationDelay = `${-Math.random() * 12}s`;
  rune.style.animationDuration = `${7 + Math.random() * 9}s`;
  rune.style.setProperty('--drift-x', `${-30 + Math.random() * 60}px`);
  rune.style.setProperty('--drift-y', `${-25 + Math.random() * 50}px`);
  particleRoot.appendChild(rune);
}

// ---------- Low-volume ambient audio ----------
let audioCtx, master, nodes = [], ambientOn = false;
const ambientButton = document.querySelector('#ambient-toggle');

function createAmbient() {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  master = audioCtx.createGain();
  master.gain.value = 0;
  master.connect(audioCtx.destination);

  // Very quiet layered drones. Nothing starts until the user presses Ambient.
  [55, 82.41, 110].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();
    osc.type = i === 0 ? 'sine' : 'triangle';
    osc.frequency.value = freq;
    filter.type = 'lowpass';
    filter.frequency.value = 260;
    gain.gain.value = i === 0 ? 0.22 : 0.08;
    osc.connect(filter).connect(gain).connect(master);
    osc.start();
    nodes.push(osc, gain, filter);
  });
}

async function toggleAmbient() {
  if (!audioCtx) createAmbient();
  if (audioCtx.state === 'suspended') await audioCtx.resume();
  ambientOn = !ambientOn;
  master.gain.cancelScheduledValues(audioCtx.currentTime);
  master.gain.linearRampToValueAtTime(ambientOn ? 0.035 : 0, audioCtx.currentTime + 0.8);
  ambientButton.setAttribute('aria-pressed', String(ambientOn));
  ambientButton.querySelector('span').textContent = ambientOn ? 'ON' : 'OFF';
}

ambientButton.addEventListener('click', toggleAmbient);
