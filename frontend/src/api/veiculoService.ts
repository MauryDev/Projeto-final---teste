import { Veiculo } from "../types/Veiculo";
import { VeiculoRequestDto } from "../types/VeiculoRequestDto";
import api from "./api";

export const VeiculoService = {

  // GET /veiculos
  fetchVeiculos: async (): Promise<Veiculo[]> => {
    const response = await api.get<Veiculo[]>('/veiculos');
    return response.data;
  },

  // POST /veiculos
  createVeiculo: async (data: VeiculoRequestDto): Promise<Veiculo> => {
    const response = await api.post<Veiculo>('/veiculos', data);
    return response.data;
  },

  // PUT /veiculos/{id}
  updateVeiculo: async (id: number, data: VeiculoRequestDto): Promise<Veiculo> => {
    const response = await api.put<Veiculo>(`/veiculos/${id}`, data);
    return response.data;
  },

  // DELETE /veiculos/{id}
  deleteVeiculo: async (id: number): Promise<void> => {
    await api.delete(`/veiculos/${id}`);
  }
};