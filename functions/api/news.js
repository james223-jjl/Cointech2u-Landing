// Cloudflare Pages Function — proxy /api/news to the upstream CoinTech2u
// news API. Same pattern as /api/announcements and /api/leaders: the
// upstream restricts CORS so the landing page can't fetch from the browser
// directly. 5-minute edge cache to avoid hammering upstream.

const UPSTREAM = "https://app.cointech2u.com/api/v2/news";

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const upstream = new URL(UPSTREAM);
  upstream.search = url.search;

  let res;
  try {
    res = await fetch(upstream.toString(), {
      method: "GET",
      headers: { Accept: "application/json", Language: "en" },
      cf: { cacheTtl: 300, cacheEverything: true },
    });
  } catch {
    return jsonError(502, "upstream_fetch_failed");
  }

  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Accept, Content-Type, Authorization",
    },
  });
}

function jsonError(status, code) {
  return new Response(JSON.stringify({ ok: 0, code }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
