import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/clientes";

export async function createCliente(cliente: any, token: string) {
  const res = await axios.post(API_URL, cliente, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
