import React, { useState } from 'react';
import Header from '../components/Header';
import { ApprovalVehicle } from '../types/Approval';
import AssetDemobilizationBreadcrumb from '../components/AssetDemobilizationBreadcrumb';
import AcompanhamentoDesmobilizacaoTab from '../components/AcompanhamentoDesmobilizacaoTab';
import CRTransicaoTab from '../components/CRTransicaoTab';
import UpdateTransportModal from '../components/UpdateTransportModal';

interface AssetDemobilizationManagementPageProps {
  liberatedVehicles: ApprovalVehicle[];
  onUpdateVehicles: (updatedVehicles: ApprovalVehicle[]) => void;
}

const AssetDemobilizationManagementPage: React.FC<AssetDemobilizationManagementPageProps> = ({ liberatedVehicles, onUpdateVehicles }) => {
  const [activeTab, setActiveTab] = useState<'acompanhamento' | 'cr-transicao'>('acompanhamento');
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isUpdateTransportModalOpen, setIsUpdateTransportModalOpen] = useState(false);

  const selectedVehicles = liberatedVehicles.filter(v => selectedVehicleIds.includes(v.id));

  const handleUpdateTransport = (updatedData: { dataEntrega: string; patioDestino: string; patioVistoria: string }) => {
    const updatedVehicles = liberatedVehicles.map(v => 
      selectedVehicleIds.includes(v.id) 
        ? { ...v, ...updatedData, lastUpdated: new Date().toISOString() } 
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
          {activeTab === 'acompanhamento' && (
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsUpdateTransportModalOpen(true)}
                disabled={selectedVehicleIds.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Atualizar Transporte
              </button>
              <button 
                disabled={selectedVehicleIds.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
              >
                Checklist Análise Documental
              </button>
            </div>
          )}
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

          {activeTab === 'acompanhamento' && 
            <AcompanhamentoDesmobilizacaoTab 
              vehicles={liberatedVehicles} 
              selectedVehicleIds={selectedVehicleIds}
              onSelectionChange={setSelectedVehicleIds}
            />
          }
          {activeTab === 'cr-transicao' && <CRTransicaoTab />}
        </div>
        
        <UpdateTransportModal 
          isOpen={isUpdateTransportModalOpen}
          onClose={() => setIsUpdateTransportModalOpen(false)}
          vehicles={selectedVehicles}
          onUpdate={handleUpdateTransport}
        />
      </main>
    </div>
  );
};

export default AssetDemobilizationManagementPage;