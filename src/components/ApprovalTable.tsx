import React from 'react';
import { ApprovalVehicle } from '../types/Approval';

interface ApprovalTableProps {
  vehicles: ApprovalVehicle[];
  selectedVehicles: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onShowJustification: (justification?: string) => void;
  paginationComponent?: React.ReactNode;
}

const ApprovalTable: React.FC<ApprovalTableProps> = ({ 
  vehicles, 
  selectedVehicles, 
  onSelectionChange,
  onShowJustification,
  paginationComponent
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const selectableVehicles = vehicles.filter(v => v.situacao === 'Aguardando aprovação');
      onSelectionChange(selectableVehicles.map(v => v.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectVehicle = (vehicleId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedVehicles, vehicleId]);
    } else {
      onSelectionChange(selectedVehicles.filter(id => id !== vehicleId));
    }
  };

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Aguardando aprovação':
        return 'bg-yellow-100 text-yellow-800';
      case 'Liberado para Desmobilização':
        return 'bg-green-100 text-green-800';
      case 'Reprovado':
        return 'bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatKilometer = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const selectableVehicles = vehicles.filter(v => v.situacao === 'Aguardando aprovação');
  const isAllSelected = selectableVehicles.length > 0 && 
    selectableVehicles.every(v => selectedVehicles.includes(v.id));
  const isPartiallySelected = selectedVehicles.length > 0 && 
    !isAllSelected && 
    selectableVehicles.some(v => selectedVehicles.includes(v.id));

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={input => {
                    if (input) input.indeterminate = isPartiallySelected;
                  }}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={selectableVehicles.length === 0}
                />
              </th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chassi</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ano/Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">KM</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diretoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Prevista</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gerente</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residual</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Situação</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle, index) => (
              <tr 
                key={vehicle.id}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-2 py-2 text-sm">
                  {vehicle.situacao === 'Aguardando aprovação' ? (
                    <input
                      type="checkbox"
                      checked={selectedVehicles.includes(vehicle.id)}
                      onChange={(e) => handleSelectVehicle(vehicle.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <div className="h-4 w-4"></div>
                  )}
                </td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.demobilizationCode || '-'}</td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.chassi}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.anoModelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatKilometer(vehicle.km)}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.diretoria}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{new Date(vehicle.dataPrevista).toLocaleDateString('pt-BR')}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cliente}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.gerente}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{formatCurrency(vehicle.residual)}</td>
                <td className="px-2 py-2 text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacao)}`}
                    onClick={() => vehicle.situacao === 'Reprovado' && onShowJustification(vehicle.justificativaReprovacao)}
                  >
                    {vehicle.situacao}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {vehicles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhuma solicitação de aprovação encontrada</p>
        </div>
      )}
      {paginationComponent}
    </div>
  );
};

export default ApprovalTable;