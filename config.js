/* ================================================================
   XADA SITE CONFIG
   Change the values in this file to customize the site.
   You normally do NOT need to edit index.html, style.css or script.js.
   ================================================================ */
const SITE_CONFIG = {
  // ---------- Identity ----------
  name: 'XaDa',
  tagline: 'CREATE · EXPLORE · SHARE',
  logo: '', // Example: 'assets/logo.png'

  // ---------- Store ----------
  storeUrl: 'https://jinxxy.com/XaDa',

  // Leave empty to use the products listed below.
  // When your Cloudflare proxy is ready, paste its /products URL here.
  // Example: 'https://your-worker.workers.dev/products'
  jinxxyProxyUrl: '',
  refreshMs: 120000,

  // These are your fallback/manual carousel items.
  // Add, remove or reorder objects freely. The carousel automatically
  // creates the correct number of slides and navigation dots.
  // To change an image, simply change the image path/URL.
  products: [
    {
      id: 'viking-axe',
      name: 'Viking Axe',
      description: 'A Norse-inspired prop for your virtual worlds.',
      tag: 'FREE ASSET',
      url: 'https://jinxxy.com/XaDa',
      image: '' // Example: 'assets/products/viking-axe.jpg'
    },
    {
      id: 'viking-shield',
      name: 'Viking Shield',
      description: 'A Norse-inspired shield asset for VRChat projects.',
      tag: 'FREE ASSET',
      url: 'https://jinxxy.com/XaDa',
      image: '' // Example: 'assets/products/viking-shield.jpg'
    }
  ],

  // ---------- Social / website links ----------
  // Add or remove links here. They will automatically appear on the page.
  socials: [
    { name: 'YouTube', subtitle: 'Videos & content', symbol: '▶', url: 'https://www.youtube.com/@xadatv' },
    { name: 'Twitch', subtitle: 'Live streams', symbol: '◈', url: 'https://www.twitch.tv/xadatv' },
    { name: 'X / Twitter', subtitle: 'Updates & thoughts', symbol: '𝕏', url: 'https://x.com/xadatv' },
    { name: 'Instagram', subtitle: 'Behind the scenes', symbol: '◎', url: 'https://www.instagram.com/xadatv' },
    { name: 'Jinxxy', subtitle: 'Assets & creations', symbol: '✦', url: 'https://jinxxy.com/XaDa', primary: true }
  ],

  // ---------- Footer ----------
  footerQuote: 'BETTER TO STAND ALONE<br>THAN TO FALL WITH THE CROWD'
};
