import React, { useState } from 'react';
import UserManagement from './pages/UserManagement';
import DemobilizationPage from './pages/DemobilizationPage';
import ApprovalConsultation from './pages/ApprovalConsultation';
import AssetDemobilizationManagementPage from './pages/AssetDemobilizationManagementPage';
import { ApprovalVehicle } from './types/Approval';

function App() {
  const [currentPage, setCurrentPage] = useState<'demobilization' | 'users' | 'approval' | 'management'>('demobilization');
  const [approvalVehicles, setApprovalVehicles] = useState<ApprovalVehicle[]>([]);
  const [liberatedVehicles, setLiberatedVehicles] = useState<ApprovalVehicle[]>([]);

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
    
    const newlyLiberated = updatedVehicles.filter(v => 
      v.situacao === 'Liberado para Desmobilização' && 
      !liberatedVehicles.some(lv => lv.id === v.id)
    );

    if (newlyLiberated.length > 0) {
      setLiberatedVehicles(prev => [...prev, ...newlyLiberated]);
    }
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
    return <AssetDemobilizationManagementPage liberatedVehicles={liberatedVehicles.filter(v => v.situacao === 'Liberado para Desmobilização')} />;
  }

  return (
    <DemobilizationPage 
      onVehiclesDemobilized={(newVehicles) => setApprovalVehicles(prev => [...prev, ...newVehicles])}
      demobilizedVehicles={approvalVehicles} 
    />
  );
}

export default App;