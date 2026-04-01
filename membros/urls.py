# v1.1.3 - Rotas Administrativas Apenas
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MembroViewSet, 
    ConfiguracaoPortalViewSet,
    excluir_funcao,
    buscar_opcoes_funcao,
    buscar_opcoes_parentesco,
    buscar_configuracao_publica
)

from .view_public import (
    portal_verificar_resposta_direto,
    auto_cadastro_direto
)

# Router para a área administrativa
router = DefaultRouter()
router.register(r'membros', MembroViewSet)
router.register(r'configuracao-portal', ConfiguracaoPortalViewSet, basename='configuracao-portal')

urlpatterns = [
    # Rotas Públicas (Sem autenticação no prefixo /api/)
    path('v/', portal_verificar_resposta_direto, name='portal_v'),
    path('c/', auto_cadastro_direto, name='portal_c'),
    
    # Novas rotas para o Dashboard Admin (Caminhos curtíssimos sob /api/)
    path('opcoes-funcao/', buscar_opcoes_funcao, name='opcoes-funcao'),
    path('opcoes-parentesco/', buscar_opcoes_parentesco, name='opcoes-parentesco'),
    path('configuracao-portal/publica/', buscar_configuracao_publica, name='config-publica'),

    # Rotas Administrativas
    path('funcoes/<int:pk>/', excluir_funcao, name='excluir-funcao-admin'),
    path('', include(router.urls)),
]