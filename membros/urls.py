from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    MembroViewSet, 
    ConfiguracaoPortalViewSet,
    buscar_opcoes_funcao, 
    buscar_opcoes_parentesco, 
    excluir_funcao,
    buscar_configuracao_publica,
    verificar_resposta_portal,
    AutoCadastroMembroView
)

# Router para a área administrativa
router = DefaultRouter()
router.register(r'membros', MembroViewSet)
router.register(r'configuracao-portal', ConfiguracaoPortalViewSet, basename='configuracao-portal')

urlpatterns = [
    # Rotas Públicas (Usadas pelo Portal de Auto-Cadastro)
    # Colocamos estas primeiro para garantir que o Django as encontre antes do router
    path('portal-config/', buscar_configuracao_publica, name='portal-config-publica'),
    path('portal-verificar/', verificar_resposta_portal, name='portal-verificar-resposta'),
    path('auto-cadastro/', AutoCadastroMembroView.as_view(), name='membro-auto-cadastro'),
    path('opcoes-funcao/', buscar_opcoes_funcao, name='opcoes-funcao-publica'),
    path('opcoes-parentesco/', buscar_opcoes_parentesco, name='opcoes-parentesco-publica'),
    
    # Rotas Administrativas
    path('funcoes/<int:pk>/', excluir_funcao, name='excluir-funcao-admin'),
    path('', include(router.urls)),
]