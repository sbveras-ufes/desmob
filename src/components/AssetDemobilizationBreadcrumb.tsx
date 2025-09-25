import React from 'react';
import { ChevronRight } from 'lucide-react';

const AssetDemobilizationBreadcrumb: React.FC = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <span className="hover:text-blue-600 cursor-pointer">Início</span>
      <ChevronRight className="h-4 w-4" />
      <span className="font-semibold text-gray-900">Gestão de Desmobilização de Ativos</span>
    </nav>
  );
};

export default AssetDemobilizationBreadcrumb;