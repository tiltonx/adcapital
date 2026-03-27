import os
import django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "adcapitalcore.settings")
django.setup()

from django.test import Client
import traceback

def run():
    client = Client()
    try:
        response = client.post('/api/agenda/eventos/', {
            'titulo': 'teste dev',
            'data_inicio': '2026-03-30T10:00:00Z',
            'data_fim': '2026-03-30T12:00:00Z'
        }, content_type='application/json')
        
        print(f"Status: {response.status_code}")
        if response.status_code == 500:
            html = response.content.decode('utf-8')
            import re
            m1 = re.search(r'<title>(.*?)</title>', html, re.S)
            m2 = re.search(r'Exception Value:?.*?<pre>(.*?)</pre>', html, re.S)
            m_trace = re.search(r'<div id="traceback-area".*?>(.*?)</div>', html, re.S)
            
            print("TITLE:", m1.group(1).strip() if m1 else "N/A")
            print("VALUE:", m2.group(1).strip() if m2 else "N/A")
    except Exception as e:
        traceback.print_exc()

if __name__ == '__main__':
    run()
