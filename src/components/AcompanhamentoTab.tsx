import React from 'react';
import { ApprovalVehicle } from '../types/Approval';
import AcompanhamentoTable from './AcompanhamentoTable';

interface AcompanhamentoTabProps {
  vehicles: ApprovalVehicle[];
}

const AcompanhamentoTab: React.FC<AcompanhamentoTabProps> = ({ vehicles }) => {
  return (
    <div className="mt-8">
      <AcompanhamentoTable vehicles={vehicles} />
    </div>
  );
};

export default AcompanhamentoTab;