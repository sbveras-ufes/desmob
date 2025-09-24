import React, { useState } from 'react';
import UserManagement from './pages/UserManagement';
import DemobilizationPage from './pages/DemobilizationPage';
import ApprovalConsultation from './pages/ApprovalConsultation';
import { ApprovalVehicle } from './types/Approval';

function App() {
  const [currentPage, setCurrentPage] = useState<'demobilization' | 'users' | 'approval'>('demobilization');
  const [approvalVehicles, setApprovalVehicles] = useState<ApprovalVehicle[]>([]);

  // Simple routing based on URL hash
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#/usuarios') {
        setCurrentPage('users');
      } else if (hash === '#/aprovacao') {
        setCurrentPage('approval');
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

  // Update header links to use hash routing
  React.useEffect(() => {
    const updateHeaderLinks = () => {
      const demobilizationLink = document.querySelector('a[href="/"]');
      const usersLink = document.querySelector('a[href="/usuarios"]');
      const approvalLink = document.querySelector('a[href="/aprovacao"]');
      
      if (demobilizationLink) {
        demobilizationLink.setAttribute('href', '#/');
      }
      if (usersLink) {
        usersLink.setAttribute('href', '#/usuarios');
      }
      if (approvalLink) {
        approvalLink.setAttribute('href', '#/aprovacao');
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(updateHeaderLinks, 100);
  }, [currentPage]);

  if (currentPage === 'users') {
    return <UserManagement />;
  }

  if (currentPage === 'approval') {
    return (
      <ApprovalConsultation 
        approvalVehicles={approvalVehicles} 
        onUpdateVehicles={setApprovalVehicles}
      />
    );
  }

  return (
    <DemobilizationPage 
      onVehiclesDemobilized={(newVehicles) => setApprovalVehicles(prev => [...prev, ...newVehicles])}
      demobilizedVehicles={approvalVehicles} 
    />
  );
}

export default App;