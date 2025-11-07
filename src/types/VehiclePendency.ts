export interface VehiclePendency {
  id: string; // Unique instance ID
  descricao: string;
  dataCadastro: string;
  status: 'Pendente' | 'Resolvido';
  isBlocking: boolean;
  anexoUrl?: string;
}