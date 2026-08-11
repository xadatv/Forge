/* Everything visual and content-related is in site-config.js. Do not put a Jinxxy key in this file. */
const config = window.SITE_CONFIG || {};
const storeWindow = document.querySelector('#store-window');
const controls = document.querySelector('#store-controls');
const productCount = document.querySelector('#product-count');
let products = [];
let current = 0;
let timer;

function safeText(value) { return String(value || ''); }
function escapeHtml(value) { return safeText(value).replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character]); }
function setBranding() {
  document.querySelectorAll('[data-config="siteName"]').forEach((node) => node.textContent = config.siteName || 'XaDa');
  document.querySelectorAll('[data-config="tagline"]').forEach((node) => node.textContent = config.tagline || 'CREATE · EXPLORE · SHARE');
  document.querySelectorAll('.store-link').forEach((node) => node.href = config.jinxxy?.storeUrl || 'https://jinxxy.com/XaDa');
  const logo = document.querySelector('.site-logo');
  if (config.logoUrl) { logo.src = config.logoUrl; logo.hidden = false; }
}
function productTemplate(product, index) {
  const image = product.image ? `<img src="${escapeHtml(product.image)}" alt="" loading="${index ? 'lazy' : 'eager'}">` : '';
  return `<article class="product ${index === 0 ? 'active' : ''}">
    <div class="product-art ${image ? 'has-image' : ''}" aria-hidden="true">${image}<span>${escapeHtml(product.rune || 'ᛟ')}</span></div>
    <div class="product-copy"><span class="tag">${escapeHtml(product.label || 'JINXXY ASSET')}</span><h3>${escapeHtml(product.name)}</h3><p>${escapeHtml(product.description || 'A creation from the XaDa Jinxxy store.')}</p><a href="${escapeHtml(product.url || config.jinxxy?.storeUrl)}" target="_blank" rel="noopener noreferrer">See on Jinxxy ↗</a></div>
  </article>`;
}
function renderProducts(nextProducts) {
  products = nextProducts.length ? nextProducts : (config.fallbackProducts || []);
  current = 0;
  storeWindow.innerHTML = products.map(productTemplate).join('');
  controls.innerHTML = products.map((product, index) => `<button class="dot ${index === 0 ? 'active' : ''}" data-slide="${index}" aria-label="Show ${escapeHtml(product.name)}"></button>`).join('');
  productCount.hidden = !products.length;
  productCount.textContent = products.length ? `· ${products.length} ${products.length === 1 ? 'ITEM' : 'ITEMS'}` : '';
  controls.querySelectorAll('.dot').forEach((dot) => dot.addEventListener('click', () => { showSlide(Number(dot.dataset.slide)); restart(); }));
  restart();
}
function showSlide(index) {
  if (!products.length) return;
  current = (index + products.length) % products.length;
  storeWindow.querySelectorAll('.product').forEach((product, i) => product.classList.toggle('active', i === current));
  controls.querySelectorAll('.dot').forEach((dot, i) => dot.classList.toggle('active', i === current));
}
function restart() { clearInterval(timer); if (products.length > 1) timer = setInterval(() => showSlide(current + 1), config.carouselDelay || 5200); }
function toDisplayProduct(product) {
  const override = config.productOverrides?.[product.id] || {};
  return { ...product, ...override, name: override.name || product.name, url: override.url || product.url || config.jinxxy?.storeUrl };
}
async function refreshJinxxyProducts() {
  const endpoint = config.jinxxy?.apiEndpoint;
  if (!endpoint) return;
  try {
    const response = await fetch(endpoint, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    if (!response.ok) throw new Error(`Jinxxy feed returned ${response.status}`);
    const payload = await response.json();
    const liveProducts = (payload.results || payload.products || []).map(toDisplayProduct);
    if (liveProducts.length) renderProducts(liveProducts);
  } catch (error) { console.info('Jinxxy feed unavailable; using configured products.', error.message); }
}
function createRunes() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = document.querySelector('#rune-particles'); const ctx = canvas.getContext('2d'); const glyphs = 'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞᛟ';
  const runes = Array.from({ length: 28 }, () => ({ x: Math.random(), y: Math.random(), size: 11 + Math.random() * 17, phase: Math.random() * Math.PI * 2, speed: .25 + Math.random() * .55, glyph: glyphs[Math.floor(Math.random() * glyphs.length)] }));
  function resize() { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
  function draw(time) { ctx.clearRect(0,0,innerWidth,innerHeight); runes.forEach((r) => { const life = Math.max(0, Math.sin(time / 1000 * r.speed + r.phase)); ctx.globalAlpha = life * .33; ctx.fillStyle = '#a9c5ff'; ctx.font = `${r.size}px Cinzel`; ctx.fillText(r.glyph, r.x * innerWidth, r.y * innerHeight); }); requestAnimationFrame(draw); }
  addEventListener('resize', resize); resize(); requestAnimationFrame(draw);
}
function setupAudio() {
  const audio = document.querySelector('#ambient-audio'); const button = document.querySelector('.sound-toggle');
  if (!config.ambientAudioUrl) { button.hidden = true; return; }
  audio.src = config.ambientAudioUrl; audio.volume = Math.min(Math.max(Number(config.ambientVolume ?? .12), 0), 1);
  button.addEventListener('click', async () => { if (audio.paused) { await audio.play(); button.setAttribute('aria-pressed', 'true'); button.setAttribute('aria-label', 'Pause ambient music'); } else { audio.pause(); button.setAttribute('aria-pressed', 'false'); button.setAttribute('aria-label', 'Play ambient music'); } });
}
setBranding(); renderProducts(config.fallbackProducts || []); refreshJinxxyProducts(); if (config.jinxxy?.refreshMinutes) setInterval(refreshJinxxyProducts, config.jinxxy.refreshMinutes * 60000); createRunes(); setupAudio();
