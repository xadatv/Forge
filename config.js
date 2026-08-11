/* ================================================================
   XADA SITE CONFIG — EDIT THIS FILE ONLY
   You can change the logo, carousel images, text, links and colors
   without editing index.html, style.css or script.js.
   ================================================================ */
const SITE_CONFIG = {
  identity: {
    name: 'XaDa',
    tagline: 'CREATE · EXPLORE · SHARE',
    logo: '', // e.g. 'assets/logo.png'
    fallbackRune: 'ᛉ'
  },

  store: {
    url: 'https://jinxxy.com/XaDa',
    // Optional Cloudflare proxy. Only the NUMBER/CONTENTS of live products
    // are used for the carousel. Images remain controlled by this config.
    jinxxyProxyUrl: '',
    refreshMs: 120000,
    products: [
      {
        id: 'viking-axe',
        name: 'Viking Axe',
        description: 'A Norse-inspired prop for your virtual worlds.',
        tag: 'FREE ASSET',
        url: 'https://jinxxy.com/XaDa',
        image: '' // e.g. 'assets/products/viking-axe.jpg'
      },
      {
        id: 'viking-shield',
        name: 'Viking Shield',
        description: 'A Norse-inspired shield asset for VRChat projects.',
        tag: 'FREE ASSET',
        url: 'https://jinxxy.com/XaDa',
        image: '' // e.g. 'assets/products/viking-shield.jpg'
      }
    ]
  },

  // Keep every website/link you want visible here.
  // Add another object to create another button — no HTML editing needed.
  links: [
    { name: 'YouTube', subtitle: 'Videos & content', symbol: '▶', url: 'https://www.youtube.com/@xadatv' },
    { name: 'Twitch', subtitle: 'Live streams', symbol: '◈', url: 'https://www.twitch.tv/xadatv' },
    { name: 'X / Twitter', subtitle: 'Updates & thoughts', symbol: '𝕏', url: 'https://x.com/xadatv' },
    { name: 'Instagram', subtitle: 'Behind the scenes', symbol: '◎', url: 'https://www.instagram.com/xadatv' },
    { name: 'Jinxxy', subtitle: 'Assets & creations', symbol: '✦', url: 'https://jinxxy.com/XaDa', primary: true }
  ],

  footer: {
    quoteHtml: 'BETTER TO STAND ALONE<br>THAN TO FALL WITH THE CROWD'
  },

  ambient: {
    audioFile: 'assets/audio/ambient-drone.wav',
    volume: 0.22
  }
};
