import os
import django
import datetime

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "adcapitalcore.settings")
django.setup()

from django.test import Client

def run_test():
    client = Client(SERVER_NAME='localhost')
    print("Iniciando teste da API de Agenda...")
    
    agora = datetime.datetime.now(datetime.timezone.utc)
    inicio = agora + datetime.timedelta(days=3)
    fim = inicio + datetime.timedelta(hours=2)
    
    evento_data = {
        'titulo': '🚀 Teste End-to-End via API DRF',
        'descricao': 'Este evento foi criado fazendo uma requisição POST na nossa nova API!',
        'data_inicio': inicio.isoformat(),
        'data_fim': fim.isoformat()
    }
    
    # 1. Teste de Criação (POST)
    print("Realizando POST em /api/agenda/eventos/...")
    response = client.post('/api/agenda/eventos/', evento_data, content_type='application/json', HTTP_ACCEPT='application/json')
    
    print(f"Status Code: {response.status_code}")
    if response.status_code == 201:
        dados = response.json()
        print(f"Evento criado! ID Local: {dados.get('id')} | Google ID: {dados.get('google_event_id')}")
        
        # 2. Teste de Exclusão (DELETE)
        evento_id = dados.get('id')
        print(f"\nRealizando DELETE em /api/agenda/eventos/{evento_id}/...")
        del_response = client.delete(f'/api/agenda/eventos/{evento_id}/')
        print(f"Delete Status Code: {del_response.status_code}")
        if del_response.status_code == 204:
            print("Evento removido com sucesso localmente e do Google Calendar!")
        else:
            print("Falha ao deletar:", del_response.content)
    else:
        print("Erro na criação:", response.content)

if __name__ == '__main__':
    run_test()
