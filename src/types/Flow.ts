export interface FlowUser {
  id: number;
  userId: string;
  role: 'Análise Supervisor' | 'Análise Gerente' | 'Análise Diretor' | '';
}

export interface ApprovalFlow {
  id: string;
  description: string;
  diretoria: string;
  crs: string[];
  users: FlowUser[];
}