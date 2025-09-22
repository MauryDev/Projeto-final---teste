import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/usuarios";

export async function createUsuario(username: string, password: string) {
  const res = await axios.post(API_URL, { username, password });
  return res.data;
}
