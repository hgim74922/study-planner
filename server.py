import http.server
import socketserver
import webbrowser
import os
import sys

# Windows cp949 콘솔 인코딩 대응
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PORT = 8080

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # UTF-8 및 캐시 방지 헤더 추가
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # 포트 충돌 방지: 8080부터 사용 가능한 포트 탐색
    global PORT
    for p in range(8080, 8095):
        try:
            httpd = socketserver.TCPServer(("", p), CustomHandler)
            PORT = p
            break
        except OSError:
            continue
    else:
        print("[ERROR] 사용 가능한 포트를 찾지 못했습니다.")
        sys.exit(1)

    url = f"http://localhost:{PORT}"
    pres_url = f"http://localhost:{PORT}/presentation.html"
    print("=" * 60)
    print(f"EduCompass 맞춤형 학습 웹앱 서버가 시작되었습니다!")
    print(f"[메인 웹앱]       : {url}")
    print(f"[발표 슬라이드]   : {pres_url}")
    print(f"종료하려면 이 터미널에서 Ctrl + C 를 누르세요.")
    print("=" * 60)

    try:
        webbrowser.open(url)
    except Exception:
        pass

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 종료합니다.")
        httpd.server_close()

if __name__ == "__main__":
    run_server()
