# v1.1.3 - Rotas Administrativas Apenas
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MembroViewSet, 
    ConfiguracaoPortalViewSet,
    excluir_funcao
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

    # Rotas Administrativas
    path('funcoes/<int:pk>/', excluir_funcao, name='excluir-funcao-admin'),
    path('', include(router.urls)),
]