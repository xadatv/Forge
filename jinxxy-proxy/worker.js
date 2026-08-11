/**
 * XaDa Jinxxy Product Proxy — Cloudflare Worker
 *
 * Keeps the Jinxxy API key server-side and exposes only the product data
 * needed by the public XaDa website.
 *
 * Public endpoint:
 *   GET /products
 *
 * Optional query parameters passed through to Jinxxy:
 *   ?page=1&limit=50&search_query=foo&sort_field=updated_at&sort_order=desc
 */

const JINXXY_API = 'https://api.creators.jinxxy.com/v1';

const DEFAULT_ALLOWED_ORIGIN = '*';

function corsHeaders(origin, env) {
  const configured = env.ALLOWED_ORIGIN || DEFAULT_ALLOWED_ORIGIN;
  const allowOrigin = configured === '*' || configured === origin ? configured : 'null';

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(data, status = 200, origin, env) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': status === 200 ? 'public, max-age=60, s-maxage=120' : 'no-store',
      ...corsHeaders(origin, env),
    },
  });
}

function cleanText(value) {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function looksLikeImageUrl(value) {
  if (typeof value !== 'string' || !/^https?:\/\//i.test(value)) return false;
  return /\.(?:png|jpe?g|webp|gif|avif)(?:[?#].*)?$/i.test(value)
    || /(?:image|img|thumbnail|thumb|cover|preview|media|cdn|assets?)/i.test(value);
}

function findImageUrl(value, depth = 0) {
  if (depth > 5 || value == null) return '';

  if (typeof value === 'string') {
    return looksLikeImageUrl(value) ? value : '';
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findImageUrl(item, depth + 1);
      if (found) return found;
    }
    return '';
  }

  if (typeof value === 'object') {
    const preferredKeys = [
      'image', 'image_url', 'thumbnail', 'thumbnail_url', 'cover', 'cover_image',
      'preview', 'preview_image', 'preview_url', 'icon', 'icon_url', 'media',
    ];

    for (const key of preferredKeys) {
      if (key in value) {
        const found = findImageUrl(value[key], depth + 1);
        if (found) return found;
      }
    }

    for (const [key, child] of Object.entries(value)) {
      if (/image|thumb|cover|preview|media|icon/i.test(key)) {
        const found = findImageUrl(child, depth + 1);
        if (found) return found;
      }
    }
  }

  return '';
}

function normalizeProduct(product, detail) {
  const p = { ...(product || {}), ...(detail || {}) };
  const image = findImageUrl(detail) || findImageUrl(product) || '';

  return {
    id: String(p.id ?? ''),
    name: cleanText(p.name) || 'Unnamed creation',
    description: cleanText(p.description || p.short_description || '') || 'A creation from the XaDa store.',
    tag: Number(p.base_price) === 0 ? 'FREE ASSET' : 'CREATION',
    url: p.url || '',
    image,
    base_price: p.base_price ?? null,
    currency_code: p.currency_code || '',
    category: p.category || '',
    platforms: Array.isArray(p.platforms) ? p.platforms : [],
    tags: Array.isArray(p.tags) ? p.tags : [],
    visibility: p.visibility || '',
    updated_at: p.updated_at || null,
  };
}

async function jinxxyFetch(path, apiKey) {
  return fetch(`${JINXXY_API}${path}`, {
    headers: {
      'x-api-key': apiKey,
      'Accept': 'application/json',
    },
  });
}

async function handleProducts(request, env) {
  if (!env.JINXXY_API_KEY) {
    return json({ error: 'JINXXY_API_KEY is not configured on the Worker.' }, 500, request.headers.get('Origin'), env);
  }

  const incoming = new URL(request.url);
  const params = new URLSearchParams();

  for (const key of ['page', 'limit', 'search_query', 'sort_field', 'sort_order']) {
    const value = incoming.searchParams.get(key);
    if (value) params.set(key, value);
  }

  if (!params.has('limit')) params.set('limit', '50');
  if (!params.has('sort_field')) params.set('sort_field', 'updated_at');
  if (!params.has('sort_order')) params.set('sort_order', 'desc');

  const listResponse = await jinxxyFetch(`/products?${params.toString()}`, env.JINXXY_API_KEY);
  const requestId = listResponse.headers.get('X-Request-ID');

  if (!listResponse.ok) {
    const body = await listResponse.text();
    return json({
      error: 'Jinxxy product request failed.',
      status: listResponse.status,
      request_id: requestId,
      detail: body.slice(0, 1000),
    }, listResponse.status, request.headers.get('Origin'), env);
  }

  const listData = await listResponse.json();
  const results = Array.isArray(listData) ? listData : (listData.results || []);

  // The list endpoint is intentionally small. Fetch full product details so
  // image/cover fields are available when Jinxxy exposes them there.
  const detailed = await Promise.all(results.map(async (product) => {
    if (!product?.id) return normalizeProduct(product, null);

    try {
      const detailResponse = await jinxxyFetch(`/products/${encodeURIComponent(product.id)}`, env.JINXXY_API_KEY);
      if (!detailResponse.ok) return normalizeProduct(product, null);
      const detail = await detailResponse.json();
      return normalizeProduct(product, detail);
    } catch {
      return normalizeProduct(product, null);
    }
  }));

  return json({
    page: listData.page ?? 1,
    page_count: listData.page_count ?? 1,
    cursor_count: listData.cursor_count ?? detailed.length,
    results: detailed,
  }, 200, request.headers.get('Origin'), env);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin');

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
    }

    if (request.method !== 'GET') {
      return json({ error: 'Method not allowed.' }, 405, origin, env);
    }

    if (url.pathname === '/products' || url.pathname === '/api/jinxxy/products') {
      try {
        return await handleProducts(request, env);
      } catch (error) {
        return json({
          error: 'Unexpected proxy error.',
          detail: error instanceof Error ? error.message : String(error),
        }, 500, origin, env);
      }
    }

    if (url.pathname === '/' || url.pathname === '/health') {
      return json({ ok: true, service: 'XaDa Jinxxy proxy' }, 200, origin, env);
    }

    return json({ error: 'Not found.' }, 404, origin, env);
  },
};
