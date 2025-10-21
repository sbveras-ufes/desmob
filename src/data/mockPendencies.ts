import { Pendency } from '../types/Pendency';

export const mockPendencies: Pendency[] = [
  { id: '1', origem: 'Documental', descricao: 'RENAVAN', geraBloqueio: false },
  { id: '2', origem: 'Documental', descricao: 'Multa', geraBloqueio: true },
  { id: '3', origem: 'Documental', descricao: 'Recall', geraBloqueio: false },
  { id: '4', origem: 'Fiscal', descricao: 'IPVA Atrasado', geraBloqueio: true },
  { id: '5', origem: 'Fiscal', descricao: 'Licenciamento Vencido', geraBloqueio: true },
  { id: '6', origem: 'Manutenção', descricao: 'Motor', geraBloqueio: false },
  { id: '7', origem: 'Manutenção', descricao: 'Elétrica', geraBloqueio: false },
  { id: '8', origem: 'Manutenção', descricao: 'Freios', geraBloqueio: false },
  { id: '9', origem: 'Manutenção', descricao: 'Suspensão', geraBloqueio: false },
];