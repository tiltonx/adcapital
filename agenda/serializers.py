from rest_framework import serializers
from .models import Evento, ProgramacaoSemanal

class EventoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evento
        fields = '__all__'
        read_only_fields = ['google_event_id']

class ProgramacaoSemanalSerializer(serializers.ModelSerializer):
    # Campo calculado para mostrar o nome do dia (Ex: Domingo)
    dia_nome = serializers.CharField(source='get_dia_semana_display', read_only=True)
    
    class Meta:
        model = ProgramacaoSemanal
        fields = ['id', 'dia_semana', 'dia_nome', 'titulo', 'horario', 'ordem']
