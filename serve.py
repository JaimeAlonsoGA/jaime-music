#!/usr/bin/env python3
"""Static server with a fallback so /spirithz, /jaime2000 and /quarteteuc resolve."""

import os
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.request import Request, urlopen

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)


class Handler(SimpleHTTPRequestHandler):
    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path == "/jaime-2000":
            self.send_response(301)
            self.send_header("Location", "/jaime2000")
            self.end_headers()
            return
        if path.startswith("/deezer/"):
            upstream = "https://api.deezer.com/" + path[len("/deezer/") :]
            if "?" in self.path:
                upstream += "?" + self.path.split("?", 1)[1]
            try:
                with urlopen(Request(upstream, headers={"User-Agent": "jaimealonso"}), timeout=20) as response:
                    body = response.read()
                    self.send_response(200)
                    self.send_header("Content-Type", "application/json")
                    self.send_header("Content-Length", str(len(body)))
                    self.end_headers()
                    self.wfile.write(body)
            except Exception:
                self.send_error(502)
            return
        local = os.path.join(ROOT, path.lstrip("/"))
        if path != "/" and not os.path.exists(local):
            self.path = "/index.html"
        return super().do_GET()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "4173"))
    ThreadingHTTPServer(("127.0.0.1", port), Handler).serve_forever()
