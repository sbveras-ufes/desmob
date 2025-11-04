import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DemobilizationPage from './pages/DemobilizationPage';
import ApprovalConsultation from './pages/ApprovalConsultation';
import AssetDemobilizationManagementPage from './pages/AssetDemobilizationManagementPage';
import FiscalAnalysisPage from './pages/FiscalAnalysisPage';
import PendencyManagementPage from './pages/PendencyManagementPage';
import FlowManagementPage from './pages/FlowManagementPage'; // Renomeado
import { mockApprovals } from './data/mockApprovals';
import { ApprovalVehicle } from './types/Approval';
import { Pendency } from './types/Pendency';
import { mockPendencies } from './data/mockPendencies';

function App() {
  const [approvalVehicles, setApprovalVehicles] = useState<ApprovalVehicle[]>(mockApprovals);
  const [pendencies, setPendencies] = useState<Pendency[]>(mockPendencies);

  const handleDemobilization = (vehicles: ApprovalVehicle[]) => {
    setApprovalVehicles(prev => [...prev, ...vehicles]);
  };

  const handleUpdateApprovals = (updatedVehicles: ApprovalVehicle[]) => {
    setApprovalVehicles(updatedVehicles);
  };
  
  const handleUpdatePendencies = (updatedPendencies: Pendency[]) => {
    setPendencies(updatedPendencies);
  };

  // Filtro atualizado para incluir 'Em Andamento'
  const liberatedVehicles = approvalVehicles.filter(
    v => (
      v.situacao === 'Liberado' || 
      v.situacao === 'Liberado para Transferência' || 
      v.situacao === 'Em Manutenção' ||
      v.situacao === 'Em Andamento' // Adicionado
    ) 
    && v.situacaoAnaliseDocumental !== 'Documentação Aprovada'
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/demobilization" />} />
        <Route 
          path="/demobilization" 
          element={
            <DemobilizationPage 
              onVehiclesDemobilized={handleDemobilization} 
              demobilizedVehicles={approvalVehicles.filter(v => v.situacao === 'Aguardando aprovação')} 
            />
          } 
        />
        <Route 
          path="/approval" 
          element={
            <ApprovalConsultation 
              approvalVehicles={approvalVehicles} 
              onUpdateVehicles={handleUpdateApprovals} 
            />
          } 
        />
        <Route 
          path="/asset-demobilization" 
          element={
            <AssetDemobilizationManagementPage 
              liberatedVehicles={liberatedVehicles} 
              onUpdateVehicles={handleUpdateApprovals}
              allVehicles={approvalVehicles}
              pendencies={pendencies}
            />
          } 
        />
        <Route 
          path="/fiscal-analysis"
          element={
            <FiscalAnalysisPage 
              vehicles={approvalVehicles} 
              onUpdateVehicles={handleUpdateApprovals}
              pendencies={pendencies}
            />
          }
        />
        <Route
          path="/pendency-management"
          element={
            <PendencyManagementPage
              pendencies={pendencies}
              onUpdatePendencies={handleUpdatePendencies}
            />
          }
        />
        <Route
          path="/flow-management"
          element={<FlowManagementPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;