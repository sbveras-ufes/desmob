import { ApprovalFlow } from '../types/Flow';

export const mockFlows: ApprovalFlow[] = [
  {
    id: 'flow-1',
    description: 'Fluxo Padrão Operações LETS',
    diretoria: 'LETS',
    crs: ['301045540', '301045547'],
    users: [
      { id: 1, userId: '2', role: 'Análise Supervisor' },
      { id: 2, userId: '1', role: 'Análise Gerente' },
    ],
    status: 'Ativo',
  },
  {
    id: 'flow-2',
    description: 'Fluxo Diretoria Comercial',
    diretoria: 'COMERCIAL',
    crs: ['301045541'],
    users: [
      { id: 1, userId: '2', role: 'Análise Supervisor' },
      { id: 2, userId: '4', role: 'Análise Diretor' },
    ],
    status: 'Ativo',
  }
];