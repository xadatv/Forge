# XaDa Presence — Customizable Norse Edition

## Edit one file: `config.js`

You can change the logo, name, tagline, carousel images, links, Jinxxy proxy URL, refresh interval and ambient volume without editing the HTML/CSS/JS.

### Logo
Put your logo in `assets/`, for example:

`assets/logo.png`

Then set:

`logo: 'assets/logo.png'`

### Carousel images
Each local product has an `image` field. Example:

`image: 'assets/products/my-product.jpg'`

The carousel keeps the original two-column visual style. If your Jinxxy proxy is enabled, the **live product list controls how many carousel items exist**, but the images remain controlled by `config.js`.

This means adding a product to Jinxxy can change the number of slides without unexpectedly replacing your chosen artwork.

### Links
All website buttons are in `config.js` under `links`. Add/remove/reorder objects there.

### Ambient music
The included `assets/audio/ambient-drone.wav` is a small looping ambient track. Browsers block automatic audio on many pages, so the site uses the Norse Ambient button to start it after the visitor interacts with the page.

### Jinxxy proxy
Paste your secure proxy's `/products` URL into `store.jinxxyProxyUrl`. The API key stays on the proxy and never belongs in this website.
