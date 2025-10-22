export interface Pendency {
  id: string;
  origem: 'Fiscal' | 'Documental';
  descricao: string;
  geraBloqueio: boolean;
}