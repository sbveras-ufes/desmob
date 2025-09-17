import React, { useState } from 'react';
import Header from '../components/Header';
import Breadcrumb from '../components/Breadcrumb';
import FilterPanel from '../components/FilterPanel';
import VehicleTable from '../components/VehicleTable';
import DemobilizationModal from '../components/DemobilizationModal';
import { mockVehicles } from '../data/mockData';
import { useVehicleFilter } from '../hooks/useVehicleFilter';
import { Vehicle, DemobilizationFilters, DemobilizationRequest } from '../types/Vehicle';
import { ApprovalVehicle } from '../types/Approval';

interface DemobilizationPageProps {
  onVehiclesDemobilized: (vehicles: ApprovalVehicle[]) => void;
}

const DemobilizationPage: React.FC<DemobilizationPageProps> = ({ onVehiclesDemobilized }) => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState<DemobilizationFilters>({});

  const filteredVehicles = useVehicleFilter(vehicles, filters);
  const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v.id));

  const handleStartDemobilization = () => {
    if (selectedVehicleIds.length === 0) {
      alert('Selecione pelo menos um veículo para iniciar a desmobilização.');
      return;
    }
    setIsModalOpen(true);
  };

  const handleDemobilizationSubmit = (request: DemobilizationRequest) => {
    // Remove os veículos desmobilizados da lista principal
    const vehicleIds = request.veiculos.map(v => v.id);
    
    // Converte os veículos para o formato de aprovação
    const approvalVehicles: ApprovalVehicle[] = request.veiculos.map(vehicle => ({
      id: vehicle.id,
      placa: vehicle.placa,
      modelo: vehicle.modelo,
      anoModelo: vehicle.anoModelo,
      km: vehicle.km,
      diretoria: vehicle.diretoria,
      cr: vehicle.cr,
      descricaoCR: vehicle.descricaoCR,
      dataPrevista: vehicle.dataPrevista,
      cliente: vehicle.cliente,
      gerente: vehicle.gerente,
      situacao: 'Aguardando aprovação' as const,
      dataSolicitacao: new Date().toISOString(),
      localDesmobilizacao: request.localDesmobilizacao,
      dataEntrega: request.dataEntrega,
      tipoDesmobilizacao: request.tipoDesmobilizacao
    }));
    
    setVehicles(prev => prev.filter(v => !vehicleIds.includes(v.id)));
    
    // Limpa a seleção e fecha o modal
    setSelectedVehicleIds([]);
    setIsModalOpen(false);
    
    // Simula confirmação
    // Adiciona os veículos à lista de aprovação
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
            <h1 className="text-3xl font-bold text-gray-900">Iniciar Desmobilização</h1>
          </div>
          
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

        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{filteredVehicles.length}</span> veículo(s) 
              {selectedVehicleIds.length > 0 && (
                <span className="ml-2">
                  • <span className="font-medium text-blue-600">{selectedVehicleIds.length} selecionado(s)</span>
                </span>
              )}
            </p>
          </div>
          
          <VehicleTable
            vehicles={filteredVehicles}
            selectedVehicles={selectedVehicleIds}
            onSelectionChange={setSelectedVehicleIds}
          />
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