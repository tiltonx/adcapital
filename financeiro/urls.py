from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransacaoViewSet, DashboardAPIView

router = DefaultRouter()
router.register(r'transacoes', TransacaoViewSet)

urlpatterns = [
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
    path('', include(router.urls)),
]