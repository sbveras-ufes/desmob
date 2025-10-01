import React from 'react';
import { ChevronRight } from 'lucide-react';

const FiscalAnalysisBreadcrumb: React.FC = () => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      <span className="hover:text-blue-600 cursor-pointer">Início</span>
       <ChevronRight className="h-4 w-4" />

      <span className="hover:text-blue-600 cursor-pointer">Operacional</span>
      
      <ChevronRight className="h-4 w-4" />
      <span className="font-semibold text-gray-900">Análise Fiscal</span>
    </nav>
  );
};

export default FiscalAnalysisBreadcrumb;