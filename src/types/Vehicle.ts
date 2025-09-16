export interface Vehicle {
  id: string;
  placa: string;
  modelo: string;
  anoModelo: string;
  diretoria: string;
  cr: string;
  situacao: string;
  dataPrevista: string;
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