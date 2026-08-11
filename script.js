/* The page content is edited in site-config.js. No API key or proxy is used. */
const settings = window.SITE_CONFIG || {};
const $ = (selector) => document.querySelector(selector);
let carouselTimer;
let currentSlide = 0;

function isSafeUrl(value) { try { const url = new URL(value, window.location.href); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; } }
function setText(selector, value) { const element = $(selector); if (element && value) element.textContent = value; }
function makeLink({ icon = '✦', title, subtitle, url, primary }) {
  const link = document.createElement('a'); const safeUrl = isSafeUrl(url); if (!safeUrl) return null;
  link.href = safeUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; if (primary) link.classList.add('primary');
  const symbol = document.createElement('span'); symbol.className = 'symbol'; symbol.textContent = icon;
  const copy = document.createElement('span'); const heading = document.createElement('strong'); heading.textContent = title; const small = document.createElement('small'); small.textContent = subtitle; copy.append(heading, small);
  const arrow = document.createElement('b'); arrow.textContent = '↗'; link.append(symbol, copy, arrow); return link;
}
function renderLinks() {
  if (!Array.isArray(settings.links) || !settings.links.length) return;
  const list = $('#link-list'); list.replaceChildren(...settings.links.map(makeLink).filter(Boolean));
}
function makeProduct(product) {
  const article = document.createElement('article'); article.className = 'product';
  const art = document.createElement('div'); art.className = 'product-art';
  if (product.image && isSafeUrl(product.image)) { art.classList.add('has-image'); const image = document.createElement('img'); image.src = isSafeUrl(product.image); image.alt = ''; art.append(image); }
  const rune = document.createElement('span'); rune.textContent = product.rune || 'ᛟ'; art.append(rune);
  const copy = document.createElement('div'); copy.className = 'product-copy';
  const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = product.label || 'JINXXY ASSET';
  const heading = document.createElement('h3'); heading.textContent = product.name || 'New creation';
  const description = document.createElement('p'); description.textContent = product.description || '';
  const link = document.createElement('a'); link.href = isSafeUrl(product.url || settings.storeUrl) || 'https://jinxxy.com/'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = 'See on Jinxxy ↗';
  copy.append(tag, heading, description, link); article.append(art, copy); return article;
}
function showSlide(index) {
  const slides = [...document.querySelectorAll('.product')]; const dots = [...document.querySelectorAll('.dot')]; if (!slides.length) return;
  currentSlide = (index + slides.length) % slides.length; slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide)); dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
}
function startCarousel() { clearInterval(carouselTimer); const total = document.querySelectorAll('.product').length; if (total > 1) carouselTimer = setInterval(() => showSlide(currentSlide + 1), Number(settings.carouselDelay) || 5000); }
function renderProducts() {
  if (!Array.isArray(settings.products) || !settings.products.length) return;
  const windowElement = $('#store-window'); const controls = $('#store-controls'); currentSlide = 0; windowElement.replaceChildren(...settings.products.map(makeProduct));
  controls.replaceChildren(...settings.products.map((product, index) => { const dot = document.createElement('button'); dot.className = 'dot'; dot.type = 'button'; dot.setAttribute('aria-label', `Show ${product.name || 'product'}`); dot.addEventListener('click', () => { showSlide(index); startCarousel(); }); return dot; }));
  showSlide(0); startCarousel();
}
function applySettings() {
  const theme = settings.theme || {}; Object.entries({ '--top': theme.top, '--middle': theme.middle, '--bottom': theme.bottom, '--accent': theme.accent }).forEach(([name, value]) => { if (value) document.documentElement.style.setProperty(name, value); });
  setText('#site-name', settings.siteName); setText('#tagline', settings.tagline); setText('#store-label', settings.storeLabel); setText('#store-title', settings.storeTitle);
  const storeLink = $('#store-link'); if (storeLink && isSafeUrl(settings.storeUrl)) storeLink.href = isSafeUrl(settings.storeUrl);
  const logo = $('#brand-logo'); if (settings.logoUrl && isSafeUrl(settings.logoUrl)) { logo.src = isSafeUrl(settings.logoUrl); logo.alt = settings.siteName || 'Logo'; logo.hidden = false; }
}
function setupMusic() {
  const music = $('#ambient-music'); const button = $('#music-toggle'); if (!settings.musicUrl || !isSafeUrl(settings.musicUrl)) return;
  music.src = isSafeUrl(settings.musicUrl); music.volume = Math.min(Math.max(Number(settings.musicVolume ?? .12), 0), 1); button.hidden = false;
  button.addEventListener('click', async () => { if (music.paused) { try { await music.play(); button.setAttribute('aria-pressed', 'true'); button.lastChild.textContent = ' PAUSE'; } catch {} } else { music.pause(); button.setAttribute('aria-pressed', 'false'); button.lastChild.textContent = ' AMBIENCE'; } });
}
function animateRunes() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const canvas = $('#rune-canvas'); const context = canvas.getContext('2d'); const glyphs = [...'ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛋᛏᛒᛖᛗᛚᛜᛞᛟ'];
  const runes = Array.from({ length: 30 }, () => ({ x: Math.random(), y: Math.random(), rune: glyphs[Math.floor(Math.random() * glyphs.length)], size: 10 + Math.random() * 18, delay: Math.random() * 9000, duration: 5000 + Math.random() * 7000, cycle: -1 }));
  function resize() { const ratio = devicePixelRatio || 1; canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio; context.setTransform(ratio, 0, 0, ratio, 0, 0); }
  function draw(now) { context.clearRect(0, 0, innerWidth, innerHeight); runes.forEach((item) => { const cycle = Math.floor((now + item.delay) / item.duration); if (cycle !== item.cycle) { item.cycle = cycle; item.x = Math.random(); item.y = Math.random(); item.rune = glyphs[Math.floor(Math.random() * glyphs.length)]; } const phase = ((now + item.delay) % item.duration) / item.duration; const alpha = Math.sin(phase * Math.PI) ** 2 * .34; context.globalAlpha = alpha; context.fillStyle = '#b9ceff'; context.font = `${item.size}px Cinzel`; context.fillText(item.rune, item.x * innerWidth, item.y * innerHeight); }); requestAnimationFrame(draw); }
  addEventListener('resize', resize); resize(); requestAnimationFrame(draw);
}
applySettings(); renderLinks(); renderProducts(); setupMusic(); animateRunes();
