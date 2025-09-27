import api from "./api";

export type ClienteForm = {
  id?: number;
  nome: string;
  cpf: string;
  telefone: string;
  email?: string;
};

export const ClienteService = {
  // Cria um cliente
  createCliente: async (cliente: ClienteForm) => {
    const res = await api.post("/clientes", cliente);
    return res.data;
  },

  // Busca o cliente pelo ID do usuário
  fetchClienteByUsuarioId: async (usuarioId: number) => {
    const res = await api.get(`/clientes/usuario/${usuarioId}`);
    return res.data;
  },

  // Atualiza cliente
  updateCliente: async (cliente: ClienteForm) => {
    if (!cliente.id) throw new Error("ID do cliente é obrigatório para atualizar");
    const res = await api.put(`/clientes/${cliente.id}`, cliente);
    return res.data;
  },
};
