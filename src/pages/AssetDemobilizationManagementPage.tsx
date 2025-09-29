import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import { ApprovalVehicle } from '../types/Approval';
import AssetDemobilizationBreadcrumb from '../components/AssetDemobilizationBreadcrumb';
import AcompanhamentoDesmobilizacaoTab from '../components/AcompanhamentoDesmobilizacaoTab';
import CRTransicaoTab from '../components/CRTransicaoTab';
import UpdateTransportModal from '../components/UpdateTransportModal';
import Pagination from '../components/Pagination';
import ChecklistModal from '../components/ChecklistModal';
import LiberarLoteModal from '../components/LiberarLoteModal';

interface AssetDemobilizationManagementPageProps {
  liberatedVehicles: ApprovalVehicle[];
  onUpdateVehicles: (updatedVehicles: ApprovalVehicle[]) => void;
}

const AssetDemobilizationManagementPage: React.FC<AssetDemobilizationManagementPageProps> = ({ liberatedVehicles, onUpdateVehicles }) => {
  const [activeTab, setActiveTab] = useState<'acompanhamento' | 'cr-transicao'>('acompanhamento');
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isUpdateTransportModalOpen, setIsUpdateTransportModalOpen] = useState(false);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isLiberarLoteModalOpen, setIsLiberarLoteModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return liberatedVehicles.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage, liberatedVehicles]);

  const selectedVehicles = liberatedVehicles.filter(v => selectedVehicleIds.includes(v.id));

  const handleUpdateTransport = (updatedData: { dataEntrega: string; patioDestino: string; }) => {
    const updatedList = liberatedVehicles.map(v => 
      selectedVehicleIds.includes(v.id) 
        ? { 
            ...v, 
            patioDestino: updatedData.patioDestino || v.patioDestino,
            patioVistoria: updatedData.patioDestino || v.patioVistoria, // Atualiza Pátio Vistoria
            dataEntrega: updatedData.dataEntrega || v.dataEntrega,
            lastUpdated: new Date().toISOString() 
          } 
        : v
    );
    onUpdateVehicles(updatedList);
    setSelectedVehicleIds([]);
  };

  const handleChecklistSubmit = (data: { action: 'approve' | 'flag'; pendingTypes: any[]; observations: string; }) => {
    const updatedList = liberatedVehicles.map(v => {
      if (selectedVehicleIds.includes(v.id)) {
        const isFlagAction = data.action === 'flag';
        return {
          ...v,
          tipoPendencia: isFlagAction ? data.pendingTypes : [],
          situacao: isFlagAction ? 'Documentação Pendente' : v.situacao,
          lastUpdated: new Date().toISOString()
        };
      }
      return v;
    });
    onUpdateVehicles(updatedList);
    setSelectedVehicleIds([]);
  };

  const handleLiberarLoteConfirm = () => {
     const updatedList = liberatedVehicles.map(v => 
      selectedVehicleIds.includes(v.id) 
        ? { ...v, situacao: 'Liberado para transferência' as const, lastUpdated: new Date().toISOString() } 
        : v
    );
    onUpdateVehicles(updatedList);
    setSelectedVehicleIds([]);
    setIsLiberarLoteModalOpen(false);
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
                onClick={() => setIsChecklistModalOpen(true)}
                disabled={selectedVehicleIds.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Checklist Análise Documental
              </button>
               <button 
                onClick={() => setIsLiberarLoteModalOpen(true)}
                disabled={selectedVehicleIds.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Liberar para criar lote
              </button>
            </div>
          )}

          {activeTab === 'acompanhamento' && (
            <div className="bg-white rounded-lg shadow-md mt-4">
              <AcompanhamentoDesmobilizacaoTab 
                vehicles={paginatedVehicles} 
                totalVehicles={liberatedVehicles.length}
                selectedVehicleIds={selectedVehicleIds}
                onSelectionChange={setSelectedVehicleIds}
              />
              <Pagination 
                totalItems={liberatedVehicles.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={setItemsPerPage}
              />
            </div>
          )}
          {activeTab === 'cr-transicao' && <CRTransicaoTab />}
        </div>
        
        <UpdateTransportModal 
          isOpen={isUpdateTransportModalOpen}
          onClose={() => setIsUpdateTransportModalOpen(false)}
          vehicles={selectedVehicles}
          onUpdate={handleUpdateTransport}
        />

        <ChecklistModal 
          isOpen={isChecklistModalOpen}
          onClose={() => setIsChecklistModalOpen(false)}
          vehicles={selectedVehicles}
          onSubmit={handleChecklistSubmit}
        />
        
        <LiberarLoteModal
          isOpen={isLiberarLoteModalOpen}
          onClose={() => setIsLiberarLoteModalOpen(false)}
          vehicles={selectedVehicles}
          onConfirm={handleLiberarLoteConfirm}
        />
      </main>
    </div>
  );
};

export default AssetDemobilizationManagementPage;