// Cloudflare Pages Function — proxy /api/announcements to the upstream
// CoinTech2u announcements API. The upstream restricts CORS to its own
// origin, so the landing page can't fetch it directly from the browser.
// This function lets the page hit a same-origin URL with a 5-minute edge
// cache so we don't hammer the upstream on every page load.

const UPSTREAM = "https://app.cointech2u.com/api/v2/get-announcements";

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
