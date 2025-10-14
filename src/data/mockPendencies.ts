import { Pendency } from '../types/Pendency';

export const mockPendencies: Pendency[] = [
  { id: '1', origem: 'Documental', descricao: 'RENAVAN', geraBloqueio: false },
  { id: '2', origem: 'Documental', descricao: 'Multa', geraBloqueio: true },
  { id: '3', origem: 'Documental', descricao: 'Recall', geraBloqueio: false },
  { id: '4', origem: 'Fiscal', descricao: 'IPVA Atrasado', geraBloqueio: true },
  { id: '5', origem: 'Fiscal', descricao: 'Licenciamento Vencido', geraBloqueio: true },
];