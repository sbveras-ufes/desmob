import { VehiclePendency } from "./VehiclePendency";

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
  situacao: 'Aguardando aprovação' | 'Liberado' | 'Reprovado' | 'Liberado para Transferência' | 'Em Manutenção' | 'Em Andamento';
  dataSolicitacao: string;
  lastUpdated?: string;
  localDesmobilizacao: string;
  uf: string;
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
  situacaoAnaliseDocumental?: 'Documentação Aprovada' | 'Documentação Pendente' | 'Documentação Pendente com Bloqueio';
  // Alterado
  pendenciasDocumentais?: VehiclePendency[];
  observacaoAnaliseDocumental?: string;
  situacaoAnaliseFiscal?: 'Aprovada' | 'Pendente' | 'Análise Pendente com Bloqueio';
  // Alterado
  pendenciasFiscais?: VehiclePendency[];
  observacaoAnaliseFiscal?: string;
  isTransitionCR?: boolean;
  dataInicioCR?: string;
  dataPrecificacao?: string;
  valorPrecificacao?: number;
  responsavelAtualizacao?: string;
  dataResponsavelDesmobilizacao?: string;
  ufEmplacamento?: string;
  empresaProprietaria?: string;
  cnpjProprietario?: string;
  // Alterado
  pendenciasOutras?: VehiclePendency[];
  observacaoPendenciaOutras?: string;
}

export interface ApprovalFilters {
  periodoInicio?: string;
  periodoFim?: string;
  entregaInicio?: string;
  entregaFim?: string;
  mes?: string;
  placa?: string[];
  tipo?: 'leve' | 'pesado' | '';
  modelo?: string;
  cliente?: string;
  cr?: string[];
  descricaoCR?: string;
  diretoria?: string[];
  tipoDesmobilizacao?: string;
  patioDestino?: string;
  uf?: string;
  municipio?: string;
  chassi?: string[];
  anoModelo?: string;
  situacao?: 'Aguardando aprovação' | 'Liberado' | 'Reprovado' | 'Liberado para Transferência' | '';
  comPendencias?: boolean;
  origemPendencia?: 'Documental' | 'Fiscal' | '';
  demobilizationCode?: string;
}