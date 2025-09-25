import React from 'react';
import { ApprovalVehicle } from '../types/Approval';
import AcompanhamentoTable from './AcompanhamentoTable';

interface AcompanhamentoDesmobilizacaoTabProps {
  vehicles: ApprovalVehicle[];
  selectedVehicleIds: string[];
  onSelectionChange: (selectedIds: string[]) => void;
}

const AcompanhamentoDesmobilizacaoTab: React.FC<AcompanhamentoDesmobilizacaoTabProps> = ({ vehicles, selectedVehicleIds, onSelectionChange }) => {
  return (
    <div className="mt-8">
      <AcompanhamentoTable 
        vehicles={vehicles} 
        selectedVehicles={selectedVehicleIds}
        onSelectionChange={onSelectionChange}
      />
    </div>
  );
};

export default AcompanhamentoDesmobilizacaoTab;