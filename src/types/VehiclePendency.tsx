export interface VehiclePendency {
  id: string;
  // A 'definitionId' se refere ao ID da 'Pendency' original em mockPendencies
  definitionId: string; 
  descricao: string;
  dataCadastro: string;
  status: 'Pendente' | 'Resolvido';
  // Opcional: para armazenar o anexo de liberação de bloqueio
  anexoLiberacao?: string; 
}