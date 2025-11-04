import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { ApprovalVehicle, ApprovalFilters } from '../types/Approval';
import AssetDemobilizationBreadcrumb from '../components/AssetDemobilizationBreadcrumb';
import AcompanhamentoDesmobilizacaoTab from '../components/AcompanhamentoDesmobilizacaoTab';
import UpdateTransportModal from '../components/UpdateTransportModal';
import CreateLotModal from '../components/CreateLotModal';
import DocumentAnalysisModal from '../components/DocumentAnalysisModal';
import { mockUsers } from '../data/mockUsers';
import ConcluidosTab from '../components/ConcluidosTab';
import AssetDemobilizationFilterPanel from '../components/AssetDemobilizationFilterPanel';
import { useApprovalFilter } from '../hooks/useApprovalFilter';
import IndicarManutencaoModal from '../components/IndicarManutencaoModal';
import { Pendency } from '../types/Pendency';
import VehicleDetailModal from '../components/VehicleDetailModal';
import AssumeDemobilizationModal from '../components/AssumeDemobilizationModal';

interface AssetDemobilizationManagementPageProps {
  liberatedVehicles: ApprovalVehicle[];
  onUpdateVehicles: (updatedVehicles: ApprovalVehicle[]) => void;
  allVehicles: ApprovalVehicle[];
  pendencies: Pendency[];
}

const getRandomUser = () => {
  const randomIndex = Math.floor(Math.random() * mockUsers.length);
  return mockUsers[randomIndex].nome;
};

const AssetDemobilizationManagementPage: React.FC<AssetDemobilizationManagementPageProps> = ({ liberatedVehicles, onUpdateVehicles, allVehicles, pendencies }) => {
  const [activeTab, setActiveTab] = useState<'acompanhamento' | 'concluidos'>('acompanhamento');
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isUpdateTransportModalOpen, setIsUpdateTransportModalOpen] = useState(false);
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);
  const [isDocumentAnalysisModalOpen, setIsDocumentAnalysisModalOpen] = useState(false);
  const [isIndicarManutencaoModalOpen, setIsIndicarManutencaoModalOpen] = useState(false);
  const [isAssumeModalOpen, setIsAssumeModalOpen] = useState(false); 
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [viewingVehicle, setViewingVehicle] = useState<ApprovalVehicle | null>(null);
  const [filters, setFilters] = useState<ApprovalFilters>({});
  const [crTypeFilter, setCrTypeFilter] = useState<'Todos' | 'Desmobilização' | 'Desativação'>('Todos');

  const filteredLiberatedVehicles = useApprovalFilter(liberatedVehicles, filters);

  const finalLiberatedVehicles = useMemo(() => {
    if (activeTab !== 'acompanhamento') return filteredLiberatedVehicles;

    switch (crTypeFilter) {
      case 'Desmobilização':
        return filteredLiberatedVehicles.filter(v => v.isTransitionCR);
      case 'Desativação':
        return filteredLiberatedVehicles.filter(v => !v.isTransitionCR);
      case 'Todos':
      default:
        return filteredLiberatedVehicles;
    }
  }, [filteredLiberatedVehicles, crTypeFilter, activeTab]);


  const filteredConcluidosVehicles = useApprovalFilter(allVehicles.filter(
    v => v.situacao === 'Reprovado' || v.situacaoAnaliseDocumental === 'Documentação Aprovada' || v.situacaoAnaliseDocumental === 'Documentação Pendente' || v.situacaoAnaliseDocumental === 'Documentação Pendente com Bloqueio'
  ), filters);

  const selectedVehicles = allVehicles.filter(v => selectedVehicleIds.includes(v.id));
  
  const hasBlockedVehicle = useMemo(() => selectedVehicles.some(
    v => v.situacaoAnaliseDocumental === 'Documentação Pendente com Bloqueio' 
    || v.situacaoAnaliseFiscal === 'Análise Pendente com Bloqueio' 
    || v.situacao === 'Em Manutenção'
    || v.situacao === 'Em Andamento'
  ), [selectedVehicles]);

  const canIndicarManutencao = useMemo(() => {
    if (selectedVehicleIds.length === 0) return false;
    return selectedVehicles.every(v => v.situacao !== 'Em Manutenção');
  }, [selectedVehicles, selectedVehicleIds.length]);

  const canConcluirManutencao = useMemo(() => {
    if (selectedVehicleIds.length === 0) return false;
    return selectedVehicles.every(v => v.situacao === 'Em Manutenção');
  }, [selectedVehicles, selectedVehicleIds.length]);

  const canAssume = useMemo(() => {
    if (selectedVehicleIds.length === 0) return false;
    return selectedVehicles.every(v => v.situacao === 'Liberado');
  }, [selectedVehicles, selectedVehicleIds.length]);


  const handleViewVehicle = (vehicle: ApprovalVehicle) => {
    setViewingVehicle(vehicle);
    setIsDetailModalOpen(true);
  };

  const handleUpdateTransport = (updatedData: { dataEntrega: string; patioDestino: string; }) => {
    const randomUserName = getRandomUser();
    const updatedVehicles = allVehicles.map(v =>
      selectedVehicleIds.includes(v.id)
        ? {
            ...v,
            patioDestino: updatedData.patioDestino || v.patioDestino,
            dataEntrega: updatedData.dataEntrega || v.dataEntrega,
            lastUpdated: new Date().toISOString(),
            responsavelAtualizacao: randomUserName
          }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
  };

  const handleCreateLotConfirm = () => {
    const randomUserName = getRandomUser();
    const updatedVehicles = allVehicles.map(v =>
      selectedVehicleIds.includes(v.id)
        ? {
            ...v,
            situacao: 'Liberado para Transferência' as const,
            lastUpdated: new Date().toISOString(),
            responsavelAtualizacao: randomUserName
          }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
    setIsCreateLotModalOpen(false);
  };

  const handleDocumentAnalysisApprove = (observation: string) => {
    const randomUserName = getRandomUser();
    const updatedVehicles = allVehicles.map(v =>
      selectedVehicleIds.includes(v.id)
        ? {
            ...v,
            situacaoAnaliseDocumental: 'Documentação Aprovada' as const,
            observacaoAnaliseDocumental: observation,
            lastUpdated: new Date().toISOString(),
            responsavelAtualizacao: randomUserName
          }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
  };

  const handleDocumentAnalysisPendency = (pendenciesSelection: string[], observation: string) => {
    const randomUserName = getRandomUser();
    const blockingPendencies = pendencies
      .filter(p => pendenciesSelection.includes(p.descricao) && p.geraBloqueio)
      .map(p => p.descricao);
  
    const updatedVehicles = allVehicles.map(v => {
      if (selectedVehicleIds.includes(v.id)) {
        const hasBlocking = blockingPendencies.length > 0;
        return {
          ...v,
          situacaoAnaliseDocumental: hasBlocking ? 'Documentação Pendente com Bloqueio' as const : 'Documentação Pendente' as const,
          tipoPendenciaDocumental: pendenciesSelection,
          observacaoAnaliseDocumental: observation,
          lastUpdated: new Date().toISOString(),
          responsavelAtualizacao: randomUserName
        };
      }
      return v;
    });
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
  };
  
  // Atualizado para receber string[]
  const handleIndicarManutencao = (tiposPendencia: string[]) => {
    const randomUserName = getRandomUser();
    const updatedVehicles = allVehicles.map(v =>
      selectedVehicleIds.includes(v.id)
        ? {
            ...v,
            situacao: 'Em Manutenção' as const,
            tipoPendenciaOutras: tiposPendencia, // Atualizado
            lastUpdated: new Date().toISOString(),
            responsavelAtualizacao: randomUserName
          }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
    setIsIndicarManutencaoModalOpen(false);
  };

  // Atualizado para limpar o novo campo
  const handleConcluirManutencao = () => {
    const randomUserName = getRandomUser();
    const updatedVehicles = allVehicles.map(v =>
      selectedVehicleIds.includes(v.id)
        ? {
            ...v,
            situacao: 'Liberado' as const,
            tipoPendenciaOutras: undefined, // Atualizado
            lastUpdated: new Date().toISOString(),
            responsavelAtualizacao: randomUserName
          }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
    setIsIndicarManutencaoModalOpen(false);
  };

  const handleAssumeDemobilization = () => {
    const randomUserName = getRandomUser();
    const now = new Date().toISOString();

    const updatedVehicles = allVehicles.map(v =>
      selectedVehicleIds.includes(v.id) && v.situacao === 'Liberado'
        ? {
            ...v,
            situacao: 'Em Andamento' as const,
            responsavelAtualizacao: randomUserName, 
            dataResponsavelDesmobilizacao: now, 
            lastUpdated: now, 
          }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
    setIsAssumeModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <AssetDemobilizationBreadcrumb />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Desmobilização de Ativos</h1>
        </div>

        <AssetDemobilizationFilterPanel filters={filters} onFiltersChange={setFilters} />

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
                Acompanhamento Desmobilização
              </button>
              <button
                onClick={() => setActiveTab('concluidos')}
                className={`${
                  activeTab === 'concluidos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Concluídos
              </button>
            </nav>
          </div>
          
          {activeTab === 'acompanhamento' && (
            <>
              <div className="my-4 flex items-center space-x-6">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input type="radio" name="crType" value="Todos" checked={crTypeFilter === 'Todos'} onChange={() => setCrTypeFilter('Todos')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
                  <span className="ml-2">Todos</span>
                </label>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input type="radio" name="crType" value="Desmobilização" checked={crTypeFilter === 'Desmobilização'} onChange={() => setCrTypeFilter('Desmobilização')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
                  <span className="ml-2">Desmobilização</span>
                </label>
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <input type="radio" name="crType" value="Desativação" checked={crTypeFilter === 'Desativação'} onChange={() => setCrTypeFilter('Desativação')} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"/>
                  <span className="ml-2">Desativação</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setIsIndicarManutencaoModalOpen(true)}
                  disabled={selectedVehicleIds.length === 0}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:bg-gray-400"
                >
                  Manutenção
                </button>
                <button
                  onClick={() => setIsAssumeModalOpen(true)}
                  disabled={!canAssume}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400"
                >
                  Assumir Desmobilização
                </button>
                <button
                  onClick={() => setIsUpdateTransportModalOpen(true)}
                  disabled={selectedVehicleIds.length === 0 || hasBlockedVehicle}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Atualizar Transporte
                </button>
                <button
                  onClick={() => setIsDocumentAnalysisModalOpen(true)}
                  disabled={selectedVehicleIds.length === 0}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Checklist Análise Documental
                </button>
                <button
                  onClick={() => setIsCreateLotModalOpen(true)}
                  disabled={selectedVehicleIds.length === 0 || hasBlockedVehicle}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
                >
                  Liberar para criar lote
                </button>
              </div>
            </>
          )}

          {activeTab === 'acompanhamento' &&
            <AcompanhamentoDesmobilizacaoTab
              vehicles={finalLiberatedVehicles}
              selectedVehicleIds={selectedVehicleIds}
              onSelectionChange={setSelectedVehicleIds}
              onViewVehicle={handleViewVehicle}
            />
          }
          {activeTab === 'concluidos' && <ConcluidosTab vehicles={filteredConcluidosVehicles} onViewVehicle={handleViewVehicle} />}
        </div>

        <UpdateTransportModal
          isOpen={isUpdateTransportModalOpen}
          onClose={() => setIsUpdateTransportModalOpen(false)}
          vehicles={selectedVehicles}
          onUpdate={handleUpdateTransport}
        />

        <CreateLotModal
          isOpen={isCreateLotModalOpen}
          onClose={() => setIsCreateLotModalOpen(false)}
          vehicles={selectedVehicles}
          onConfirm={handleCreateLotConfirm}
        />

        <DocumentAnalysisModal
          isOpen={isDocumentAnalysisModalOpen}
          onClose={() => setIsDocumentAnalysisModalOpen(false)}
          vehicles={selectedVehicles}
          onApprove={handleDocumentAnalysisApprove}
          onSignalPendency={handleDocumentAnalysisPendency}
          pendencies={pendencies}
        />
        
        <IndicarManutencaoModal
          isOpen={isIndicarManutencaoModalOpen}
          onClose={() => setIsIndicarManutencaoModalOpen(false)}
          vehicles={selectedVehicles}
          onConfirm={handleIndicarManutencao}
          onConcluirManutencao={handleConcluirManutencao}
          pendencies={pendencies}
        />

        <AssumeDemobilizationModal
          isOpen={isAssumeModalOpen}
          onClose={() => setIsAssumeModalOpen(false)}
          vehicles={selectedVehicles}
          onConfirm={handleAssumeDemobilization}
        />

        <VehicleDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          vehicle={viewingVehicle}
        />
      </main>
    </div>
  );
};

export default AssetDemobilizationManagementPage;