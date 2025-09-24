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
  tipoDesmobilizacao: 'Renovação de Frota' | 'Redução de Frota' | 'Término Contrato';
  patioDestino: string;
  uf: string;
  municipio: string;
  localDesmobilizacao: string;
  dataPrevista: string;
  dataEntrega: string;
  gerente: string;
  cliente: string;
  residual: number;
}

export interface DemobilizationFilters {
  periodoInicio?: string;
  periodoFim?: string;
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
}

export interface DemobilizationRequest {
  uf: string;
  municipio: string;
  dataEntrega: string;
  patioDestino?: string;
  veiculos: Vehicle[];
}