import React from 'react';
import { ApprovalVehicle } from '../types/Approval';
import AcompanhamentoTable from './AcompanhamentoTable';
import { Download, Upload } from 'lucide-react';
import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';

interface AcompanhamentoDesmobilizacaoTabProps {
  vehicles: ApprovalVehicle[];
  selectedVehicleIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
  onViewVehicle: (vehicle: ApprovalVehicle) => void;
}

const AcompanhamentoDesmobilizacaoTab: React.FC<AcompanhamentoDesmobilizacaoTabProps> = ({ vehicles, selectedVehicleIds, onSelectionChange, onViewVehicle }) => {
  const pagination = usePagination(vehicles);

  return (
    <div className="mt-8">
       <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{pagination.endIndex > 0 ? pagination.endIndex - pagination.startIndex : 0}</span> de <span className="font-medium">{pagination.totalItems}</span> veículo(s)
        </p>
        {vehicles.length > 0 && (
          <div className="flex items-center space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
              <Upload size={16} />
              <span>Importar</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        )}
      </div>
      <AcompanhamentoTable 
        vehicles={pagination.paginatedItems} 
        selectedVehicles={selectedVehicleIds}
        onSelectionChange={onSelectionChange}
        onViewVehicle={onViewVehicle}
        paginationComponent={
          <Pagination 
            {...pagination}
            onItemsPerPageChange={pagination.changeItemsPerPage}
            goToPage={pagination.goToPage}
          />
        }
      />
    </div>
  );
};

export default AcompanhamentoDesmobilizacaoTab;