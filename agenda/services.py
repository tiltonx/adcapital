import os
import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build
from django.conf import settings

SCOPES = ['https://www.googleapis.com/auth/calendar']
# Pega o caminho absoluto da raiz do projeto para achar o json de forma segura
SERVICE_ACCOUNT_FILE = os.path.join(settings.BASE_DIR, 'google_credentials.json')
CALENDAR_ID = 'igrejaadcapital@gmail.com'

def get_calendar_service():
    if not os.path.exists(SERVICE_ACCOUNT_FILE):
        return None
    
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    return build('calendar', 'v3', credentials=creds)

def sync_event_to_google(titulo, descricao, data_inicio, data_fim):
    """
    Cria ou atualiza um evento no Google Calendar e retorna o ID gerado pelo Google.
    """
    service = get_calendar_service()
    if not service:
        return None

    evento_body = {
        'summary': titulo,
        'description': descricao,
        'start': {
            'dateTime': data_inicio.isoformat(),
            'timeZone': 'America/Sao_Paulo',
        },
        'end': {
            'dateTime': data_fim.isoformat(),
            'timeZone': 'America/Sao_Paulo',
        },
    }

    try:
        evento_criado = service.events().insert(calendarId=CALENDAR_ID, body=evento_body).execute()
        return evento_criado.get('id')
    except Exception as e:
        print("Erro ao sincronizar com Google Calendar:", e)
        return None

def delete_event_from_google(google_event_id):
    """
    Deleta um evento no Google Calendar caso ele exista.
    """
    if not google_event_id:
        return

    service = get_calendar_service()
    if not service:
        return

    try:
        service.events().delete(calendarId=CALENDAR_ID, eventId=google_event_id).execute()
    except Exception as e:
        print(f"Erro ao deletar evento {google_event_id} no Google Calendar:", e)
