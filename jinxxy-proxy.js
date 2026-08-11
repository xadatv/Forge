/* Node 18+ example. Deploy this server-side and set JINXXY_API_KEY in your host's secrets.
   Never place the API key in site-config.js or any browser file. */
import { createServer } from 'node:http';

const port = process.env.PORT || 3000;
const server = createServer(async (request, response) => {
  if (request.url !== '/api/jinxxy-products') {
    response.writeHead(404); response.end(); return;
  }
  try {
    const apiResponse = await fetch('https://api.creators.jinxxy.com/v1/products?limit=100&sort_field=updated_at&sort_order=desc', {
      headers: { 'x-api-key': process.env.JINXXY_API_KEY, Accept: 'application/json' }
    });
    if (!apiResponse.ok) throw new Error(`Jinxxy returned ${apiResponse.status}`);
    const body = await apiResponse.text();
    response.writeHead(200, { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=120, s-maxage=120' });
    response.end(body);
  } catch {
    response.writeHead(502, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ error: 'Unable to load Jinxxy products.' }));
  }
});

server.listen(port, () => console.log(`Jinxxy proxy listening on ${port}`));
