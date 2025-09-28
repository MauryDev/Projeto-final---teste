export interface Vaga {
  id: number;
  numeroVaga: number;
  nome: string;
  status: 'available' | 'reserved' | 'occupied';
  tipo: 'CARRO_PEQUENO' | 'CARRO_GRANDE' | 'MOTO' | 'VAGA_PRIORIDADE' | 'VAGA_PCD' | 'VAGA_ELETRICA';
}