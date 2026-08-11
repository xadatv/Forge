/* ================================================================
   XADA SITE CONFIG
   Edit this file to customize the page without touching the layout.
   ================================================================ */
const SITE_CONFIG = {
  name: 'XaDa',
  tagline: 'CREATE · EXPLORE · SHARE',
  logo: '', // Example: 'assets/logo.png'
  storeUrl: 'https://jinxxy.com/XaDa',
  footerQuote: 'BETTER TO STAND ALONE<br>THAN TO FALL WITH THE CROWD',

  // Live Jinxxy requires a tiny server-side proxy because the Jinxxy
  // Creator API uses a secret x-api-key. Put your proxy URL here.
  // The proxy should return JSON: { results: [...] } or an array of products.
  // Example: '/api/jinxxy/products'
  jinxxyProxyUrl: 'https://YOUR-WORKER.workers.dev/products',
  refreshMs: 120000,

  // Fallback products shown when the live feed is not configured/available.
  // Replace these with your own products if desired.
  products: [
    {
      id: 'viking-axe',
      name: 'Viking Axe',
      description: 'A Norse-inspired prop for your virtual worlds.',
      tag: 'FREE ASSET',
      url: 'https://jinxxy.com/XaDa',
      image: ''
    },
    {
      id: 'viking-shield',
      name: 'Viking Shield',
      description: 'A Norse-inspired shield asset for VRChat projects.',
      tag: 'FREE ASSET',
      url: 'https://jinxxy.com/XaDa',
      image: ''
    }
  ],

  socials: [
    { name: 'YouTube', subtitle: 'Videos & content', symbol: '▶', url: 'https://www.youtube.com/@xadatv' },
    { name: 'Twitch', subtitle: 'Live streams', symbol: '◈', url: 'https://www.twitch.tv/xadatv' },
    { name: 'X / Twitter', subtitle: 'Updates & thoughts', symbol: '𝕏', url: 'https://x.com/xadatv' },
    { name: 'Instagram', subtitle: 'Behind the scenes', symbol: '◎', url: 'https://www.instagram.com/xadatv' },
    { name: 'Jinxxy', subtitle: 'Assets & creations', symbol: '✦', url: 'https://jinxxy.com/XaDa', primary: true }
  ]
};
