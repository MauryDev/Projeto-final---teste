import axios from "axios";

const API_URL = "http://localhost:8080/api/v1";

export async function login(username: string, password: string) {
  const res = await axios.post(`${API_URL}/auth`, { username, password });
  return res.data;
}
