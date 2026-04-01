from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EventoViewSet, StatusSincronizacaoView, SyncGoogleEventsView, ProgramacaoSemanalViewSet

router = DefaultRouter()
router.register(r'eventos', EventoViewSet, basename='evento')
router.register(r'programacao-semanal', ProgramacaoSemanalViewSet, basename='programacaosemanal')

urlpatterns = [
    path('status/', StatusSincronizacaoView.as_view(), name='status-sincronizacao'),
    path('sync/', SyncGoogleEventsView.as_view(), name='sync-google'),
    path('', include(router.urls)),
]
