import api from './api';

export async function createCliente(cliente: any) {
  // O token já é adicionado automaticamente pelo 'api' com o interceptor
  const res = await api.post("/clientes", cliente);
  return res.data;
}