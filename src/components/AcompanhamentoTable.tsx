import React from 'react';
import { ApprovalVehicle } from '../types/Approval';

interface AcompanhamentoTableProps {
  vehicles: ApprovalVehicle[];
  selectedVehicles?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  paginationComponent?: React.ReactNode;
  showSituacaoAnaliseDocumental?: boolean;
  showSituacaoAnaliseFiscal?: boolean;
  showVistoriaDetails?: boolean;
}

const AcompanhamentoTable: React.FC<AcompanhamentoTableProps> = ({ 
  vehicles, 
  selectedVehicles = [], 
  onSelectionChange, 
  paginationComponent, 
  showSituacaoAnaliseDocumental = false,
  showSituacaoAnaliseFiscal = false,
  showVistoriaDetails = true,
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
      case 'Liberado para Desmobilização':
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
      case 'Desmobilização Bloqueada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatKilometer = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
 return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Desmobilização</th>
              {showSituacaoAnaliseDocumental && (
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Situação Análise Documental
                </th>
              )}
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Pendência Documental</th>
              {showSituacaoAnaliseFiscal && (
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Situação Análise Fiscal
                </th>
              )}
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo Pendência Fiscal</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação da Vistoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da Precificação</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chassi</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano/Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diretoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pátio Destino</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Local Desmob.</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Prevista</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Entrega</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gerente</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residual</th>
              {showVistoriaDetails && (
                <>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pátio de Vistoria</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data da Vistoria</th>
                  <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Classificação da Vistoria</th>
                </>
              )}
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Última Atualização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável pela atualização</th>
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
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.demobilizationCode || '-'}</td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacao)}`}>
                    {vehicle.situacao}
                  </span>
                </td>
                {showSituacaoAnaliseDocumental && (
                  <>
                    <td className="px-2 py-2 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacaoAnaliseDocumental)}`}>
                        {vehicle.situacaoAnaliseDocumental || '-'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-500">
                      {vehicle.tipoPendenciaDocumental?.join(', ') || '-'}
                    </td>
                  </>
                )}
                {showSituacaoAnaliseFiscal && (
                  <>
                    <td className="px-2 py-2 text-sm">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacaoAnaliseFiscal)}`}>
                        {vehicle.situacaoAnaliseFiscal || '-'}
                      </span>
                    </td>
                    <td className="px-2 py-2 text-sm text-gray-500">
                      {vehicle.tipoPendenciaFiscal?.join(', ') || '-'}
                    </td>
                  </>
                )}
              <td className="px-2 py-2 text-sm text-gray-500">{vehicle.situacaoVistoria || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">
                  {vehicle.situacaoVistoria === 'Aprovada' && vehicle.dataPrecificacao 
                    ? new Date(vehicle.dataPrecificacao).toLocaleDateString('pt-BR') 
                    : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.chassi}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.anoModelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatKilometer(vehicle.km)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.diretoria}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.descricaoCR}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.patioDestino}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.localDesmobilizacao}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{new Date(vehicle.dataPrevista).toLocaleDateString('pt-BR')}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{new Date(vehicle.dataEntrega).toLocaleDateString('pt-BR')}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.gerente}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cliente}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatCurrency(vehicle.residual)}</td>
                {showVistoriaDetails && (
                  <>
                    <td className="px-2 py-2 text-sm text-gray-500">{vehicle.patioVistoria || '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-500">{vehicle.dataVistoria ? new Date(vehicle.dataVistoria).toLocaleDateString('pt-BR') : '-'}</td>
                    <td className="px-2 py-2 text-sm text-gray-500">{vehicle.classificacaoVistoria || '-'}</td>
                  </>
                )}
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.lastUpdated ? formatDateTime(vehicle.lastUpdated) : '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.responsavelAtualizacao || '-'}</td>
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