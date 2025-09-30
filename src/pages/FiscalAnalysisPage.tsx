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
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);

  const acompanhamentoVehicles = vehicles.filter(v => v.situacao === 'Liberado para Desmobilização');
  const concluidasVehicles = vehicles.filter(v => v.situacaoAnaliseDocumental === 'Documentação Aprovada' || v.situacaoAnaliseDocumental === 'Documentação Pendente');


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
              <div>
                <div className="flex justify-end mb-4">
                  <button
                    disabled={selectedVehicleIds.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    Checklist Análise Fiscal
                  </button>
                </div>
                <FiscalAnalysisTable
                  vehicles={acompanhamentoPagination.paginatedItems}
                  selectedVehicles={selectedVehicleIds}
                  onSelectionChange={setSelectedVehicleIds}
                  paginationComponent={
                    <Pagination
                      {...acompanhamentoPagination}
                      onItemsPerPageChange={acompanhamentoPagination.changeItemsPerPage}
                      onPageChange={acompanhamentoPagination.goToPage}
                    />
                  }
                />
              </div>
            )}
            {activeTab === 'concluidas' && (
               <FiscalAnalysisTable
                vehicles={concluidasPagination.paginatedItems}
                selectedVehicles={selectedVehicleIds}
                onSelectionChange={setSelectedVehicleIds}
                paginationComponent={
                  <Pagination
                    {...concluidasPagination}
                    onItemsPerPageChange={concluidasPagination.changeItemsPerPage}
                    onPageChange={concluidasPagination.goToPage}
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