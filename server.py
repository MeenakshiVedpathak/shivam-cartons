import http.server, socketserver

class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Serve extensionless paths by appending .html
        path = self.path.split('?')[0].split('#')[0]
        if '.' not in path.split('/')[-1] and path != '/':
            import os
            candidate = path.lstrip('/') + '.html'
            if os.path.isfile(candidate):
                self.path = '/' + candidate + self.path[len(path):]
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, format, *args):
        pass  # suppress request logs

with socketserver.TCPServer(('', 3000), NoCacheHandler) as httpd:
    print('Serving at http://localhost:3000')
    httpd.serve_forever()
