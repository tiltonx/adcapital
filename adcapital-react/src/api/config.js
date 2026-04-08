// src/api/config.js
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://api.adcapitaligreja.com.br/api',
    timeout: 30000 // Aumentado para 30s para suportar "Cold Starts" do Render
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// Interceptor de resposta para o refresh do token e tratamento de erros de conexão
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Se for erro de timeout ou rede (sem resposta do servidor)
        if (error.code === 'ECONNABORTED' || !error.response) {
            console.error("Erro de conexão ou tempo de resposta esgotado.");
            // REMOVIDO: window.location.href = '/';  <-- Causava loop infinito
            return Promise.reject(error);
        }

        // Se o erro for 401 (Não autorizado)
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            // Se temos um refresh token, tentamos renovar a sessão automaticamente
            if (refreshToken) {
                try {
                    const response = await axios.post(`${api.defaults.baseURL}/token/refresh/`, {
                        refresh: refreshToken
                    });

                    if (response.status === 200) {
                        const { access } = response.data;
                        localStorage.setItem('access_token', access);
                        
                        // Atualiza o header do request original e tenta de novo
                        originalRequest.headers.Authorization = `Bearer ${access}`;
                        return api(originalRequest);
                    }
                } catch (refreshError) {
                    console.error("Falha Crítica no Refresh Token:", refreshError);
                }
            }

            // Se chegou aqui, ou não tinha refresh token ou o refresh falhou
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            // Redireciona para o login apenas se não estivermos no portal de auto-cadastro
            // para evitar que erros no portal público joguem o usuário na tela de login administrativo
            const isPublicPortal = window.location.hash.includes('cadastro');
            if (!isPublicPortal) {
                window.location.href = '/';
            }
        }

        return Promise.reject(error);
    }
);

export default api;