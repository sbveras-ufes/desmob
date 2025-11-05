import React from 'react'; // Removido: useState, useRef, useEffect
import { ApprovalVehicle } from '../types/Approval';
import { Eye } from 'lucide-react'; // Removido: MoreVertical, Edit. Adicionado: Eye

interface FiscalAnalysisTableProps {
  vehicles: ApprovalVehicle[];
  paginationComponent: React.ReactNode;
  selectedVehicles?: string[];
  onSelectionChange?: (ids: string[]) => void;
  onViewVehicle: (vehicle: ApprovalVehicle) => void;
  // Removida prop: onEditVehicle
}

// Removido componente ActionsMenu

const FiscalAnalysisTable: React.FC<FiscalAnalysisTableProps> = ({ vehicles, paginationComponent, selectedVehicles = [], onSelectionChange, onViewVehicle }) => {

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

  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
  });
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
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
              {/* Coluna Ações substituída por coluna de ícone */}
              <th className="px-2 py-3"></th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação Análise Fiscal</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo de Pendência</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diretoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UF de Emplacamento</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pátio Atual</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UF de Origem</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ Proprietário</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa Proprietária</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável Última Atualização</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data/Hora Última Atualização</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle, index) => (
              <tr 
                key={vehicle.id}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
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
                {/* Coluna Ações substituída por ícone */}
                <td className="px-2 py-2 text-sm">
                  <button onClick={() => onViewVehicle(vehicle)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100">
                    <Eye size={16} />
                  </button>
                </td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                <td className="px-2 py-2 text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacaoAnaliseFiscal)}`}>
                    {vehicle.situacaoAnaliseFiscal || '-'}
                  </span>
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">
                  {vehicle.tipoPendenciaFiscal && vehicle.tipoPendenciaFiscal.length > 0 ? vehicle.tipoPendenciaFiscal.join(', ') : '-'}
                </td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.diretoria}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.ufEmplacamento || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.patioDestino}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.uf || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cnpjProprietario || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.empresaProprietaria || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.demobilizationCode || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.responsavelAtualizacao || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.lastUpdated ? formatDateTime(vehicle.lastUpdated) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
       {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum veículo encontrado.</p>
        </div>
      )}
      {paginationComponent}
    </div>
  );
};

export default FiscalAnalysisTable;