import api from './api';

export async function login(username: string, password: string) {
  // A requisição de login não precisa do token, então a instância 'api' funciona perfeitamente
  const res = await api.post("/auth", { username, password });
  return res.data;
}