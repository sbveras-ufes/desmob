import React, { useState } from 'react';
import Header from '../components/Header';
import FiscalAnalysisBreadcrumb from '../components/FiscalAnalysisBreadcrumb';
import { ApprovalVehicle } from '../types/Approval';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import FiscalAnalysisTable from '../components/FiscalAnalysisTable';

interface FiscalAnalysisPageProps {
  vehicles: ApprovalVehicle[];
}

const FiscalAnalysisPage: React.FC<FiscalAnalysisPageProps> = ({ vehicles }) => {
  const [activeTab, setActiveTab] = useState<'acompanhamento' | 'concluidas'>('acompanhamento');

  const acompanhamentoVehicles = vehicles.filter(v => v.situacao === 'Liberado para Desmobilização');
  const concluidasVehicles = vehicles.filter(v => v.situacaoAnaliseFiscal === 'Documentação Aprovada' || v.situacaoAnaliseFiscal === 'Documentação Pendente');


  const acompanhamentoPagination = usePagination(acompanhamentoVehicles);
  const concluidasPagination = usePagination(concluidasVehicles);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FiscalAnalysisBreadcrumb />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Análise Fiscal</h1>
        </div>

        <div>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('acompanhamento')}
                className={`${
                  activeTab === 'acompanhamento'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Acompanhamento
              </button>
              <button
                onClick={() => setActiveTab('concluidas')}
                className={`${
                  activeTab === 'concluidas'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Concluídas
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'acompanhamento' && (
              <FiscalAnalysisTable
                vehicles={acompanhamentoPagination.paginatedItems}
                paginationComponent={
                  <Pagination
                    {...acompanhamentoPagination}
                    onItemsPerPageChange={acompanhamentoPagination.changeItemsPerPage}
                  />
                }
              />
            )}
            {activeTab === 'concluidas' && (
               <FiscalAnalysisTable
                vehicles={concluidasPagination.paginatedItems}
                paginationComponent={
                  <Pagination
                    {...concluidasPagination}
                    onItemsPerPageChange={concluidasPagination.changeItemsPerPage}
                  />
                }
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FiscalAnalysisPage;