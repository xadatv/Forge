/*
  EDIT ONLY THIS FILE to change your branding, music and product images.
  Put image / music files in the same folder and use paths such as "assets/logo.png".
  Jinxxy product IDs used in productOverrides come from the Jinxxy API response.
*/
window.SITE_CONFIG = {
  siteName: 'XaDa',
  tagline: 'CREATE · EXPLORE · SHARE',
  logoUrl: '', // Example: 'assets/xada-logo.png'. Leave blank to use the text logo.
  ambientAudioUrl: '', // Example: 'assets/ambient.mp3'. Playback starts only when the visitor presses AMBIENCE.
  ambientVolume: 0.12,
  carouselDelay: 5200,
  jinxxy: {
    storeUrl: 'https://jinxxy.com/XaDa',
    apiEndpoint: '/api/jinxxy-products', // Set to '' until your private proxy is deployed.
    refreshMinutes: 5
  },
  fallbackProducts: [
    { name: 'Viking Axe', label: 'FREE ASSET', description: 'A Norse-inspired prop for your virtual worlds.', url: 'https://jinxxy.com/XaDa', rune: 'ᛏ', image: '' },
    { name: 'Viking Shield', label: 'FREE ASSET', description: 'A Norse-inspired shield asset for VRChat projects.', url: 'https://jinxxy.com/XaDa', rune: 'ᛟ', image: '' }
  ],
  productOverrides: {
    /*
    'YOUR_JINXXY_PRODUCT_ID': {
      image: 'assets/my-product.png',
      description: 'Your custom description.',
      label: 'NEW ASSET',
      rune: 'ᛉ'
    }
    */
  }
};
