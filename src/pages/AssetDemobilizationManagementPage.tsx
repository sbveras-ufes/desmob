import React, { useState } from 'react';
import Header from '../components/Header';
import { ApprovalVehicle } from '../types/Approval';
import AssetDemobilizationBreadcrumb from '../components/AssetDemobilizationBreadcrumb';
import AcompanhamentoDesmobilizacaoTab from '../components/AcompanhamentoDesmobilizacaoTab';
import CRTransicaoTab from '../components/CRTransicaoTab';
import UpdateTransportModal from '../components/UpdateTransportModal';
import CreateLotModal from '../components/CreateLotModal';
import DocumentAnalysisModal from '../components/DocumentAnalysisModal'; 
import { mockUsers } from '../data/mockUsers';

interface AssetDemobilizationManagementPageProps {
  liberatedVehicles: ApprovalVehicle[];
  onUpdateVehicles: (updatedVehicles: ApprovalVehicle[]) => void;
}

const getRandomUser = () => {
  const randomIndex = Math.floor(Math.random() * mockUsers.length);
  return mockUsers[randomIndex].nome;
};

const AssetDemobilizationManagementPage: React.FC<AssetDemobilizationManagementPageProps> = ({ liberatedVehicles, onUpdateVehicles }) => {
  const [activeTab, setActiveTab] = useState<'acompanhamento' | 'cr-transicao'>('acompanhamento');
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isUpdateTransportModalOpen, setIsUpdateTransportModalOpen] = useState(false);
  const [isCreateLotModalOpen, setIsCreateLotModalOpen] = useState(false);
  const [isDocumentAnalysisModalOpen, setIsDocumentAnalysisModalOpen] = useState(false); 

  const selectedVehicles = liberatedVehicles.filter(v => selectedVehicleIds.includes(v.id));

  const transitionCRVehicles = liberatedVehicles.filter(
    v => v.situacao === 'Liberado para Desmobilização' && v.isTransitionCR
  );

  const handleUpdateTransport = (updatedData: { dataEntrega: string; patioDestino: string; }) => {
    const randomUserName = getRandomUser();
    const updatedVehicles = liberatedVehicles.map(v =>
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
    const updatedVehicles = liberatedVehicles.map(v =>
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
    const updatedVehicles = liberatedVehicles.map(v =>
      selectedVehicleIds.includes(v.id)
        ? {
            ...v,
            situacaoAnaliseFiscal: 'Aprovada' as const,
            observacaoAnaliseFiscal: observation,
            lastUpdated: new Date().toISOString(),
            responsavelAtualizacao: randomUserName
          }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
  };

  const handleDocumentAnalysisPendency = (pendencies: string[], observation: string) => {
    const randomUserName = getRandomUser();
    const updatedVehicles = liberatedVehicles.map(v =>
      selectedVehicleIds.includes(v.id)
        ? {
            ...v,
            situacaoAnaliseFiscal: 'Pendente' as const,
            tipoPendencia: pendencies,
            observacaoAnaliseFiscal: observation,
            lastUpdated: new Date().toISOString(),
            responsavelAtualizacao: randomUserName
          }
        : v
    );
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AssetDemobilizationBreadcrumb />

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestão de Desmobilização de Ativos</h1>
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
                Acompanhamento Desmobilização
              </button>
              <button
                onClick={() => setActiveTab('cr-transicao')}
                className={`${
                  activeTab === 'cr-transicao'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                CR de Transição
              </button>
            </nav>
          </div>

          {activeTab === 'acompanhamento' && (
            <div className="flex justify-end space-x-3 mt-4">
              <button
                onClick={() => setIsUpdateTransportModalOpen(true)}
                disabled={selectedVehicleIds.length === 0}
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
                disabled={selectedVehicleIds.length === 0}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
              >
                Liberar para criar lote
              </button>
            </div>
          )}

          {activeTab === 'acompanhamento' &&
            <AcompanhamentoDesmobilizacaoTab
              vehicles={liberatedVehicles}
              selectedVehicleIds={selectedVehicleIds}
              onSelectionChange={setSelectedVehicleIds}
            />
          }
          {activeTab === 'cr-transicao' && <CRTransicaoTab vehicles={transitionCRVehicles} />}
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
        />
      </main>
    </div>
  );
};

export default AssetDemobilizationManagementPage;