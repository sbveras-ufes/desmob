import { Pendency } from "../types/Pendency";

export const mockPendencies: Pendency[] = [
  { id: 'p1', tipo: 'Documental', descricao: 'Multa', geraBloqueio: true },
  { id: 'p2', tipo: 'Documental', descricao: 'IPVA Atrasado', geraBloqueio: true },
  { id: 'p3', tipo: 'Documental', descricao: 'Vistoria Obrigatória Pendente', geraBloqueio: false },
  { id: 'p4', tipo: 'Fiscal', descricao: 'Débito de ICMS', geraBloqueio: true },
  { id: 'p5', tipo: 'Fiscal', descricao: 'Nota Fiscal Incorreta', geraBloqueio: false },
  { id: 'p6', tipo: 'Outras Pendências', descricao: 'Troca de Pneus', geraBloqueio: true },
  { id: 'p7', tipo: 'Outras Pendências', descricao: 'Revisão Programada', geraBloqueio: false },
  { id: 'p8', tipo: 'Outras Pendências', descricao: 'Funilaria', geraBloqueio: true },
  { id: 'p9', tipo: 'Outras Pendências', descricao: 'Problema Mecânico', geraBloqueio: true },
];