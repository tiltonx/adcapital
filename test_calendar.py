import os
import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build

SCOPES = ['https://www.googleapis.com/auth/calendar']
SERVICE_ACCOUNT_FILE = 'google_credentials.json'
CALENDAR_ID = 'igrejaadcapital@gmail.com'

def main():
    print("Iniciando autenticação com a Service Account do Google Cloud...")
    try:
        creds = service_account.Credentials.from_service_account_file(
            SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        service = build('calendar', 'v3', credentials=creds)
    except Exception as e:
        print("Erro crítico na autenticação (as chaves estão corretas?). Erro:", e)
        return

    # Pega o horário atual e joga pra amanhã às 10h da manhã (Horário de Brasília)
    agora = datetime.datetime.now(datetime.timezone.utc)
    inicio = agora + datetime.timedelta(days=1)
    
    # Define início da reunião. O UTC 13h é 10h em Brasília.
    hora_inicio = inicio.replace(hour=13, minute=0, second=0, microsecond=0)
    hora_fim = hora_inicio + datetime.timedelta(hours=2)

    evento = {
        'summary': '🚀 Culto de Teste Automatizado (AdCapital)',
        'location': 'Igreja AD Capital',
        'description': 'Este evento foi gerado 100% pelo código Python do nosso servidor para validar o compartilhamento do Google Calendar!',
        'start': {
            'dateTime': hora_inicio.isoformat(),
            'timeZone': 'America/Sao_Paulo',
        },
        'end': {
            'dateTime': hora_fim.isoformat(),
            'timeZone': 'America/Sao_Paulo',
        },
    }

    print(f"Tentando inserir o culto teste na agenda matriz: {CALENDAR_ID}...")
    try:
        evento_criado = service.events().insert(calendarId=CALENDAR_ID, body=evento).execute()
        print("\nSUCESSO ABSOLUTO! 🎉")
        print(f"O evento já existe na sua agenda! Link: {evento_criado.get('htmlLink')}")
    except Exception as e:
        print("\nERRO ao criar evento. O e-mail correto da Igreja deu permissão ao robô nas configurações do Calendar?")
        print("Detalhes do Erro do Google:", e)

if __name__ == '__main__':
    main()
