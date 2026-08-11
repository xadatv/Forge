# XaDa Jinxxy Proxy

A small Cloudflare Worker that keeps the Jinxxy Creator API key private and gives the public XaDa site a safe product feed.

## 1. Create a Jinxxy API key

Create a Creator API key in your Jinxxy dashboard with the `products_read` scope.

Do **not** put the key in `config.js`, `script.js`, HTML, or any public repository.

## 2. Install Wrangler

You need Node.js installed.

From this folder:

```bash
npm install
```

## 3. Add the secret

Run:

```bash
npx wrangler login
npx wrangler secret put JINXXY_API_KEY
```

When prompted, paste your Jinxxy API key. Cloudflare stores it as a Worker secret.

## 4. Deploy

```bash
npm run deploy
```

Cloudflare will give you a URL similar to:

```text
https://xada-jinxxy-proxy.<your-subdomain>.workers.dev
```

Your product feed is:

```text
https://xada-jinxxy-proxy.<your-subdomain>.workers.dev/products
```

## 5. Connect the XaDa site

Open the main site's `config.js` and set:

```js
jinxxyProxyUrl: 'https://xada-jinxxy-proxy.<your-subdomain>.workers.dev/products'
```

The site will refresh the feed automatically according to `refreshMs`.

## 6. Restrict CORS (recommended)

Once you know the exact public website URL, edit `wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGIN = "https://your-domain.example"
```

Then deploy again:

```bash
npm run deploy
```

If your site is at `https://www.example.com`, use that exact origin. Do not add a trailing slash.

## What the proxy does

- Calls Jinxxy's `/v1/products` endpoint.
- Uses the secret `x-api-key` header server-side.
- Requests full product details for each listed product so image/cover fields can be discovered when available.
- Returns a small normalized JSON object for the XaDa carousel.
- Supports the site's `GET /products` endpoint and `/api/jinxxy/products` alias.
- Handles browser CORS.
- Does not expose the Jinxxy API key to visitors.

## Local test

For local development, create `.dev.vars` in this folder:

```text
JINXXY_API_KEY=your_key_here
```

Then run:

```bash
npm run dev
```

Never commit `.dev.vars`.
