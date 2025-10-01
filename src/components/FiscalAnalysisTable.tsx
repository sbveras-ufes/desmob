import React from 'react';
import { ApprovalVehicle } from '../types/Approval';

interface FiscalAnalysisTableProps {
  vehicles: ApprovalVehicle[];
  paginationComponent: React.ReactNode;
  selectedVehicles?: string[];
  onSelectionChange?: (ids: string[]) => void;
}

const FiscalAnalysisTable: React.FC<FiscalAnalysisTableProps> = ({ vehicles, paginationComponent, selectedVehicles = [], onSelectionChange }) => {

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
      case 'Documentação Aprovada':
        return 'bg-green-100 text-green-800';
      case 'Documentação Pendente':
        return 'bg-red-100 text-red-800';
      case 'Pendente':
         return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ano/Modelo</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">KM</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Diretoria</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CR</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Descrição CR</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pátio Destino</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Local Desmob.</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gerente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cliente</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Residual</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situação</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Situação Análise Fiscal</th>
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
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.placa}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.chassi}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.modelo}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.anoModelo}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.km.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.diretoria}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.cr}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.descricaoCR}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.patioDestino}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.localDesmobilizacao}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.gerente}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.cliente}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.residual.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">{vehicle.situacao}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacaoAnaliseDocumental || 'Pendente')}`}>
                    {vehicle.situacaoAnaliseDocumental || 'Pendente'}
                  </span>
                </td>
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