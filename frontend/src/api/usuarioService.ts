import api from './api';

export async function createUsuario(username: string, password: string) {
  const res = await api.post("/usuarios", { username, password });
  return res.data;
}
