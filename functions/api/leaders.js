// Cloudflare Pages Function — proxy /api/leaders to the upstream CoinTech2u
// API. The upstream sends no Access-Control-Allow-Origin header, so the
// landing page can't fetch it directly from the browser. This function lets
// the page hit a same-origin URL and refresh leaderboard data live.

const UPSTREAM = "https://app.cointech2u.com/api/v2/leaders";

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const upstream = new URL(UPSTREAM);
  upstream.search = url.search;

  let res;
  try {
    res = await fetch(upstream.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cf: { cacheTtl: 60, cacheEverything: true },
    });
  } catch {
    return jsonError(502, "upstream_fetch_failed");
  }

  const body = await res.text();
  return new Response(body, {
    status: res.status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=60, s-maxage=60",
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
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}

function jsonError(status, code) {
  return new Response(JSON.stringify({ ok: 0, error: code }), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
