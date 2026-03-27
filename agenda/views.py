from rest_framework import viewsets
from .models import Evento
from .serializers import EventoSerializer

class EventoViewSet(viewsets.ModelViewSet):
    """
    CRUD para Eventos.
    A criação e exclusão no banco sincronizará automaticamente 
    com o Google Calendar graças aos métodos save() e delete() do modelo.
    """
    queryset = Evento.objects.all().order_by('data_inicio')
    serializer_class = EventoSerializer
