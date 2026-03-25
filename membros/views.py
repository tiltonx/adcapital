from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Membro, Parentesco
from .serializers import MembroSerializer

@api_view(['GET'])
def buscar_opcoes_funcao(request):
    """Retorna a lista dinâmica de funções extraída do models"""
    opcoes = [{'id': f[0], 'nome': f[1]} for f in Membro.FUNCOES_CHOICES]
    return Response(opcoes)

@api_view(['GET'])
def buscar_opcoes_parentesco(request):
    """Retorna a lista dinâmica de graus de parentesco extraída do models"""
    opcoes = [{'id': f[0], 'nome': f[1]} for f in Parentesco.GRAU_CHOICES]
    return Response(opcoes)

class MembroViewSet(viewsets.ModelViewSet):
    """
    Esta classe cria automaticamente as rotas para:
    - Listar membros (GET)
    - Criar membro (POST)
    - Editar membro (PUT)
    - Excluir membro (DELETE)
    """
    queryset = Membro.objects.all()
    serializer_class = MembroSerializer