export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: 'Gestor Contrato' | 'Supervisor';
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  nome?: string;
  email?: string;
  cargo?: 'Gestor Contrato' | 'Supervisor' | '';
}

export interface UserFormData {
  nome: string;
  email: string;
  cargo: 'Gestor Contrato' | 'Supervisor' | '';
}