import React from 'react';
import { Eye } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

interface AcompanhamentoTableProps {
  vehicles: ApprovalVehicle[];
  selectedVehicles?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onViewVehicle?: (vehicle: ApprovalVehicle) => void;
  paginationComponent?: React.ReactNode;
}

const AcompanhamentoTable: React.FC<AcompanhamentoTableProps> = ({ 
  vehicles, 
  selectedVehicles = [], 
  onSelectionChange, 
  onViewVehicle,
  paginationComponent, 
}) => {
  const handleSelectAll = (checked: boolean) => {
    onSelectionChange?.(checked ? vehicles.map(v => v.id) : []);
  };

  const handleSelectVehicle = (vehicleId: string, checked: boolean) => {
    onSelectionChange?.(
      checked
        ? [...selectedVehicles, vehicleId]
        : selectedVehicles.filter(id => id !== vehicleId)
    );
  };

  const isAllSelected = vehicles.length > 0 && selectedVehicles.length === vehicles.length;

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
      case 'Em Andamento': // Novo status
        return 'bg-cyan-100 text-cyan-800';
      case 'Documentação Pendente com Bloqueio':
        return 'bg-red-100 text-red-800';
      case 'Análise Pendente com Bloqueio':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoAtivo = (modelo: string) => {
    const isHeavy = modelo.includes('HILUX') || 
                    modelo.includes('RANGER') || 
                    modelo.includes('AMAROK'); // Logic based on useVehicleFilter.ts
    return isHeavy ? 'Pesado' : 'Leve';
  };

  const calculateSlaEstoque = (dataInicioCR?: string) => {
    if (!dataInicioCR) return '-';
    try {
      const start = new Date(dataInicioCR);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} dias`;
    } catch (e) {
      return '-';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      // Adiciona 'T00:00:00' para garantir que a data seja interpretada como local
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

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {onSelectionChange && (
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              <th className="px-2 py-3"></th> {/* Visualizar */}
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código Desmobilização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo do ativo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Implemento</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SLA de estoque</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Desmobilização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Da Vistoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classificação da Vistoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da última Vistoria Aprovada</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da última Precificação</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pátio Atual</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diretoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Pendência Manutenção</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Análise Documental</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Pendência Documental</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Análise Fiscal</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Pendência Fiscal</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pátio Destino</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Prevista</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UF Emplacamento</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável pela Desmobilização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Atualização Responsável pela Desmob</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável Última Alteração</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora Última Alteração</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                {onSelectionChange && (
                  <td className="px-2 py-2 text-sm">
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={(e) => handleSelectVehicle(vehicle.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                )}
                <td className="px-2 py-2 text-sm">
                  <button onClick={() => onViewVehicle?.(vehicle)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100">
                    <Eye size={16} />
                  </button>
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.demobilizationCode || '-'}</td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.anoModelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatKilometer(vehicle.km)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{getTipoAtivo(vehicle.modelo)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">-</td> {/* Implemento */}
                <td className="px-2 py-2 text-sm text-gray-500">{calculateSlaEstoque(vehicle.dataInicioCR)}</td>
                <td className="px-2 py-2 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacao)}`}>
                    {vehicle.situacao}
                  </span>
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.situacaoVistoria || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.classificacaoVistoria || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataVistoria)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataPrecificacao)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.patioVistoria || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.diretoria}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.descricaoCR}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.tipoManutencao || '-'}</td>
                <td className="px-2 py-2 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacaoAnaliseDocumental)}`}>
                    {vehicle.situacaoAnaliseDocumental || '-'}
                  </span>
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">
                  {vehicle.tipoPendenciaDocumental ? vehicle.tipoPendenciaDocumental.join(', ') : '-'}
                </td>
                <td className="px-2 py-2 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacaoAnaliseFiscal)}`}>
                    {vehicle.situacaoAnaliseFiscal || '-'}
                  </span>
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">
                  {vehicle.tipoPendenciaFiscal ? vehicle.tipoPendenciaFiscal.join(', ') : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.patioDestino || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataEntrega)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatDate(vehicle.dataPrevista)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.ufEmplacamento || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.responsavelAtualizacao || '-'}</td> {/* Responsável pela Desmobilização */}
                <td className="px-2 py-2 text-sm text-gray-500">{formatDateTime(vehicle.dataResponsavelDesmobilizacao)}</td> {/* Última Atualização Responsável pela Desmob */}
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.responsavelAtualizacao || '-'}</td> {/* Responsável Última Alteração */}
                <td className="px-2 py-2 text-sm text-gray-500">{formatDateTime(vehicle.lastUpdated)}</td> {/* Data/Hora Última Alteração */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum veículo liberado para desmobilização.</p>
        </div>
      )}
      {paginationComponent}
    </div>
  );
};

export default AcompanhamentoTable;