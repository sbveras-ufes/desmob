export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: 'Gestor Contrato' | 'Supervisor' | 'Diretor';
  diretoria?: string;
  cr: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  nome?: string;
  email?: string;
  cargo?: 'Gestor Contrato' | 'Supervisor' | 'Diretor' | '';
  diretoria?: string;
  cr?: string[];
}

export interface UserFormData {
  nome: string;
  email: string;
  cargo: 'Gestor Contrato' | 'Supervisor' | 'Diretor' | '';
  diretoria: string;
  cr: string[];
}