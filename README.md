# XaDa Presence

A config-driven Norse-themed personal landing page.

## Easy customization

Edit **config.js**. You can change:

- `name` and `tagline`
- `logo`
- Jinxxy store URL
- carousel products
- product images
- product descriptions/tags/links
- social and website links
- footer quote
- optional live Jinxxy proxy URL

### Logo
Put your image in an assets folder, for example:

```text
assets/logo.png
```

Then set:

```js
logo: 'assets/logo.png'
```

### Carousel images
Each product has an `image` property:

```js
{
  name: 'My Product',
  description: 'My description',
  tag: 'NEW',
  url: 'https://jinxxy.com/...',
  image: 'assets/products/my-product.jpg'
}
```

Add or remove product objects. The carousel automatically creates the matching number of slides and dots.

### Live Jinxxy
The page can optionally read products from your secure Jinxxy proxy. Set:

```js
jinxxyProxyUrl: 'https://YOUR-WORKER.workers.dev/products'
```

The page refreshes the live list every `refreshMs` milliseconds. If the proxy is unavailable, the configured products are used instead so the store never disappears.

Do not put a Jinxxy API key in this website.

## Norse visuals
The background contains animated rune particles that manifest, glow, drift and disappear. The page frame uses angular rune corners and Elder Futhark markings.
