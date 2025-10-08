export interface ApprovalVehicle {
  id: string;
  demobilizationCode?: string;
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
  situacao: 'Aguardando aprovação' | 'Liberado para Desmobilização' | 'Reprovado' | 'Liberado para Transferência';
  dataSolicitacao: string;
  lastUpdated?: string;
  localDesmobilizacao: string;
  dataEntrega: string;
  tipoDesmobilizacao: string;
  justificativaReprovacao?: string;
  patioOrigem?: string;
  patioVistoria?: string;
  patioDestino?: string;
  residual: number;
  situacaoVistoria?: string;
  dataVistoria?: string;
  classificacaoVistoria?: string;
  situacaoAnaliseFiscal?: 'Aprovada' | 'Pendente';
  tipoPendencia?: string[];
  observacaoAnaliseFiscal?: string;
  isTransitionCR?: boolean;
  dataInicioCR?: string;
  dataPrecificacao?: string;
  valorPrecificacao?: number;
  responsavelAtualizacao?: string;
}

export interface ApprovalFilters {
  periodoInicio?: string;
  periodoFim?: string;
  entregaInicio?: string;
  entregaFim?: string;
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
  situacao?: 'Aguardando aprovação' | 'Liberado para Desmobilização' | 'Reprovado' | 'Liberado para Transferência' | '';
}