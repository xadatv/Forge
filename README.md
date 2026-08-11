# XaDa Presence — customization

## Files
- `index.html` — structure only.
- `style.css` — visual design and colors.
- `script.js` — particles, carousel, live feed adapter and ambient audio.
- `config.js` — the main file to customize.

## Logo
Put your logo in the site folder, for example `assets/logo.png`, then set:

```js
logo: 'assets/logo.png'
```

If left empty, the Norse rune mark is shown.

## Colors
Edit the CSS variables at the top of `style.css`, especially `--bg-top`, `--bg-bottom`, `--violet`, and `--line`.

## Live Jinxxy carousel
Jinxxy's official Creator API requires an `x-api-key` and the `products_read` scope, so the secret key should **not** be placed in browser JavaScript. The page therefore supports a small server-side proxy.

Set this in `config.js`:

```js
jinxxyProxyUrl: '/api/jinxxy/products'
```

Your proxy should call the Jinxxy Creator API and return either:

```json
{ "results": [ ...products ] }
```

or simply:

```json
[ ...products ]
```

The front end accepts common image fields such as `image`, `image_url`, `thumbnail`, `cover_image.url`, or `media[0].url` when your proxy supplies them.

If the live endpoint is unavailable, the configured fallback products are displayed automatically.

## Ambient audio
The ambient sound is generated locally with Web Audio, so no MP3 is required. Browsers generally block audio from starting automatically; the `Ambient OFF` button is therefore used to start it intentionally.

## Jinxxy proxy included

The `jinxxy-proxy/` folder contains a ready-to-deploy Cloudflare Worker. See `jinxxy-proxy/README.md` for the exact setup commands.
