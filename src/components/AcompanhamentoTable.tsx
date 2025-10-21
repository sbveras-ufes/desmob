import React from 'react';
import { Eye } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';

interface AcompanhamentoTableProps {
  vehicles: ApprovalVehicle[];
  selectedVehicles?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
  onViewVehicle?: (vehicle: ApprovalVehicle) => void; // Prop necessária
  paginationComponent?: React.ReactNode;
  showSituacaoAnaliseDocumental?: boolean;
  showSituacaoAnaliseFiscal?: boolean;
  showVistoriaDetails?: boolean;
}

const AcompanhamentoTable: React.FC<AcompanhamentoTableProps> = ({ 
  vehicles, 
  selectedVehicles = [], 
  onSelectionChange, 
  onViewVehicle, // Recebendo a prop
  paginationComponent, 
  showSituacaoAnaliseDocumental = false,
  showSituacaoAnaliseFiscal = false,
  showVistoriaDetails = true,
}) => {
  // ... (outras funções)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Coluna para o ícone de olho */}
              <th className="px-2 py-3"></th> 
              {onSelectionChange && (
                <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    // ... (checkbox props)
                  />
                </th>
              )}
              {/* ... (outros cabeçalhos) */}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="hover:bg-gray-50">
                {/* Célula com o botão de olho */}
                <td className="px-2 py-2 text-sm">
                  <button onClick={() => onViewVehicle?.(vehicle)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100">
                    <Eye size={16} />
                  </button>
                </td>
                {onSelectionChange && (
                  <td className="px-2 py-2 text-sm">
                    <input
                      type="checkbox"
                      // ... (checkbox props)
                    />
                  </td>
                )}
                {/* ... (outras células) */}
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

export default AcompanhamentoTable;