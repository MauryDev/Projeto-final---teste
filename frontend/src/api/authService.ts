import api from './api';

export interface LoginResponse {
  token: string;
}

export async function login(username: string, password: string): Promise<LoginResponse> {
  const res = await api.post("/auth", { username, password });
  return res.data; // { token: "eyJ..." }
}
