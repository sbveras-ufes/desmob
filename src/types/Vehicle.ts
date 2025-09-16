export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  anoModelo: string;
  km: number;
  diretoria: string;
  cr: string;
  tipoDesmobilizacao: 'Renovação de Frota' | 'Redução de Frota' | 'Término Contrato';
  patioDestino: string;
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
  placa?: string;
  tipo?: 'leve' | 'pesado' | '';
  modelo?: string;
  cliente?: string;
  cr?: string;
  diretoria?: string;
}

export interface DemobilizationRequest {
  localDesmobilizacao: string;
  dataEntrega: string;
  patioDestino?: string;
  tipoDesmobilizacao: string;
  veiculos: Vehicle[];
}