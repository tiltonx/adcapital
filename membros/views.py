from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Membro, Parentesco
from .serializers import MembroSerializer

@api_view(['GET'])
def buscar_opcoes_funcao(request):
    """Retorna a lista dinâmica de funções da tabela Funcao"""
    from .models import Funcao
    try:
        funcoes = Funcao.objects.all().order_by('nome')
        opcoes = [{'id': f.nome, 'nome': f.nome} for f in funcoes]
        return Response(opcoes)
    except Exception:
        # Se a tabela não existir ainda ou der erro, retorna os básicos
        return Response([{'id': 'Membro', 'nome': 'Membro'}])

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

    def perform_create(self, serializer):
        self._salvar_com_parentescos(serializer)

    def perform_update(self, serializer):
        self._salvar_com_parentescos(serializer)

    def _salvar_com_parentescos(self, serializer):
        # O Serializer já resolve o SlugRelatedField (funcao) automaticamente.
        # Se a tabela Funcao não existir, o Try/Except no FuncaoSlugField retorna None.
        membro = serializer.save()
        parentescos_data = self.request.data.get('parentescos_novo', [])
        
        if self.action == 'update' or self.action == 'partial_update':
            Parentesco.objects.filter(membro_origem=membro).delete()

        for item in parentescos_data:
            p_id = item.get('parente_id') or item.get('membro_destino')
            grau = item.get('grau')

            if p_id and grau and str(p_id) != str(membro.id):
                Parentesco.objects.get_or_create(
                    membro_origem=membro,
                    membro_destino_id=p_id,
                    defaults={'grau': grau}
                )