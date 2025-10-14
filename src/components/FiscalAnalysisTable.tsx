import React, { useState } from 'react';
import Header from '../components/Header';
import FiscalAnalysisBreadcrumb from '../components/FiscalAnalysisBreadcrumb';
import { ApprovalVehicle, ApprovalFilters } from '../types/Approval';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import FiscalAnalysisTable from '../components/FiscalAnalysisTable';
import FiscalAnalysisModal from '../components/FiscalAnalysisModal';
import { mockUsers } from '../data/mockUsers';
import { useApprovalFilter } from '../hooks/useApprovalFilter';
import FiscalAnalysisFilterPanel from '../components/FiscalAnalysisFilterPanel';
import { Pendency } from '../types/Pendency';

interface FiscalAnalysisPageProps {
  vehicles: ApprovalVehicle[];
  onUpdateVehicles: (vehicles: ApprovalVehicle[]) => void;
  pendencies: Pendency[];
}

const getRandomUser = () => {
  const randomIndex = Math.floor(Math.random() * mockUsers.length);
  return mockUsers[randomIndex].nome;
};

const FiscalAnalysisPage: React.FC<FiscalAnalysisPageProps> = ({ vehicles, onUpdateVehicles, pendencies }) => {
  const [activeTab, setActiveTab] = useState<'acompanhamento' | 'concluidas'>('acompanhamento');
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<ApprovalFilters>({});

  // Lógica de filtro atualizada
  const acompanhamentoVehicles = vehicles.filter(v => 
    v.situacao === 'Liberado para Desmobilização' && v.situacaoAnaliseFiscal !== 'Aprovada'
  );
  const concluidasVehicles = vehicles.filter(v => v.situacaoAnaliseFiscal === 'Aprovada');
  
  const filteredAcompanhamento = useApprovalFilter(acompanhamentoVehicles, filters);
  const filteredConcluidas = useApprovalFilter(concluidasVehicles, filters);

  const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v.id));

  const handleApprove = (observation: string) => {
    const randomUserName = getRandomUser();
    const updatedVehicles = vehicles.map(v => 
      selectedVehicleIds.includes(v.id)
        ? { ...v, situacaoAnaliseFiscal: 'Aprovada' as const, observacaoAnaliseFiscal: observation, lastUpdated: new Date().toISOString(), responsavelAtualizacao: randomUserName }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
  };
  
  const handleSignalPendency = (pendenciesSelection: string[], observation: string) => {
    const randomUserName = getRandomUser();
    const blockingPendencies = pendencies
      .filter(p => pendenciesSelection.includes(p.descricao) && p.geraBloqueio)
      .map(p => p.descricao);

    const updatedVehicles = vehicles.map(v => {
      if (selectedVehicleIds.includes(v.id)) {
        const hasBlocking = blockingPendencies.length > 0;
        return {
          ...v,
          situacao: hasBlocking ? 'Desmobilização Bloqueada' as const : v.situacao,
          situacaoAnaliseFiscal: 'Pendente' as const,
          tipoPendencia: pendenciesSelection,
          observacaoAnaliseFiscal: observation,
          lastUpdated: new Date().toISOString(),
          responsavelAtualizacao: randomUserName,
        };
      }
      return v;
    });
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
  };

  const acompanhamentoPagination = usePagination(filteredAcompanhamento);
  const concluidasPagination = usePagination(filteredConcluidas);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FiscalAnalysisBreadcrumb />
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Análise Fiscal</h1>
        </div>

        <FiscalAnalysisFilterPanel filters={filters} onFiltersChange={setFilters} />

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
                    onClick={() => setIsModalOpen(true)}
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
                      goToPage={acompanhamentoPagination.goToPage}
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
                    goToPage={concluidasPagination.goToPage}
                  />
                }
              />
            )}
          </div>
        </div>
        <FiscalAnalysisModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          vehicles={selectedVehicles}
          onApprove={handleApprove}
          onSignalPendency={handleSignalPendency}
          pendencies={pendencies}
        />
      </main>
    </div>
  );
};

export default FiscalAnalysisPage;