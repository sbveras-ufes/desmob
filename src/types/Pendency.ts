export interface Pendency {
  id: string;
  origem: 'Fiscal' | 'Documental' | 'Manutenção';
  descricao: string;
  geraBloqueio: boolean;
}