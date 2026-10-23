"""
Простой сервер, который ведёт себя как telecom.kz со слэшем на конце.

telecom.kz отвечает на /perfluence/ переадресацией 301 на /perfluence (без
слэша) и отдаёт страницу по адресу без слэша. Обычный http.server делает
наоборот, поэтому на нём эту ветку index.html не проверить.

    python scripts/serve-noslash.py <папка> [порт]

Папка — та, где лежит dist/ под нужным подкаталогом, например
<папка>/perfluence/index.html. Порт по умолчанию 4200 (он есть в списке
Qbox, форма встраивается окном).
"""
import http.server
import os
import sys

ROOT = os.path.abspath(sys.argv[1])
PORT = int(sys.argv[2]) if len(sys.argv) > 2 else 4200


class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=ROOT, **kwargs)

    def do_GET(self):
        path, _, query = self.path.partition("?")
        local = os.path.join(ROOT, path.lstrip("/"))
        # /perfluence/ → 301 /perfluence, как на telecom.kz
        if path != "/" and path.endswith("/"):
            self.send_response(301)
            self.send_header("Location", path.rstrip("/") + (f"?{query}" if query else ""))
            self.end_headers()
            return
        # /perfluence (папка) → отдать её index.html без переадресации
        if os.path.isdir(local):
            self.path = path + "/index.html" + (f"?{query}" if query else "")
        return super().do_GET()


if __name__ == "__main__":
    http.server.ThreadingHTTPServer(("", PORT), Handler).serve_forever()
