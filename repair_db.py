import os
import django
from django.core.management.color import no_style
from django.db import connection

# Configura o ambiente Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'adcapitalcore.settings')
django.setup()

def reset_sequences():
    print("Iniciando sincronização de sequências do banco de dados...")
    
    from membros.models import Funcao, Membro, Parentesco, ConfiguracaoPortal, ConfiguracaoSite, FotoGaleria
    from financeiro.models import CategoriaFinanceira, Transacao
    from agenda.models import Evento, ProgramacaoSemanal

    models = [
        Funcao, Membro, Parentesco, ConfiguracaoPortal, ConfiguracaoSite, FotoGaleria,
        CategoriaFinanceira, Transacao, Evento, ProgramacaoSemanal
    ]
    
    sequence_sql = connection.ops.sequence_reset_sql(no_style(), models)
    
    with connection.cursor() as cursor:
        for sql in sequence_sql:
            try:
                print(f"Executando: {sql}")
                cursor.execute(sql)
            except Exception as e:
                print(f"Aviso ao executar SQL: {e}")
                
    print("Sincronização de sequências concluída com sucesso!")

if __name__ == "__main__":
    reset_sequences()
