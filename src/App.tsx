import React, { useState } from 'react';
import UserManagement from './pages/UserManagement';
import DemobilizationPage from './pages/DemobilizationPage';
import ApprovalConsultation from './pages/ApprovalConsultation';
import AssetDemobilizationManagementPage from './pages/AssetDemobilizationManagementPage';
import { ApprovalVehicle } from './types/Approval';

function App() {
  const [currentPage, setCurrentPage] = useState<'demobilization' | 'users' | 'approval' | 'management'>('demobilization');
  const [approvalVehicles, setApprovalVehicles] = useState<ApprovalVehicle[]>([]);

  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/usuarios') {
        setCurrentPage('users');
      } else if (hash === '#/aprovacao') {
        setCurrentPage('approval');
      } else if (hash === '#/gestao-desmobilizacao') {
        setCurrentPage('management');
      } else {
        setCurrentPage('demobilization');
      }
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

  if (currentPage === 'users') {
    return <UserManagement />;
  }

  if (currentPage === 'approval') {
    return (
      <ApprovalConsultation 
        approvalVehicles={approvalVehicles} 
        onUpdateVehicles={handleUpdateApprovals}
      />
    );
  }
  
  if (currentPage === 'management') {
    return <AssetDemobilizationManagementPage 
             liberatedVehicles={approvalVehicles.filter(v => v.situacao === 'Liberado para Desmobilização' || v.situacao === 'Liberado para Transferência')} 
             onUpdateVehicles={setApprovalVehicles}
           />;
  }

  return (
    <DemobilizationPage 
      onVehiclesDemobilized={(newVehicles) => setApprovalVehicles(prev => [...prev, ...newVehicles])}
      demobilizedVehicles={approvalVehicles} 
    />
  );
}

export default App;