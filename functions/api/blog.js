// Cloudflare Pages Function — proxy /api/blog to the cointech2u.com WordPress
// REST API so the landing page can pull live blog posts without CORS/UA
// blocking. WordPress REST returns 406 for unrecognized User-Agents, so we
// forward a desktop Safari UA. Cached at the edge for 5 minutes so we don't
// hammer the upstream on every page load.

const UPSTREAM =
  "https://www.cointech2u.com/wp-json/wp/v2/posts?per_page=6&_embed=wp:featuredmedia";

export async function onRequestGet() {
  let res;
  try {
    res = await fetch(UPSTREAM, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
      },
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
      "Access-Control-Allow-Headers": "Accept, Content-Type",
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
