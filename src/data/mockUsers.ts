import { User } from '../types/User';

export const mockUsers: User[] = [
  {
    id: '1',
    nome: 'João Silva',
    email: 'joao.silva@empresa.com',
    cargo: 'Gestor Contrato',
    diretoria: 'LETS',
    cr: ['301045540', '301045547'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    nome: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    cargo: 'Supervisor',
    diretoria: 'COMERCIAL',
    cr: ['301045541', '301045545'],
    createdAt: '2024-01-20T14:15:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    nome: 'Carlos Lima',
    email: 'carlos.lima@empresa.com',
    cargo: 'Gestor Contrato',
    diretoria: 'OPERAÇÕES',
    cr: ['301045542', '301045543', '301045544'],
    createdAt: '2024-02-01T09:45:00Z',
    updatedAt: '2024-02-01T09:45:00Z'
  },
  {
    id: '4',
    nome: 'Ana Pereira',
    email: 'ana.pereira@empresa.com',
    cargo: 'Diretor',
    diretoria: 'FINANCEIRA',
    cr: ['301045546'],
    createdAt: '2024-03-10T11:00:00Z',
    updatedAt: '2024-03-10T11:00:00Z'
  },
  {
    id: '5',
    nome: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    cargo: 'Gestor Contrato',
    diretoria: undefined,
    cr: [],
    createdAt: '2024-02-15T11:10:00Z',
    updatedAt: '2024-02-15T11:10:00Z'
  }
];