import React from 'react';
import { ApprovalVehicle } from '../types/Approval';

interface AcompanhamentoTableProps {
  vehicles: ApprovalVehicle[];
  selectedVehicles: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const AcompanhamentoTable: React.FC<AcompanhamentoTableProps> = ({ vehicles, selectedVehicles, onSelectionChange }) => {
  const handleSelectAll = (checked: boolean) => {
    onSelectionChange(checked ? vehicles.map(v => v.id) : []);
  };

  const handleSelectVehicle = (vehicleId: string, checked: boolean) => {
    onSelectionChange(
      checked 
        ? [...selectedVehicles, vehicleId] 
        : selectedVehicles.filter(id => id !== vehicleId)
    );
  };
  
  const isAllSelected = vehicles.length > 0 && selectedVehicles.length === vehicles.length;

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case 'Liberado para Desmobilização':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatKilometer = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  const formatDateTime = (dateString: string) => new Date(dateString).toLocaleString('pt-BR');

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
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              {/* ... other headers ... */}
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Situação
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle, index) => (
              <tr
                key={vehicle.id}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-2 py-2 text-sm">
                   <input
                    type="checkbox"
                    checked={selectedVehicles.includes(vehicle.id)}
                    onChange={(e) => handleSelectVehicle(vehicle.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.chassi}</td>
                {/* ... other cells ... */}
                <td className="px-2 py-2 text-sm">
                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getSituacaoColor(vehicle.situacao)}`}>
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
          <p className="text-gray-500">Nenhum veículo liberado para desmobilização.</p>
        </div>
      )}
    </div>
  );
};

export default AcompanhamentoTable;