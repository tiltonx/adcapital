import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'adcapitalcore.settings')
django.setup()

from membros.models import Membro, Parentesco
from membros.views import MembroViewSet
from rest_framework.test import APIRequestFactory

rf = APIRequestFactory()

m1, _ = Membro.objects.get_or_create(id=1, defaults={'nome': 'Test Destino 1'})

request = rf.post('/api/membros/', {
    'nome': 'Test Origem',
    'email': '',
    'parentescos_novo': [{'membro_destino': 1, 'grau': 'PAI_MAE'}]
}, format='json')

view = MembroViewSet.as_view({'post': 'create'})
try:
    response = view(request)
    print('HTTP STATUS CODE:', response.status_code)
except Exception:
    import traceback
    traceback.print_exc()
