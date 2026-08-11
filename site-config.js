/*
  THIS IS THE ONLY FILE YOU NEED TO EDIT.
  Upload your logo, music and product pictures to your GitHub repository, then use paths such as "assets/logo.png" below.
  This page is fully static: no proxy, API key or backend is needed.
*/
window.SITE_CONFIG = {
  siteName: 'XaDa',
  tagline: 'FORGE · EXPLORE · SHARE',
  logoUrl: 'assets/XaDa_logo_t.png', // Example: 'assets/xada-logo.png'. Leave blank to use the XaDa text.
  theme: {
    top: '#0b1d40',
    middle: '#17102f',
    bottom: '#120511',
    accent: '#b9c8ff'
  },
  musicUrl: 'assets/assets_audio_ambient-drone.wav', // Example: 'assets/ambient.mp3'. Visitors must press the AMBIENCE button to start it.
  musicVolume: 0.12,
  storeLabel: 'JINXXY STORE',
  storeTitle: 'Featured Creations',
  storeUrl: 'https://jinxxy.com/XaDa',
  carouselDelay: 10000,
  products: [
    { name: 'Viking Axe', label: 'FREE ASSET', description: 'A Norse-inspired Viking Axe!', url: 'https://jinxxy.com/XaDa/Viking_Axe', image: 'assets/Viking-Axe.png', rune: 'ᛏ' },
    { name: 'Viking Shield', label: 'FREE ASSET', description: 'A Norse-inspired Viking Shield!', url: 'https://jinxxy.com/XaDa/Viking_Shield', image: 'assets/Viking_Shield.png', rune: 'ᛟ' }
  ],
  links: [
    { title: 'YouTube', subtitle: 'Videos & content', icon: '▶', url: 'https://www.youtube.com/@xadatv' },
    { title: 'Twitch', subtitle: 'Live streams', icon: '◈', url: 'https://www.twitch.tv/xadatv' },
    { title: 'X / Twitter', subtitle: 'Updates & thoughts', icon: '𝕏', url: 'https://x.com/xadatv' },
    { title: 'Instagram', subtitle: 'Behind the scenes & World exploring', icon: '◎', url: 'https://www.instagram.com/xadatv' },
    { title: 'Jinxxy', subtitle: 'Assets & creations', icon: '✦', url: 'https://jinxxy.com/XaDa', primary: true },
    { title: 'Discord', subtitle: 'Join the Campfire', icon: '✦', url: 'tba',}
  ]
};
