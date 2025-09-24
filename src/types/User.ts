export interface User {
  id: string;
  nome: string;
  email: string;
  diretoria?: string;
  cr: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserFilters {
  nome?: string;
  email?: string;
  diretoria?: string;
  cr?: string[];
}

export interface UserFormData {
  nome: string;
  email: string;
  diretoria: string;
  cr: string[];
}