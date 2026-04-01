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
  getPortalConfig: () => api.get('/configuracao-portal/1/'),
  savePortalConfig: (data) => api.put('/configuracao-portal/1/', data),

  // Novas rotas para o Site Público
  getSiteConfig: () => api.get('/configuracao-site/1/'),
  saveSiteConfig: (data) => api.patch('/configuracao-site/1/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  getGaleria: () => api.get('/galeria/'),
  uploadFotoGaleria: (data) => api.post('/galeria/', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  excluirFotoGaleria: (id) => api.delete(`/galeria/${id}/`),

  // Programação Semanal
  getProgramacao: () => api.get('/agenda/programacao-semanal/'),
  saveProgramacao: (data) => api.post('/agenda/programacao-semanal/', data),
  deleteProgramacao: (id) => api.delete(`/agenda/programacao-semanal/${id}/`),
};

export default configuracaoService;
