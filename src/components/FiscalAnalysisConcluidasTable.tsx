import React from 'react'; // Removido: useState, useRef, useEffect
import { ApprovalVehicle } from '../types/Approval';
import { Eye } from 'lucide-react'; // Removido: MoreVertical, Edit. Adicionado: Eye

interface FiscalAnalysisConcluidasTableProps {
  vehicles: ApprovalVehicle[];
  paginationComponent: React.ReactNode;
  onViewVehicle: (vehicle: ApprovalVehicle) => void;
  // Removida prop: onEditVehicle
}

// Removido componente ActionsMenu

const FiscalAnalysisConcluidasTable: React.FC<FiscalAnalysisConcluidasTableProps> = ({ 
  vehicles, 
  paginationComponent, 
  onViewVehicle, 
}) => {
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Coluna Ações substituída por coluna de ícone */}
              <th className="px-2 py-3"></th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Placa</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diretoria</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número CR</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UF de Emplacamento</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CNPJ Proprietário</th>
              <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Empresa Proprietária</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {vehicles.map((vehicle, index) => (
              <tr 
                key={vehicle.id}
                className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                {/* Coluna Ações substituída por ícone */}
                <td className="px-2 py-2 text-sm">
                  <button onClick={() => onViewVehicle(vehicle)} className="text-gray-500 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100">
                    <Eye size={16} />
                  </button>
                </td>
                <td className="px-2 py-2 text-sm font-medium text-gray-900">{vehicle.placa}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.modelo}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.diretoria}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cr}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.ufEmplacamento || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.cnpjProprietario || '-'}</td>
                <td className="px-2 py-2 text-sm text-gray-500">{vehicle.empresaProprietaria || '-'}</td>
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

export default FiscalAnalysisConcluidasTable;