import React, { useState } from 'react';
import { useAgenda } from './useAgenda';
import AgendaFormModal from './AgendaFormModal';

export default function AgendaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { eventos, carregando, criarEvento, deletarEvento } = useAgenda();

  const handleSalvar = async (eventoData) => {
    const sucesso = await criarEvento(eventoData);
    if (sucesso) setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Agenda Oficial (Google Calendar)</h2>
          <p className="text-sm text-slate-500 font-medium">Controle e Sincronização de eventos e cultos oficiais da Igreja.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-blue-500/20 active:scale-95 flex items-center gap-2"
          disabled={carregando}
        >
          {carregando ? 'Sincronizando...' : '+ Adicionar Evento'}
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[400px]">
        {carregando && eventos.length === 0 ? (
           <div className="p-12 text-center text-slate-400 font-bold animate-pulse">Carregando eventos sincronizados com o Google...</div>
        ) : eventos.length === 0 ? (
           <div className="p-16 text-center">
             <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5 text-blue-500 text-3xl shadow-inner">
               📅
             </div>
             <h3 className="text-xl font-black text-slate-700 mb-2">A Agenda está livre</h3>
             <p className="text-slate-500 font-medium">Cadastre um casamento, culto, ensaio ou vigília para preencher o calendário oficial da liderança da Igreja.</p>
           </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {eventos.map((ev) => (
              <div key={ev.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-800">{ev.titulo}</h3>
                  {ev.descricao && <p className="text-sm text-slate-500 mt-1 font-medium leading-relaxed">{ev.descricao}</p>}
                  
                  <div className="flex flex-wrap gap-3 mt-4 text-xs font-bold text-slate-600">
                    <span className="bg-white border border-slate-200 shadow-sm px-3 pt-1 pb-0.5 rounded-xl flex items-center gap-1">
                       <span className="text-slate-400">INÍCIO: </span>
                       {new Date(ev.data_inicio).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' }).toUpperCase()}
                    </span>
                    <span className="bg-white border border-slate-200 shadow-sm px-3 pt-1 pb-0.5 rounded-xl flex items-center gap-1">
                       <span className="text-slate-400">FIM: </span>
                       {new Date(ev.data_fim).toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' }).toUpperCase()}
                    </span>
                    {ev.google_event_id && (
                      <span className="text-green-700 bg-green-50 px-3 pt-1 pb-0.5 rounded-xl flex items-center gap-1">
                        Sincronizado ✅
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => deletarEvento(ev.id)}
                  disabled={carregando}
                  className="px-5 py-2.5 bg-red-50 text-red-600 font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-red-100 transition-colors active:scale-95 whitespace-nowrap self-start md:self-center"
                >
                  Excluir e Avisar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <AgendaFormModal 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSalvar}
          carregando={carregando}
        />
      )}
    </div>
  );
}
