// Mapeamento para os tipos de vaga
export const tipoVagaMap = {
  'CARRO_PEQUENO': { icon: '🚗', color: 'text-primary' },
  'CARRO_GRANDE': { icon: '🚗', color: 'text-primary' },
  'MOTO': { icon: '🏍️', color: 'text-secondary' },
  'VAGA_PRIORIDADE': { icon: '⭐', color: 'text-warning' },
  'VAGA_PCD': { icon: '♿', color: 'text-success' },
  'VAGA_ELETRICA': { icon: '⚡', color: 'text-info' },
};

// Defina o tipo com base nas chaves do seu mapa
export type TipoVagaKey = keyof typeof tipoVagaMap;

// Defina a interface principal
export interface ReservaResponseDto {
  id: number;
  recursoId: number;
  nomeRecurso: string;
  tipoVaga: TipoVagaKey;
  placaVeiculo: string;
  marcaVeiculo: string;
  modeloVeiculo: string;
  usuarioId: number;
  nomeUsuario: string;
  horarioInicio: string;
  horarioFim: string | null;
}