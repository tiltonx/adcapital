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
  Info,
  Settings,
  ShieldAlert,
  Image
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function SettingsPage() {
  const [aba, setAba] = useState('geral');
  const [funcoes, setFuncoes] = useState([]);
  const [categoriasEntrada, setCategoriasEntrada] = useState([]);
  const [categoriasSaida, setCategoriasSaida] = useState([]);
  const [portalConfig, setPortalConfig] = useState({ is_ativo: true, pergunta: '', resposta: '' });
  const [loading, setLoading] = useState(true);

  // Estados Site
  const [siteConfig, setSiteConfig] = useState({
    instagram_url: '',
    youtube_url: '',
    google_maps_url: '',
    pix_chave: '',
    banco_nome: '',
    beneficiario: '',
    pastoral_titulo: '',
    pastoral_texto: '',
    pastor_nome: '',
    pastor_foto: null
  });
  const [programacao, setProgramacao] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [editProg, setEditProg] = useState(null);

  const carregarDados = async () => {
    try {
      setLoading(true);
      const [fRes, cRes, pRes, sRes, gRes, pgRes] = await Promise.all([
        configuracaoService.listarFuncoes(),
        configuracaoService.listarCategorias(),
        configuracaoService.getPortalConfig(),
        configuracaoService.getSiteConfig(),
        configuracaoService.getGaleria(),
        configuracaoService.getProgramacao()
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

  const salvarSite = async () => {
    setLoading(true);
    const formData = new FormData();
    Object.keys(siteConfig).forEach(key => {
      if (key !== 'pastor_foto' || typeof siteConfig[key] !== 'string') {
        formData.append(key, siteConfig[key]);
      }
    });
    try {
      await configuracaoService.saveSiteConfig(formData);
      alert("Configurações do site salvas!");
      await carregarDados();
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const handleAddFoto = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('imagem', file);
    formData.append('legenda', 'Foto da Igreja');
    await configuracaoService.uploadFotoGaleria(formData);
    carregarDados();
  };

  const handleSalvarProg = async (item) => {
    await configuracaoService.saveProgramacao(item);
    setEditProg(null);
    carregarDados();
  };

  const handleDelProg = async (id) => {
    if (confirm('Excluir este horário?')) {
      await configuracaoService.deleteProgramacao(id);
      carregarDados();
    }
  };

  if (loading && !siteConfig) return <div className="p-8 text-center font-black animate-pulse">CARREGANDO...</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[80vh] p-4">
      
      <aside className="w-full md:w-64 space-y-2">
        <button onClick={() => setAba('geral')} className={cn("w-full p-4 rounded-3xl flex items-center gap-3 transition-all font-black text-xs uppercase tracking-widest", aba === 'geral' ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50")}>
          <Settings size={18} /> Gerais
        </button>
        <button onClick={() => setAba('site')} className={cn("w-full p-4 rounded-3xl flex items-center gap-3 transition-all font-black text-xs uppercase tracking-widest", aba === 'site' ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50")}>
          <Globe size={18} /> Site Público
        </button>
        <button onClick={() => setAba('programacao')} className={cn("w-full p-4 rounded-3xl flex items-center gap-3 transition-all font-black text-xs uppercase tracking-widest", aba === 'programacao' ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50")}>
          <Calendar size={18} /> Programação
        </button>
        <button onClick={() => setAba('galeria')} className={cn("w-full p-4 rounded-3xl flex items-center gap-3 transition-all font-black text-xs uppercase tracking-widest", aba === 'galeria' ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50")}>
          <Image size={18} /> Galeria
        </button>
        <button onClick={() => setAba('seguranca')} className={cn("w-full p-4 rounded-3xl flex items-center gap-3 transition-all font-black text-xs uppercase tracking-widest", aba === 'seguranca' ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50")}>
          <ShieldAlert size={18} /> Segurança
        </button>
      </aside>

      <div className="flex-1">
          {aba === 'geral' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SettingsBox title="Funções" color="blue" data={funcoes} 
                 onAdd={v => configuracaoService.adicionarFuncao({nome: v}).then(carregarDados)}
                 onDelete={id => configuracaoService.excluirFuncao(id).then(carregarDados)} />
              <SettingsBox title="Categorias (+)" color="emerald" data={categoriasEntrada} 
                 onAdd={v => configuracaoService.adicionarCategoria({nome: v, tipo: 'ENTRADA'}).then(carregarDados)}
                 onDelete={id => configuracaoService.excluirCategoria(id).then(carregarDados)} />
              <SettingsBox title="Categorias (-)" color="rose" data={categoriasSaida} 
                 onAdd={v => configuracaoService.adicionarCategoria({nome: v, tipo: 'SAIDA'}).then(carregarDados)}
                 onDelete={id => configuracaoService.excluirCategoria(id).then(carregarDados)} />
            </div>
          )}

          {aba === 'site' && siteConfig && (
            <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-slate-900">
                  <h2 className="font-black uppercase text-xs tracking-widest">Configuração do Site</h2>
                  <button onClick={salvarSite} className="bg-blue-600 text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest">Salvar</button>
               </div>
               <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <Field label="Instagram" value={siteConfig.instagram_url} onChange={v => setSiteConfig({...siteConfig, instagram_url: v})} />
                        <Field label="Youtube" value={siteConfig.youtube_url} onChange={v => setSiteConfig({...siteConfig, youtube_url: v})} />
                        <Field label="Chave PIX" value={siteConfig.pix_chave} onChange={v => setSiteConfig({...siteConfig, pix_chave: v})} />
                     </div>
                     <div className="space-y-4">
                        <Field label="Banco" value={siteConfig.banco_nome} onChange={v => setSiteConfig({...siteConfig, banco_nome: v})} />
                        <Field label="Pastor" value={siteConfig.pastor_nome} onChange={v => setSiteConfig({...siteConfig, pastor_nome: v})} />
                        <Field label="Título Pastoral" value={siteConfig.pastoral_titulo} onChange={v => setSiteConfig({...siteConfig, pastoral_titulo: v})} />
                     </div>
                  </div>
                  <Field label="Mensagem Pastoral" isTextArea value={siteConfig.pastoral_texto} onChange={v => setSiteConfig({...siteConfig, pastoral_texto: v})} />
               </div>
            </section>
          )}

          {aba === 'programacao' && (
            <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8">
               <h2 className="font-black uppercase text-xs tracking-widest mb-6 text-slate-900">Programação Semanal</h2>
               <div className="space-y-4">
                  {programacao.map(p => (
                    <div key={p.id} className="flex justify-between p-4 bg-slate-50 rounded-2xl text-slate-900">
                       <div><p className="font-bold">{p.titulo}</p><p className="text-xs text-blue-600">{p.horario}</p></div>
                       <button onClick={() => handleDelProg(p.id)}>🗑️</button>
                    </div>
                  ))}
               </div>
            </section>
          )}

          {aba === 'galeria' && (
             <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 p-8">
                <div className="flex justify-between items-center mb-8 text-slate-900">
                   <h2 className="font-black uppercase text-xs tracking-widest">Fotos</h2>
                   <input type="file" onChange={handleAddFoto} className="text-xs" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                   {galeria.map(f => (
                     <div key={f.id} className="aspect-square bg-slate-100 rounded-xl overflow-hidden relative group">
                        <img src={f.imagem} className="w-full h-full object-cover" />
                        <button onClick={() => configuracaoService.excluirFotoGaleria(f.id).then(carregarDados)} className="absolute inset-0 bg-red-600/50 opacity-0 group-hover:opacity-100 text-white font-bold">EXCLUIR</button>
                     </div>
                   ))}
                </div>
             </section>
          )}

          {aba === 'seguranca' && (
            <section className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
               <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-slate-900">
                  <h2 className="font-black uppercase text-xs tracking-widest">Auto-Cadastro</h2>
                  <button 
                    onClick={() => configuracaoService.savePortalConfig({...portalConfig, is_ativo: !portalConfig.is_ativo}).then(carregarDados)}
                    className={cn("px-8 py-2 rounded-full font-black text-xs", portalConfig.is_ativo ? "bg-green-500 text-white" : "bg-red-500 text-white")}
                  >
                    {portalConfig.is_ativo ? 'Ativo' : 'Inativo'}
                  </button>
               </div>
               <div className="p-8 space-y-4 text-slate-900">
                  <Field label="Pergunta" value={portalConfig.pergunta} onChange={v => setPortalConfig({...portalConfig, pergunta: v})} 
                    onBlur={v => configuracaoService.savePortalConfig({...portalConfig, pergunta: v})} />
                  <Field label="Resposta" value={portalConfig.resposta} onChange={v => setPortalConfig({...portalConfig, resposta: v})} 
                    onBlur={v => configuracaoService.savePortalConfig({...portalConfig, resposta: v})} isUpper />
               </div>
            </section>
          )}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, onBlur, isTextArea, isUpper }) {
  return (
    <div className="flex flex-col">
      <label className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">{label}</label>
      {isTextArea ? (
        <textarea className="p-4 bg-slate-50 border border-slate-200 rounded-2xl" value={value || ''} onChange={e => onChange(e.target.value)} onBlur={e => onBlur && onBlur(e.target.value)} />
      ) : (
        <input className={cn("p-4 bg-slate-50 border border-slate-200 rounded-2xl", isUpper && "uppercase")} value={value || ''} onChange={e => onChange(e.target.value)} onBlur={e => onBlur && onBlur(e.target.value)} />
      )}
    </div>
  );
}

function SettingsBox({ title, color, data, onAdd, onDelete }) {
  const [val, setVal] = useState('');
  return (
    <div className="bg-white rounded-[2rem] shadow-xl border border-slate-100 overflow-hidden text-slate-900 h-[400px] flex flex-col">
      <div className={cn("p-4 font-black uppercase text-xs tracking-widest", color === 'blue' ? "bg-blue-100" : color === 'emerald' ? "bg-emerald-100" : "bg-rose-100")}>{title}</div>
      <div className="p-4 flex gap-2"><input type="text" className="flex-1 p-2 bg-slate-50 border rounded-xl" value={val} onChange={e => setVal(e.target.value)} /><button onClick={() => {onAdd(val); setVal('')}} className="bg-slate-900 text-white px-3 rounded-xl">+</button></div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {data.map(d => (
          <div key={d.id} className="flex justify-between items-center p-2 bg-slate-50 rounded-xl"><span>{d.nome}</span><button onClick={() => onDelete(d.id)}>🗑️</button></div>
        ))}
      </div>
    </div>
  );
}
