import React, { useState } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FilterPanel from '../components/FilterPanel';
import VehicleTable from '../components/VehicleTable';
import DemobilizationModal from '../components/DemobilizationModal';
import AcompanhamentoTab from '../components/AcompanhamentoTab';
import { mockVehicles } from '../data/mockData';
import { useVehicleFilter } from '../hooks/useVehicleFilter';
import { useApprovalFilter } from '../hooks/useApprovalFilter';
import { Vehicle, DemobilizationFilters, DemobilizationRequest } from '../types/Vehicle';
import { ApprovalVehicle } from '../types/Approval';
import { Download } from 'lucide-react';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

interface DemobilizationPageProps {
  onVehiclesDemobilized: (vehicles: ApprovalVehicle[]) => void;
  demobilizedVehicles: ApprovalVehicle[];
}

const DemobilizationPage: React.FC<DemobilizationPageProps> = ({ onVehiclesDemobilized, demobilizedVehicles }) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'acompanhamento'>('radar');
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<DemobilizationFilters>({});

  const filteredRadarVehicles = useVehicleFilter(vehicles, filters);
  const filteredAcompanhamentoVehicles = useApprovalFilter(demobilizedVehicles, filters as any);
  const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v.id));
  
  const radarPagination = usePagination(filteredRadarVehicles);

  const handleStartDemobilization = () => {
    if (selectedVehicleIds.length === 0) {
      alert('Selecione pelo menos um veículo para iniciar a desmobilização.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleDemobilizationSubmit = (request: Omit<DemobilizationRequest, 'veiculos'> & { veiculos: Vehicle[] }) => {
    const vehicleIds = request.veiculos.map(v => v.id);
    
    const approvalVehicles: ApprovalVehicle[] = request.veiculos.map(vehicle => ({
      ...vehicle,
      situacao: 'Aguardando aprovação' as const,
      dataSolicitacao: new Date().toISOString(),
      localDesmobilizacao: `${request.municipio} - ${request.uf}`,
      dataEntrega: request.dataEntrega,
      patioDestino: request.patioDestino || vehicle.patioDestino,
    }));
    
    setVehicles(prev => prev.filter(v => !vehicleIds.includes(v.id)));
    
    setSelectedVehicleIds([]);
    setIsModalOpen(false);
    
    onVehiclesDemobilized(approvalVehicles);
    
    alert(`Desmobilização solicitada com sucesso para ${request.veiculos.length} veículo(s). As placas estão pendentes de aprovação.`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Desmobilização de Ativos</h1>
          </div>
        </div>

        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          activeTab={activeTab}
        />

        <div>
          <div className="border-b border-gray-200 mt-8">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('radar')}
                className={`${
                  activeTab === 'radar'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Radar Desmobilização
              </button>
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
            </nav>
          </div>
          
          {activeTab === 'radar' && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleStartDemobilization}
                disabled={selectedVehicleIds.length === 0}
                className={`px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                  selectedVehicleIds.length === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                }`}
              >
                Iniciar Desmobilização ({selectedVehicleIds.length})
              </button>
            </div>
          )}


          {activeTab === 'radar' && (
            <div className="mt-4">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-700">
                    Mostrando <span className="font-medium">{radarPagination.endIndex > 0 ? radarPagination.endIndex - radarPagination.startIndex : 0}</span> de <span className="font-medium">{radarPagination.totalItems}</span> veículo(s) 
                    {selectedVehicleIds.length > 0 && (
                      <span className="ml-2">
                        • <span className="font-medium text-blue-600">{selectedVehicleIds.length} selecionado(s)</span>
                      </span>
                    )}
                  </p>
                  {filteredRadarVehicles.length > 0 && (
                     <button className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-sm font-medium">
                        <Download size={16} />
                        <span>Exportar</span>
                    </button>
                  )}
                </div>
                
                <VehicleTable
                  vehicles={radarPagination.paginatedItems}
                  selectedVehicles={selectedVehicleIds}
                  onSelectionChange={setSelectedVehicleIds}
                  paginationComponent={
                    <Pagination
                      {...radarPagination}
                      onItemsPerPageChange={radarPagination.changeItemsPerPage}
                      goToPage={radarPagination.goToPage}
                    />
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 'acompanhamento' && <AcompanhamentoTab vehicles={filteredAcompanhamentoVehicles} />}
        </div>

        <DemobilizationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          selectedVehicles={selectedVehicles}
          onSubmit={handleDemobilizationSubmit}
        />
      </main>
    </div>
  );
};

export default DemobilizationPage;