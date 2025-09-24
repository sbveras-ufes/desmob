import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import UserBreadcrumb from '../components/UserBreadcrumb';
import { mockVehicles } from '../data/mockData';
import { mockUsers } from '../data/mockUsers';

type FlowUser = {
  id: number;
  userId: string;
};

const UserManagement: React.FC = () => {
  const [description, setDescription] = useState('');
  const [selectedDiretoria, setSelectedDiretoria] = useState('');
  const [selectedCRs, setSelectedCRs] = useState<string[]>([]);
  const [flowUsers, setFlowUsers] = useState<FlowUser[]>([]);

  const { uniqueDiretorias, allCRs } = useMemo(() => {
    const uniqueDiretorias = [...new Set(mockVehicles.map(v => v.diretoria))].sort();
    const allCRs = [...new Set(mockVehicles.map(v => v.cr))].sort();
    return { uniqueDiretorias, allCRs };
  }, []);

  const availableCRs = useMemo(() => {
    if (!selectedDiretoria) return [];
    return [...new Set(mockVehicles.filter(v => v.diretoria === selectedDiretoria).map(v => v.cr))].sort();
  }, [selectedDiretoria]);

  const handleDiretoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDiretoria(e.target.value);
    setSelectedCRs([]); // Reset CRs when directorate changes
  };

  const handleCrToggle = (cr: string) => {
    setSelectedCRs(prev =>
      prev.includes(cr) ? prev.filter(c => c !== cr) : [...prev, cr]
    );
  };
  
  const handleAddUser = () => {
    setFlowUsers(prev => [...prev, { id: Date.now(), userId: '' }]);
  };

  const handleUserChange = (index: number, userId: string) => {
    setFlowUsers(prev => {
      const newUsers = [...prev];
      newUsers[index].userId = userId;
      return newUsers;
    });
  };
  
  const getApprovalRole = (userId: string) => {
    const user = mockUsers.find(u => u.id === userId);
    if (!user) return '';
    
    // Assuming 'Gerente' is the 'Gestor Contrato'
    const roleMap = {
      'Supervisor': 'Análise Supervisor',
      'Gestor Contrato': 'Análise Gerente',
      'Diretor': 'Análise Diretor'
    };
    
    return roleMap[user.cargo] || '';
  };

  const handleSave = () => {
    const finalSelectedCRs = selectedCRs.length === 0 ? availableCRs : selectedCRs;
    
    const payload = {
      description,
      diretoria: selectedDiretoria,
      crs: finalSelectedCRs,
      users: flowUsers
    };
    
    // Here you would typically send the payload to an API
    alert('Fluxo salvo com sucesso!\n' + JSON.stringify(payload, null, 2));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserBreadcrumb />
        
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Parametrizar fluxo aprovação Desmobilização Operação
          </h1>

          <div className="mb-6">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrição do FLUXO (input de texto)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-300 rounded-md p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Diretoria* (1-1)</label>
              <select
                value={selectedDiretoria}
                onChange={handleDiretoriaChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione uma diretoria</option>
                {uniqueDiretorias.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            
            <div className="border border-gray-300 rounded-md p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Lista de CR</label>
              <div className="max-h-32 overflow-y-auto">
                {selectedDiretoria ? (
                  availableCRs.map(cr => (
                    <div key={cr} className="flex items-center">
                      <input
                        type="checkbox"
                        id={cr}
                        checked={selectedCRs.includes(cr)}
                        onChange={() => handleCrToggle(cr)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={cr} className="ml-2 text-sm text-gray-700">{cr}</label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Selecione uma diretoria para ver os CRs.</p>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleAddUser}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
          >
            Add Usuário
          </button>

          <div className="space-y-4 mb-8">
            {flowUsers.map((flowUser, index) => (
              <div key={flowUser.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <select
                  value={flowUser.userId}
                  onChange={(e) => handleUserChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Selecione um usuário</option>
                  {mockUsers.map(user => (
                    <option key={user.id} value={user.id}>{user.nome}</option>
                  ))}
                </select>
                <div className="px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600">
                  Ordem aprovação - {getApprovalRole(flowUser.userId) || '...'}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={() => { /* Lógica de cancelamento */ }}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;