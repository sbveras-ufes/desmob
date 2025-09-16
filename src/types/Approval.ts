export interface ApprovalVehicle {
  id: string;
  placa: string;
  modelo: string;
  anoModelo: string;
  diretoria: string;
  cr: string;
  dataPrevista: string;
  cliente: string;
  gerente: string;
  situacao: 'Aguardando aprovação' | 'Aprovado' | 'Reprovado';
  dataSolicitacao: string;
  localDesmobilizacao: string;
  dataEntrega: string;
  tipoDesmobilizacao: string;
  justificativaReprovacao?: string;
}

export interface ApprovalFilters {
  periodoInicio?: string;
  periodoFim?: string;
  mes?: string;
  placa?: string;
  tipo?: 'leve' | 'pesado' | '';
  modelo?: string;
  cliente?: string;
  cr?: string;
  diretoria?: string;
}