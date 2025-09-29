export interface ApprovalVehicle {
  id: string;
  placa: string;
  chassi: string;
  modelo: string;
  anoModelo: string;
  km: number;
  diretoria: string;
  cr: string;
  descricaoCR: string;
  dataPrevista: string;
  cliente: string;
  gerente: string;
  situacao: 'Aguardando aprovação' | 'Liberado para Desmobilização' | 'Reprovado';
  dataSolicitacao: string;
  lastUpdated: string;
  localDesmobilizacao: string;
  dataEntrega: string;
  tipoDesmobilizacao: string;
  justificativaReprovacao?: string;
  patioOrigem?: string;
  patioVistoria?: string;
  patioDestino?: string;
  residual: number;
}

export interface ApprovalFilters {
  periodoInicio?: string;
  periodoFim?: string;
  mes?: string;
  placa?: string;
  tipo?: 'leve' | 'pesado' | '';
  modelo?: string;
  cliente?: string;
  cr?: string[];
  descricaoCR?: string;
  diretoria?: string;
  tipoDesmobilizacao?: string;
  patioDestino?: string;
  uf?: string;
  municipio?: string;
  chassi?: string;
  anoModelo?: string;
  situacao?: 'Aguardando aprovação' | 'Liberado para Desmobilização' | 'Reprovado' | '';
}