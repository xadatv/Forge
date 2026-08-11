/* ================================================================
   XADA SITE ENGINE
   - animated Norse rune particles
   - live Jinxxy feed via your own safe proxy
   - carousel
   - procedural low-volume ambient audio
   ================================================================ */
const cfg = window.SITE_CONFIG;
const productsRoot = document.querySelector('#store-window');
const controlsRoot = document.querySelector('#store-controls');
let products = [];
let current = 0;
let timer;

// ----------------------------- Site config -----------------------------
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

const socialRoot = document.querySelector('#social-links');
socialRoot.innerHTML = cfg.socials.map(item => `
  <a class="${item.primary ? 'primary' : ''}" href="${escapeAttr(item.url)}" target="_blank" rel="noopener noreferrer">
    <span class="symbol">${escapeHtml(item.symbol)}</span>
    <span><strong>${escapeHtml(item.name)}</strong><small>${escapeHtml(item.subtitle)}</small></span>
    <b>↗</b>
  </a>`).join('');

function escapeHtml(value='') { const d=document.createElement('div'); d.textContent=value; return d.innerHTML; }
function escapeAttr(value='') { return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

// ----------------------------- Jinxxy -----------------------------
function normalizeProduct(p, index) {
  const image = p.image || p.image_url || p.thumbnail || p.cover_image?.url || p.cover?.url || p.media?.[0]?.url || '';
  const url = p.url || `${cfg.storeUrl}`;
  return {
    id: String(p.id ?? `product-${index}`),
    name: p.name || 'Unnamed creation',
    description: p.description || p.short_description || 'A creation from the XaDa store.',
    tag: p.tag || (p.base_price === 0 ? 'FREE ASSET' : 'CREATION'),
    url, image
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
  products = list.length ? list : cfg.products.map(normalizeProduct);
  current = Math.min(current, products.length - 1);
  productsRoot.innerHTML = products.map((p, i) => `
    <article class="product ${i === current ? 'active' : ''}" data-index="${i}">
      <div class="product-art ${p.image ? 'has-image' : ''}">
        ${p.image ? `<img src="${escapeAttr(p.image)}" alt="" loading="lazy" onerror="this.parentElement.classList.remove('has-image');this.remove()">` : `<span aria-hidden="true">${i % 2 ? 'ᛟ' : 'ᛏ'}</span>`}
      </div>
      <div class="product-copy">
        <span class="tag">${escapeHtml(p.tag)}</span>
        <h3>${escapeHtml(p.name)}</h3>
        <p>${escapeHtml(p.description)}</p>
        <a href="${escapeAttr(p.url)}" target="_blank" rel="noopener noreferrer">See on Jinxxy ↗</a>
      </div>
    </article>`).join('');
  controlsRoot.innerHTML = products.map((p, i) => `<button class="dot ${i === current ? 'active' : ''}" data-slide="${i}" aria-label="Show ${escapeAttr(p.name)}"></button>`).join('');
  [...controlsRoot.querySelectorAll('.dot')].forEach((dot, i) => dot.addEventListener('click', () => { showSlide(i); restart(); }));
  restart();
}

function showSlide(index) {
  if (!products.length) return;
  current = (index + products.length) % products.length;
  document.querySelectorAll('.product').forEach((p, i) => p.classList.toggle('active', i === current));
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
}
function restart() {
  clearInterval(timer);
  if (products.length > 1) timer = setInterval(() => showSlide(current + 1), 5200);
}

async function loadStore() {
  try {
    const live = await fetchLiveProducts();
    renderProducts(live?.length ? live : cfg.products.map(normalizeProduct));
  } catch (error) {
    console.info('Live Jinxxy feed unavailable; using configured fallback products.', error);
    renderProducts(cfg.products.map(normalizeProduct));
  }
}
loadStore();
if (cfg.jinxxyProxyUrl) setInterval(loadStore, cfg.refreshMs || 120000);

// ----------------------------- Rune particles -----------------------------
const canvas = document.querySelector('#rune-particles');
const ctx = canvas.getContext('2d');
const runes = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛋ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ'];
let particles = [];
function resizeCanvas(){ canvas.width=innerWidth*devicePixelRatio; canvas.height=innerHeight*devicePixelRatio; canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px'; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); }
function makeParticle(){ return {x:Math.random()*innerWidth,y:Math.random()*innerHeight, rune:runes[Math.floor(Math.random()*runes.length)], size:10+Math.random()*16, alpha:0, target:0.08+Math.random()*0.2, speed:0.002+Math.random()*0.006, phase:Math.random()*Math.PI*2, life:Math.random()*Math.PI*2}; }
function initParticles(){ particles=Array.from({length:42},makeParticle); }
function animateParticles(t){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  for(const p of particles){
    p.life += p.speed * 16;
    const pulse=(Math.sin(p.life)+1)/2;
    p.alpha = pulse < .16 ? 0 : p.target * Math.min(1,(pulse-.16)/.3) * (pulse>.72 ? (1-pulse)/.28 : 1);
    ctx.font=`${p.size}px Cinzel, serif`; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillStyle=`rgba(154,174,232,${p.alpha})`; ctx.shadowBlur=12; ctx.shadowColor='rgba(123,91,255,.22)'; ctx.fillText(p.rune,p.x,p.y); ctx.shadowBlur=0;
  }
  requestAnimationFrame(animateParticles);
}
addEventListener('resize',resizeCanvas); resizeCanvas(); initParticles(); requestAnimationFrame(animateParticles);

// ----------------------------- Ambient audio -----------------------------
let audioCtx, master, nodes = [], ambientOn = false;
const ambientButton = document.querySelector('#ambient-toggle');
function createAmbient(){
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  master = audioCtx.createGain(); master.gain.value = 0.035; master.connect(audioCtx.destination);
  const frequencies=[55,82.41,110];
  frequencies.forEach((freq,i)=>{
    const osc=audioCtx.createOscillator(), gain=audioCtx.createGain(), filter=audioCtx.createBiquadFilter();
    osc.type=i===0?'sine':'triangle'; osc.frequency.value=freq; filter.type='lowpass'; filter.frequency.value=260;
    gain.gain.value= i===0 ? .22 : .08; osc.connect(filter).connect(gain).connect(master); osc.start(); nodes.push(osc,gain,filter);
  });
}
async function toggleAmbient(){
  if(!audioCtx) createAmbient();
  if(audioCtx.state==='suspended') await audioCtx.resume();
  ambientOn=!ambientOn;
  master.gain.cancelScheduledValues(audioCtx.currentTime);
  master.gain.linearRampToValueAtTime(ambientOn?.035:0,audioCtx.currentTime+.8);
  ambientButton.setAttribute('aria-pressed', String(ambientOn));
  ambientButton.querySelector('span').textContent=ambientOn?'ON':'OFF';
}
ambientButton.addEventListener('click',toggleAmbient);
