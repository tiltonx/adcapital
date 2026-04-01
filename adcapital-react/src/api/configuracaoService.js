import api from './config';

const configuracaoService = {
  // Cargos (Roles) - Mantendo compatibilidade com o que já existia em membroService
  listarFuncoes: () => api.get('/opcoes-funcao/'),
  excluirFuncao: (id) => api.delete(`/funcoes/${id}/`),
  salvarFuncao: (dados) => api.post('/funcoes/', dados),

  // Categorias Financeiras
  listarCategorias: () => api.get('/financeiro/categorias/'),
  salvarCategoria: (dados) => {
    if (dados.id) {
      return api.put(`/financeiro/categorias/${dados.id}/`, dados);
    }
    return api.post('/financeiro/categorias/', dados);
  },
  excluirCategoria: (id) => api.delete(`/financeiro/categorias/${id}/`),

  // Portal de Membros (Segurança)
  getPortalConfig: () => api.get('/membros/configuracao-portal/1/'),
  updatePortalConfig: (dados) => api.put('/membros/configuracao-portal/1/', dados),

  // NOVO: Gestão do Site Institucional (Landing Page)
  getSiteConfig: () => api.get('/membros/configuracao-site/1/'),
  updateSiteConfig: (dados) => api.put('/membros/configuracao-site/1/', dados, {
    headers: { 'Content-Type': 'multipart/form-data' } // Para suportar upload de foto do Pastor
  }),

  // Gestão da Galeria de Fotos
  listarGaleria: () => api.get('/membros/galeria/'),
  adicionarFotoGaleria: (formData) => api.post('/membros/galeria/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  excluirFotoGaleria: (id) => api.delete(`/membros/galeria/${id}/`),

  // Gestão da Programação Semanal
  listarProgramacao: () => api.get('/agenda/programacao-semanal/'),
  salvarProgramacao: (dados) => {
    if (dados.id) {
      return api.put(`/agenda/programacao-semanal/${dados.id}/`, dados);
    }
    return api.post('/agenda/programacao-semanal/', dados);
  },
  excluirProgramacao: (id) => api.delete(`/agenda/programacao-semanal/${id}/`),
};

export default configuracaoService;
