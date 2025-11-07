import React from 'react';
import { ApprovalVehicle } from '../types/Approval';

interface DemobilizacaoAcompanhamentoTableProps {
  vehicles: ApprovalVehicle[];
  paginationComponent?: React.ReactNode;
}

const DemobilizacaoAcompanhamentoTable: React.FC<DemobilizacaoAcompanhamentoTableProps> = ({ 
  vehicles, 
  paginationComponent, 
}) => {

  const getSituacaoColor = (situacao?: string) => {
    switch (situacao) {
      case 'Aguardando aprovação':
        return 'bg-yellow-100 text-yellow-800';
      case 'Liberado':
        return 'bg-green-100 text-green-800';
      case 'Reprovado':
        return 'bg-red-100 text-red-800';
      case 'Liberado para Transferência':
        return 'bg-blue-100 text-blue-800';
      case 'Documentação Aprovada':
        return 'bg-green-100 text-green-800';
      case 'Documentação Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Aprovada':
        return 'bg-green-100 text-green-800';
      case 'Pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Em Manutenção':
        return 'bg-purple-100 text-purple-800';
      case 'Em Andamento': 
        return 'bg-cyan-100 text-cyan-800';
      case 'Documentação Pendente com Bloqueio':
        return 'bg-red-100 text-red-800';
      case 'Análise Pendente com Bloqueio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('pt-BR');
    } catch (e) {
      return '-';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    } catch (e) {
      return '-';
    }
  };

  const formatKilometer = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Desmobilização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Desmobilização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Analise Fiscal</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de pendência Fiscal</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Análise Documental</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de pendência Documental</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Pendência (Outras)</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chassi</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano/Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diretoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Desmobilização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Prevista</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gerente</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residual</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/ hora atualização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável pela Atualização</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.demobilizationCode || '-'}</td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacao)}`}>
                    {vehicle.situacao}
                  </span>
                </td>
                <td className="px-2 py-2 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacaoAnaliseFiscal)}`}>
                    {vehicle.situacaoAnaliseFiscal || '-'}
                  </span>
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">
                  {vehicle.pendenciasFiscais ? vehicle.pendenciasFiscais.map(p => p.descricao).join(', ') : '-'}
                </td>
                <td className="px-2 py-2 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacaoAnaliseDocumental)}`}>
                    {vehicle.situacaoAnaliseDocumental || '-'}
                  </span>
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">
                  {vehicle.pendenciasDocumentais ? vehicle.pendenciasDocumentais.map(p => p.descricao).join(', ') : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">
                  {vehicle.pendenciasOutras ? vehicle.pendenciasOutras.map(p => p.descricao).join(', ') : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.chassi}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.anoModelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatKilometer(vehicle.km)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.diretoria}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.descricaoCR}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.tipoDesmobilizacao}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataPrevista)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataEntrega)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.gerente}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cliente}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatCurrency(vehicle.residual)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDateTime(vehicle.lastUpdated)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.responsavelAtualizacao || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum veículo em acompanhamento.</p>
        </div>
      )}
      {paginationComponent}
    </div>
  );
};

export default DemobilizacaoAcompanhamentoTable;