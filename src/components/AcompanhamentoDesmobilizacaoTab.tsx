import React from 'react';
import { ApprovalVehicle } from '../types/Approval';
import AcompanhamentoTable from './AcompanhamentoTable';
import { Download } from 'lucide-react';

interface AcompanhamentoDesmobilizacaoTabProps {
  vehicles: ApprovalVehicle[];
  totalVehicles: number;
  selectedVehicleIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const AcompanhamentoDesmobilizacaoTab: React.FC<AcompanhamentoDesmobilizacaoTabProps> = ({ vehicles, totalVehicles, selectedVehicleIds, onSelectionChange }) => {
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4 px-4">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{vehicles.length}</span> de <span className="font-medium">{totalVehicles}</span> veículo(s)
        </p>
        {vehicles.length > 0 && (
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
            <Download size={16} />
            <span>Exportar</span>
          </button>
        )}
      </div>
      <AcompanhamentoTable 
        vehicles={vehicles} 
        selectedVehicles={selectedVehicleIds}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
};

export default AcompanhamentoDesmobilizacaoTab;