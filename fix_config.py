import os
import django

def fix_config():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'adcapitalcore.settings')
    django.setup()
    from membros.models import ConfiguracaoPortal, ConfiguracaoSite
    
    print("Tentando criar registros de configuração...")
    cp, created = ConfiguracaoPortal.objects.get_or_create(id=1, defaults={
        'pergunta': 'Qual o seu melhor amigo?',
        'resposta': 'Jesus'
    })
    print(f"Portal Config (id=1): {'Criado' if created else 'Já existe'}")
    
    cs, created = ConfiguracaoSite.objects.get_or_create(id=1, defaults={
        'pix_chave': 'adcapital.church@gmail.com'
    })
    print(f"Site Config (id=1): {'Criado' if created else 'Já existe'}")

if __name__ == "__main__":
    fix_config()
