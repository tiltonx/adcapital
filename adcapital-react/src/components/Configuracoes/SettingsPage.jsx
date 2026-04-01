import React, { useState, useEffect } from 'react';
import configuracaoService from '../../api/configuracaoService';
import { 
  Globe, 
  Image as ImageIcon, 
  Calendar, 
  Save, 
  Trash2, 
  Plus, 
  Upload, 
  ExternalLink,
  BookOpen,
  Info
} from 'lucide-react';

export default function SettingsPage() {
  const [funcoes, setFuncoes] = useState([]);
  const [categoriasEntrada, setCategoriasEntrada] = useState([]);
  const [categoriasSaida, setCategoriasSaida] = useState([]);
  const [portalConfig, setPortalConfig] = useState({ is_ativo: true, pergunta: '', resposta: '' });
  const [loading, setLoading] = useState(true);

  // Novos Estados: Site Institucional
  const [siteConfig, setSiteConfig] = useState(null);
  const [programacao, setProgramacao] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [novaProg, setNovaProg] = useState({ dia_semana: 0, titulo: '', horario: '', ordem: 0 });
  const [uploadingFoto, setUploadingFoto] = useState(false);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [fRes, cRes, pRes, sRes, pgRes, gRes] = await Promise.all([
        configuracaoService.listarFuncoes(),
        configuracaoService.listarCategorias(),
        configuracaoService.getPortalConfig(),
        configuracaoService.getSiteConfig(),
        configuracaoService.listarProgramacao(),
        configuracaoService.listarGaleria()
      ]);
      
      setFuncoes(fRes.data);
      setCategoriasEntrada(cRes.data.filter(c => c.tipo === 'ENTRADA'));
      setCategoriasSaida(cRes.data.filter(c => c.tipo === 'SAIDA'));
      setPortalConfig(pRes.data);
      setSiteConfig(sRes.data);
      setProgramacao(pgRes.data);
      setGaleria(gRes.data);
    } catch (err) {
      console.error("Erro ao carregar configurações:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarDados();
  }, []);

  // --- Handlers: Site Config ---
  const handleUpdateSiteConfig = async (e) => {
    e.preventDefault();
    try {
      setUploadingFoto(true);
      const formData = new FormData();
      Object.keys(siteConfig).forEach(key => {
        if (key !== 'pastor_foto' || typeof siteConfig[key] === 'object') {
          formData.append(key, siteConfig[key]);
        }
      });
      await configuracaoService.updateSiteConfig(formData);
      alert("Configurações do site salvas com sucesso!");
    } catch (err) {
      alert("Erro ao salvar configurações.");
    } finally {
      setUploadingFoto(false);
    }
  };

  // --- Handlers: Programação ---
  const handleAddProgramacao = async () => {
    if (!novaProg.titulo || !novaProg.horario) return;
    await configuracaoService.salvarProgramacao(novaProg);
    setNovaProg({ dia_semana: 0, titulo: '', horario: '', ordem: 0 });
    carregarDados();
  };

  const handleDeleteProgramacao = async (id) => {
    if (window.confirm("Excluir este horário da programação?")) {
      await configuracaoService.excluirProgramacao(id);
      carregarDados();
    }
  };

  // --- Handlers: Galeria ---
  const handleUploadGaleria = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('imagem', file);
    formData.append('legenda', 'Nova Foto');
    await configuracaoService.adicionarFotoGaleria(formData);
    carregarDados();
  };

  const handleDeleteFoto = async (id) => {
    if (window.confirm("Excluir esta foto da galeria?")) {
      await configuracaoService.excluirFotoGaleria(id);
      carregarDados();
    }
  };

  if (loading) return <div className="p-8 text-center font-bold text-slate-400">Preparando ambiente de gestão...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      
      {/* HEADER INTEGRADO */}
      <header className="px-6 py-4 flex items-center justify-between">
        <div>
           <h1 className="text-4xl font-black text-blue-950 uppercase tracking-tighter">Central de Gestão</h1>
           <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mt-1">Configurações do Sistema e Site Institucional</p>
        </div>
        <div className="hidden md:flex gap-4">
           <a href="/#/site" target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs uppercase hover:bg-blue-100 transition-all">
             <ExternalLink size={14} /> Ver Site Público
           </a>
        </div>
      </header>

      {/* SEÇÃO 1: DADOS DO SITE INSTITUCIONAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-6">
        
        {/* Painel do Site (Configurações Gerais) */}
        <section className="lg:col-span-2 space-y-8">
          
          {/* Informações Básicas e Sociais */}
          <form onSubmit={handleUpdateSiteConfig} className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
            <div className="bg-blue-900 p-6 flex justify-between items-center text-white">
               <h2 className="font-black uppercase text-xs tracking-widest flex items-center gap-2">
                 <Globe size={16} /> Configurações do Site (Landing Page)
               </h2>
               <button type="submit" disabled={uploadingFoto} className="bg-white text-blue-900 px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center gap-2">
                 <Save size={14} /> {uploadingFoto ? 'Salvando...' : 'Salvar Alterações'}
               </button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <h3 className="text-blue-900 font-black text-[11px] uppercase tracking-widest mb-4">📍 Identidade e Contato</h3>
                  <div className="space-y-4">
                    <Field label="Nome do Pastor" value={siteConfig?.pastor_nome} onChange={v => setSiteConfig({...siteConfig, pastor_nome: v})} />
                    <Field label="Chave PIX" value={siteConfig?.pix_chave} onChange={v => setSiteConfig({...siteConfig, pix_chave: v})} />
                    <Field label="Nome do Banco" value={siteConfig?.banco_nome} onChange={v => setSiteConfig({...siteConfig, banco_nome: v})} />
                    <Field label="Endereço" value={siteConfig?.endereco_completo} onChange={v => setSiteConfig({...siteConfig, endereco_completo: v})} isTextArea />
                  </div>
               </div>

               <div className="space-y-4">
                  <h3 className="text-blue-900 font-black text-[11px] uppercase tracking-widest mb-4">🔗 Redes e Mídia</h3>
                  <div className="space-y-4">
                    <Field label="Instagram URL" value={siteConfig?.instagram_url} onChange={v => setSiteConfig({...siteConfig, instagram_url: v})} />
                    <Field label="YouTube URL" value={siteConfig?.youtube_url} onChange={v => setSiteConfig({...siteConfig, youtube_url: v})} />
                    <Field label="Vídeo Institucional (YouTube URL/ID)" value={siteConfig?.video_sobre_nos_url} onChange={v => setSiteConfig({...siteConfig, video_sobre_nos_url: v})} />
                    <div className="flex flex-col">
                       <label className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">Foto do Pastor (Upload)</label>
                       <input 
                         type="file" 
                         onChange={e => setSiteConfig({...siteConfig, pastor_foto: e.target.files[0]})}
                         className="p-3 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-pointer"
                       />
                    </div>
                  </div>
               </div>

               {/* Seção Palavra Pastoral */}
               <div className="md:col-span-2 bg-slate-50/50 rounded-3xl p-8 border border-slate-100 space-y-4">
                  <h3 className="text-blue-900 font-black text-[11px] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <BookOpen size={16} /> Palavra Pastoral
                  </h3>
                  <Field label="Título da Mensagem" value={siteConfig?.pastoral_titulo} onChange={v => setSiteConfig({...siteConfig, pastoral_titulo: v})} />
                  <Field label="Texto da Palavra Pastoral" value={siteConfig?.pastoral_texto} onChange={v => setSiteConfig({...siteConfig, pastoral_texto: v})} isTextArea />
               </div>
            </div>
          </form>

          {/* Galeria de Fotos */}
          <section className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden">
            <div className="bg-slate-100 p-6 flex justify-between items-center">
               <h2 className="font-black text-blue-950 uppercase text-xs tracking-widest flex items-center gap-2">
                 <ImageIcon size={16} /> Galeria de Fotos Institucional
               </h2>
               <div className="relative">
                  <input type="file" multiple id="galeria-up" className="hidden" onChange={handleUploadGaleria}/>
                  <label htmlFor="galeria-up" className="bg-blue-600 text-white px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 transition-all cursor-pointer flex items-center gap-2">
                    <Upload size={14} /> Adicionar Fotos
                  </label>
               </div>
            </div>
            <div className="p-8 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {galeria.map(foto => (
                 <div key={foto.id} className="relative group aspect-square rounded-2xl overflow-hidden border border-slate-100 bg-slate-50">
                    <img src={foto.imagem} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => handleDeleteFoto(foto.id)}
                      className="absolute top-2 right-2 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 hover:bg-red-500 transition-all shadow-lg"
                    >
                      <Trash2 size={12} />
                    </button>
                 </div>
               ))}
               {galeria.length === 0 && <p className="col-span-full py-10 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Nenhuma foto enviada ainda.</p>}
            </div>
          </section>

        </section>

        {/* --- PROGRAMAÇÃO SEMANAL --- */}
        <aside className="space-y-8">
           <section className="bg-slate-950 rounded-[2.5rem] shadow-2xl p-8 text-white flex flex-col h-full border border-slate-800">
              <h2 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-blue-400 flex items-center gap-2">
                <Calendar size={18} /> Programação Semanal
              </h2>
              
              <div className="space-y-4 mb-8">
                 <select 
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold outline-none focus:border-blue-500"
                    value={novaProg.dia_semana}
                    onChange={e => setNovaProg({...novaProg, dia_semana: parseInt(e.target.value)})}
                 >
                    <option value="0" className="bg-slate-900">Domingo</option>
                    <option value="1" className="bg-slate-900">Segunda-feira</option>
                    <option value="2" className="bg-slate-900">Terça-feira</option>
                    <option value="3" className="bg-slate-900">Quarta-feira</option>
                    <option value="4" className="bg-slate-900">Quinta-feira</option>
                    <option value="5" className="bg-slate-900">Sexta-feira</option>
                    <option value="6" className="bg-slate-900">Sábado</option>
                 </select>
                 <input 
                    type="text" placeholder="Nome do Culto/Evento"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold outline-none focus:border-blue-500"
                    value={novaProg.titulo}
                    onChange={e => setNovaProg({...novaProg, titulo: e.target.value})}
                 />
                 <input 
                    type="text" placeholder="Horário (Ex: 19:00 as 21:00)"
                    className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold outline-none focus:border-blue-500"
                    value={novaProg.horario}
                    onChange={e => setNovaProg({...novaProg, horario: e.target.value})}
                 />
                 <button onClick={handleAddProgramacao} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 transition-all flex items-center justify-center gap-2">
                    <Plus size={16} /> Adicionar Programação
                 </button>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                 {programacao.map(p => (
                   <div key={p.id} className="p-5 bg-white/5 border border-white/10 rounded-3xl group relative hover:border-blue-500/50 transition-all">
                      <span className="text-[9px] font-black uppercase text-blue-500 tracking-widest block mb-2">{p.dia_nome}</span>
                      <h4 className="font-bold text-white text-md leading-tight mb-1">{p.titulo}</h4>
                      <p className="text-white/40 text-xs font-semibold uppercase">{p.horario}</p>
                      <button onClick={() => handleDeleteProgramacao(p.id)} className="absolute top-4 right-4 p-2 opacity-0 group-hover:opacity-100 text-white/20 hover:text-red-500 transition-all">
                        <Trash2 size={16} />
                      </button>
                   </div>
                 ))}
              </div>
           </section>
        </aside>

      </div>

      {/* SEÇÃO 2: CONFIGURAÇÕES DO SISTEMA (TABELAS EXISTENTES) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 mt-12">
         {/* Reutilizando lógica anterior para Cargos e Categorias */}
         <SettingsBox title="🎭 Cargos Ministeriais" color="blue" data={funcoes} 
           onAdd={v => configuracaoService.salvarFuncao({nome: v}).then(carregarDados)}
           onDelete={(id, n) => configuracaoService.excluirFuncao(id).then(carregarDados)} />
         
         <SettingsBox title="💰 Categorias de Dízimos/Ofertas" color="emerald" data={categoriasEntrada} 
           onAdd={v => configuracaoService.salvarCategoria({nome: v, tipo: 'ENTRADA'}).then(carregarDados)}
           onDelete={(id, n) => configuracaoService.excluirCategoria(id).then(carregarDados)} />

         <SettingsBox title="💸 Categorias de Despesas" color="rose" data={categoriasSaida} 
           onAdd={v => configuracaoService.salvarCategoria({nome: v, tipo: 'SAIDA'}).then(carregarDados)}
           onDelete={(id, n) => configuracaoService.excluirCategoria(id).then(carregarDados)} />
      </div>

       {/* Portal de Cadastro (Segurança) */}
       <div className="px-6 mb-20">
         <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
               <div>
                 <h2 className="font-black uppercase text-xs tracking-widest">Portal de Auto-Cadastro</h2>
                 <p className="text-slate-500 text-[10px] mt-1 uppercase font-bold tracking-widest">Segurança para novos registros</p>
               </div>
               <button 
                 onClick={() => configuracaoService.updatePortalConfig({...portalConfig, is_ativo: !portalConfig.is_ativo}).then(carregarDados)}
                 className={cn("px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest transition-all", 
                   portalConfig.is_ativo ? "bg-green-500 text-white" : "bg-red-500 text-white")}
               >
                 {portalConfig.is_ativo ? 'Portal Aberto' : 'Portal Bloqueado'}
               </button>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-6">
                  <Field label="Pergunta de Segurança" value={portalConfig.pergunta} onChange={v => setPortalConfig({...portalConfig, pergunta: v})} onBlur={v => configuracaoService.updatePortalConfig({...portalConfig, pergunta: v})} />
                  <Field label="Resposta de Segurança" value={portalConfig.resposta} onChange={v => setPortalConfig({...portalConfig, resposta: v})} onBlur={v => configuracaoService.updatePortalConfig({...portalConfig, resposta: v})} isUpper />
               </div>
               <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex items-center gap-6">
                  <div className="bg-blue-100 p-4 rounded-2xl text-blue-600"><Info size={24}/></div>
                  <p className="text-sm text-slate-500 font-medium">Esta configuração garante que apenas pessoas autorizadas (que saibam a resposta) possam visualizar o formulário de cadastro público.</p>
               </div>
            </div>
         </section>
       </div>

    </div>
  );
}

// COMPONENTES AUXILIARES
function Field({ label, value, onChange, onBlur, isTextArea, isUpper }) {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 ml-1 tracking-widest">{label}</label>
      {isTextArea ? (
        <textarea 
          className="p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-700 min-h-[120px]"
          value={value || ''} 
          onChange={e => onChange(e.target.value)}
          onBlur={e => onBlur && onBlur(e.target.value)}
        />
      ) : (
        <input 
          type="text"
          className={cn("p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700", isUpper && "uppercase")}
          value={value || ''} 
          onChange={e => onChange(e.target.value)}
          onBlur={e => onBlur && onBlur(e.target.value)}
        />
      )}
    </div>
  )
}

function SettingsBox({ title, color, data, onAdd, onDelete }) {
  const [val, setVal] = useState('');
  const colors = {
    blue: "bg-blue-100 text-blue-900 border-blue-200 ring-blue-500",
    emerald: "bg-emerald-100 text-emerald-900 border-emerald-200 ring-emerald-500",
    rose: "bg-rose-100 text-rose-900 border-rose-200 ring-rose-500"
  }
  return (
    <div className="bg-white rounded-[2rem] shadow-xl shadow-blue-900/5 border border-slate-100 overflow-hidden flex flex-col h-[500px]">
      <div className={cn("p-6 font-black uppercase text-xs tracking-widest border-b", colors[color])}>{title}</div>
      <div className="p-5 border-b border-slate-50">
        <div className="flex gap-2">
           <input type="text" className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold outline-none" 
             placeholder="Novo item..." value={val} onChange={e => setVal(e.target.value)} />
           <button onClick={() => { onAdd(val); setVal('') }} className="bg-slate-900 text-white px-4 rounded-xl font-black">+</button>
        </div>
      </div>
      <div className="p-5 space-y-2 overflow-y-auto flex-1">
         {data.map(d => (
           <div key={d.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:border-blue-100">
             <span className="font-bold text-slate-900 text-sm">{d.nome}</span>
             <button onClick={() => onDelete(d.id, d.nome)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition-all font-bold">🗑️</button>
           </div>
         ))}
      </div>
    </div>
  )
}
