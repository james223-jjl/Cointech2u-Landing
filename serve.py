#!/usr/bin/env python3
"""Local preview server for the static export, with /api proxying.

The landing page fetches same-origin /api/announcements and /api/leaders
(implemented by the upstream Next.js server, absent in this static export).
This server maps them to the live backend so the page shows real data:

  /api/announcements -> https://app.cointech2u.com/api/v2/get-announcements
  /api/leaders?...   -> https://app.cointech2u.com/api/v2/leaders?...

Usage:  python3 serve.py [port]     (default 8666)
Note: production hosting needs the same rewrites for live data.
"""
import http.server, urllib.request, urllib.parse, sys

UPSTREAM = 'https://app.cointech2u.com/api/v2'
MAP = {'/api/announcements': '/get-announcements', '/api/leaders': '/leaders'}

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        p = urllib.parse.urlsplit(self.path)
        if p.path in MAP:
            url = UPSTREAM + MAP[p.path] + ('?' + p.query if p.query else '')
            try:
                req = urllib.request.Request(url, headers={
                    'User-Agent': 'Mozilla/5.0', 'Accept': 'application/json'})
                with urllib.request.urlopen(req, timeout=15) as r:
                    body = r.read()
                    ctype = r.headers.get('Content-Type', 'application/json')
                self.send_response(200)
                self.send_header('Content-Type', ctype)
                self.send_header('Content-Length', str(len(body)))
                self.send_header('Cache-Control', 'no-store')
                self.end_headers()
                self.wfile.write(body)
            except Exception as e:
                self.send_error(502, 'proxy error: %s' % e)
            return
        return super().do_GET()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8666
    print('serving on http://localhost:%d with /api proxy' % port)
    http.server.ThreadingHTTPServer(('', port), Handler).serve_forever()
