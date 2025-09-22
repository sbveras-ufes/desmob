import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import Header from '../components/Header';
import ApprovalBreadcrumb from '../components/ApprovalBreadcrumb';
import ApprovalFilterPanel from '../components/ApprovalFilterPanel';
import ApprovalTable from '../components/ApprovalTable';
import ReprovationModal from '../components/ReprovationModal';
import JustificationModal from '../components/JustificationModal';
import { useApprovalFilter } from '../hooks/useApprovalFilter';
import { ApprovalVehicle, ApprovalFilters } from '../types/Approval';

interface ApprovalConsultationProps {
  approvalVehicles: ApprovalVehicle[];
  onUpdateVehicles: (vehicles: ApprovalVehicle[]) => void;
}

const ApprovalConsultation: React.FC<ApprovalConsultationProps> = ({ 
  approvalVehicles, 
  onUpdateVehicles 
}) => {
  const [filters, setFilters] = useState<ApprovalFilters>({});
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [isReprovationModalOpen, setIsReprovationModalOpen] = useState(false);
  const [isJustificationModalOpen, setIsJustificationModalOpen] = useState(false);
  const [justificationDetails, setJustificationDetails] = useState('');

  const filteredVehicles = useApprovalFilter(approvalVehicles, filters);
  const selectedVehicles = approvalVehicles.filter(v => selectedVehicleIds.includes(v.id));
  const canApproveReprove = selectedVehicleIds.length > 0 && 
    selectedVehicles.every(v => v.situacao === 'Aguardando aprovação');

  const handleApprove = () => {
    if (selectedVehicleIds.length === 0) return;

    const confirmed = window.confirm(
      `Tem certeza que deseja aprovar a desmobilização de ${selectedVehicleIds.length} veículo(s)?`
    );

    if (confirmed) {
      const updatedVehicles = approvalVehicles.map(vehicle => 
        selectedVehicleIds.includes(vehicle.id)
          ? { ...vehicle, situacao: 'Aprovado' as const }
          : vehicle
      );
      
      onUpdateVehicles(updatedVehicles);
      setSelectedVehicleIds([]);
      
      alert(`${selectedVehicleIds.length} veículo(s) aprovado(s) com sucesso!`);
    }
  };

  const handleReprove = () => {
    if (selectedVehicleIds.length === 0) return;
    setIsReprovationModalOpen(true);
  };

  const handleReprovationSubmit = (justificativa: string) => {
    const updatedVehicles = approvalVehicles.map(vehicle => 
      selectedVehicleIds.includes(vehicle.id)
        ? { 
            ...vehicle, 
            situacao: 'Reprovado' as const,
            justificativaReprovacao: justificativa
          }
        : vehicle
    );
    
    onUpdateVehicles(updatedVehicles);
    setSelectedVehicleIds([]);
    setIsReprovationModalOpen(false);
    
    alert(`${selectedVehicleIds.length} veículo(s) reprovado(s) com sucesso!`);
  };

  const handleShowJustification = (justification?: string) => {
    if (justification) {
      setJustificationDetails(justification);
      setIsJustificationModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ApprovalBreadcrumb />
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold text-gray-900">Aprovação</h1>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleApprove}
              disabled={!canApproveReprove}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                canApproveReprove
                  ? 'bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Check className="h-5 w-5" />
              <span>Aprovar ({selectedVehicleIds.length})</span>
            </button>
            
            <button
              onClick={handleReprove}
              disabled={!canApproveReprove}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-medium transition-colors duration-200 ${
                canApproveReprove
                  ? 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <X className="h-5 w-5" />
              <span>Reprovar ({selectedVehicleIds.length})</span>
            </button>
          </div>
        </div>

        <ApprovalFilterPanel
          filters={filters}
          onFiltersChange={setFilters}
        />

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-700">
              Mostrando <span className="font-medium">{filteredVehicles.length}</span> solicitação(ões) de aprovação
              {selectedVehicleIds.length > 0 && (
                <span className="ml-2">
                  • <span className="font-medium text-blue-600">{selectedVehicleIds.length} selecionado(s)</span>
                </span>
              )}
            </p>
          </div>
          
          <ApprovalTable 
            vehicles={filteredVehicles}
            selectedVehicles={selectedVehicleIds}
            onSelectionChange={setSelectedVehicleIds}
            onShowJustification={handleShowJustification}
          />
        </div>

        <ReprovationModal
          isOpen={isReprovationModalOpen}
          onClose={() => setIsReprovationModalOpen(false)}
          selectedVehicles={selectedVehicles}
          onSubmit={handleReprovationSubmit}
        />

        <JustificationModal
          isOpen={isJustificationModalOpen}
          onClose={() => setIsJustificationModalOpen(false)}
          justification={justificationDetails}
        />
      </main>
    </div>
  );
};

export default ApprovalConsultation;