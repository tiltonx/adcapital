import { useState, useCallback, useEffect } from 'react';

export function useAgenda() {
  const [eventos, setEventos] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

  const buscarEventos = useCallback(async () => {
    setCarregando(true);
    try {
      const response = await fetch(`${API_URL}/agenda/eventos/`);
      if (response.ok) {
        const data = await response.json();
        setEventos(data);
      }
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
    } finally {
      setCarregando(false);
    }
  }, [API_URL]);

  useEffect(() => {
    buscarEventos();
  }, [buscarEventos]);

  const criarEvento = async (novoEvento) => {
    setCarregando(true);
    try {
      const response = await fetch(`${API_URL}/agenda/eventos/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            titulo: novoEvento.titulo,
            descricao: novoEvento.descricao,
            data_inicio: new Date(novoEvento.data_inicio).toISOString(),
            data_fim: new Date(novoEvento.data_fim).toISOString()
        }),
      });
      if (response.ok) {
        await buscarEventos();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao criar evento:", error);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  const deletarEvento = async (id) => {
    setCarregando(true);
    try {
      const response = await fetch(`${API_URL}/agenda/eventos/${id}/`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await buscarEventos();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Erro ao deletar evento:", error);
      return false;
    } finally {
      setCarregando(false);
    }
  };

  return { eventos, carregando, buscarEventos, criarEvento, deletarEvento };
}
