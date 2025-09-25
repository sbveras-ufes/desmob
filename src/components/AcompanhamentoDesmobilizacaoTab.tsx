import React from 'react';
import { ApprovalVehicle } from '../types/Approval';
import AcompanhamentoTable from './AcompanhamentoTable';

interface AcompanhamentoDesmobilizacaoTabProps {
  vehicles: ApprovalVehicle[];
}

const AcompanhamentoDesmobilizacaoTab: React.FC<AcompanhamentoDesmobilizacaoTabProps> = ({ vehicles }) => {
  return (
    <div className="mt-8">
      <AcompanhamentoTable vehicles={vehicles} />
    </div>
  );
};

export default AcompanhamentoDesmobilizacaoTab;