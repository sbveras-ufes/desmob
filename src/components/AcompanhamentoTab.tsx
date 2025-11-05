import React from 'react';
import { ApprovalVehicle } from '../types/Approval';
import DemobilizacaoAcompanhamentoTable from './DemobilizacaoAcompanhamentoTable'; // Alterado
import { Download, Upload } from 'lucide-react';
import { usePagination } from '../hooks/usePagination';
import Pagination from './Pagination';

interface AcompanhamentoTabProps {
  vehicles: ApprovalVehicle[];
}

const AcompanhamentoTab: React.FC<AcompanhamentoTabProps> = ({ vehicles }) => {
  const pagination = usePagination(vehicles);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-700">
          Mostrando <span className="font-medium">{pagination.endIndex > 0 ? pagination.endIndex - pagination.startIndex : 0}</span> de <span className="font-medium">{pagination.totalItems}</span> veículo(s) em acompanhamento
        </p>
        {vehicles.length > 0 && (
          <div className="flex items-center space-x-2">
            
            <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
              <Download size={16} />
              <span>Exportar</span>
            </button>
          </div>
        )}
      </div>
      {/* Alterado para usar o novo componente de tabela */}
      <DemobilizacaoAcompanhamentoTable 
        vehicles={pagination.paginatedItems}
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

export default AcompanhamentoTab;