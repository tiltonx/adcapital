# v1.1.2 - Correção do Seletor Dinâmico
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MembroViewSet, buscar_opcoes_funcao, buscar_opcoes_parentesco, excluir_funcao

router = DefaultRouter()
router.register(r'membros', MembroViewSet)

urlpatterns = [
    path('opcoes-funcao/', buscar_opcoes_funcao, name='opcoes-funcao'),
    path('funcoes/<int:pk>/', excluir_funcao, name='excluir-funcao'),
    path('opcoes-parentesco/', buscar_opcoes_parentesco, name='opcoes-parentesco'),
    path('', include(router.urls)),
]