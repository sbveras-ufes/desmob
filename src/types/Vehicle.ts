export interface Vehicle {
  id: string;
  placa: string;
  chassi: string;
  modelo: string;
  anoModelo: string;
  km: number;
  diretoria: string;
  cr: string;
  descricaoCR: string;
  tipoDesmobilizacao: 'Renovação de Frota' | 'Redução de Frota' | 'Término Contrato' | '-';
  patioDestino: string;
  uf: string;
  municipio: string;
  localDesmobilizacao: string;
  dataPrevista: string;
  dataEntrega: string;
  gerente: string;
  cliente: string;
  residual: number;
  isTransitionCR?: boolean;
  dataInicioCR?: string;
  ufEmplacamento?: string;
  empresaProprietaria?: string;
  cnpjProprietario?: string;
}

export interface DemobilizationFilters {
  periodoInicio?: string;
  periodoFim?: string;
  entregaInicio?: string;
  entregaFim?: string;
  mes?: string;
  tipo?: 'leve' | 'pesado' | '';
  modelo?: string;
  cliente?: string;
  cr?: string[];
  diretoria?: string;
  tipoDesmobilizacao?: string;
  patioDestino?: string;
  uf?: string;
  municipio?: string;
  chassi?: string[];
  placa?: string[];
  anoModelo?: string;
  situacao?: 'Aguardando aprovação' | 'Liberado' | 'Reprovado' | '';
}

export interface DemobilizationRequest {
  uf: string;
  municipio: string;
  dataEntrega: string;
  patioDestino?: string;
  veiculos: Vehicle[];
}