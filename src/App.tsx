import React, { useState } from 'react';
import UserManagement from './pages/UserManagement';
import DemobilizationPage from './pages/DemobilizationPage';
import ApprovalConsultation from './pages/ApprovalConsultation';
import AssetDemobilizationManagementPage from './pages/AssetDemobilizationManagementPage';
import { ApprovalVehicle } from './types/Approval';
import FiscalAnalysisPage from './pages/FiscalAnalysisPage';
import PendencyManagementPage from './pages/PendencyManagementPage';
import { Pendency } from './types/Pendency';
import { mockPendencies } from './data/mockPendencies';

function App() {
  const [currentPage, setCurrentPage] = useState<string>('demobilization');
  const [approvalVehicles, setApprovalVehicles] = useState<ApprovalVehicle[]>([]);
  const [pendencies, setPendencies] = useState<Pendency[]>(mockPendencies);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '');
      setCurrentPage(hash || 'demobilization');
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleUpdateApprovals = (updatedVehicles: ApprovalVehicle[]) => {
    setApprovalVehicles(updatedVehicles);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'usuarios':
        return <UserManagement />;
      case 'aprovacao':
        return <ApprovalConsultation approvalVehicles={approvalVehicles} onUpdateVehicles={handleUpdateApprovals} />;
      case 'gestao-desmobilizacao':
        return <AssetDemobilizationManagementPage 
                 allVehicles={approvalVehicles} 
                 liberatedVehicles={approvalVehicles.filter(v => 
                   v.situacao === 'Liberado' || 
                   v.situacao === 'Liberado para Transferência' ||
                   v.situacao === 'Em Manutenção'
                 )} 
                 onUpdateVehicles={setApprovalVehicles} 
                 pendencies={pendencies}
               />;
      case 'analise-fiscal':
        return <FiscalAnalysisPage 
                 vehicles={approvalVehicles} 
                 onUpdateVehicles={setApprovalVehicles} 
                 pendencies={pendencies}
               />;
      case 'tipo-pendencia':
        return <PendencyManagementPage pendencies={pendencies} onUpdatePendencies={setPendencies} />;
      case 'demobilization':
      default:
        return <DemobilizationPage onVehiclesDemobilized={(newVehicles) => setApprovalVehicles(prev => [...prev, ...newVehicles])} demobilizedVehicles={approvalVehicles} />;
    }
  };

  return renderPage();
}

export default App;