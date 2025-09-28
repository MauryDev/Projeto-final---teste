import api from "./api";

// Tipos de dados
export type RecursoResponse = {
  id: number;
  numeroVaga: number;
  nome: string;
  status: string;
  tipo: string;
};

export type RecursoRequest = {
  tipo: string;
  status: string;
};

export const VagaService = {
  // Lista todos os recursos (vagas)
  fetchAll: async (): Promise<RecursoResponse[]> => {
    const res = await api.get("/recursos");
    return res.data;
  },

  // Cria um novo recurso (vaga)
  create: async (recurso: RecursoRequest): Promise<RecursoResponse> => {
    const res = await api.post("/recursos", recurso);
    return res.data;
  },

  // Atualiza um recurso (vaga)
  update: async (id: number, recurso: RecursoRequest): Promise<RecursoResponse> => {
    const res = await api.put(`/recursos/${id}`, recurso);
    return res.data;
  },

  // Exclui um recurso (vaga)
  delete: async (id: number): Promise<void> => {
    await api.delete(`/recursos/${id}`);
  },
};