import React, { useState, useMemo } from 'react';
import Header from '../components/Header';
import UserBreadcrumb from '../components/UserBreadcrumb';
import { mockVehicles } from '../data/mockData';
import { mockUsers } from '../data/mockUsers';
import { mockFlows as initialFlows } from '../data/mockFlows';
import { ApprovalFlow, FlowUser } from '../types/Flow';
import { Edit, Eye, Plus, Trash2 } from 'lucide-react';

// Renomeando a página para refletir a nova funcionalidade
const FlowManagementPage: React.FC = () => {
  const [view, setView] = useState<'list' | 'form'>('list');
  const [flows, setFlows] = useState<ApprovalFlow[]>(initialFlows);
  const [editingFlow, setEditingFlow] = useState<ApprovalFlow | null>(null);

  const handleCreateNew = () => {
    setEditingFlow(null);
    setView('form');
  };

  const handleEdit = (flow: ApprovalFlow) => {
    setEditingFlow(flow);
    setView('form');
  };

  const handleSave = (flowData: Omit<ApprovalFlow, 'id'>) => {
    if (editingFlow) {
      const updatedFlow = { ...editingFlow, ...flowData };
      setFlows(flows.map(f => f.id === editingFlow.id ? updatedFlow : f));
    } else {
      const newFlow = { id: `flow-${Date.now()}`, ...flowData };
      setFlows([...flows, newFlow]);
    }
    setView('list');
  };

  const handleDelete = (flowId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este fluxo?')) {
      setFlows(flows.filter(f => f.id !== flowId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserBreadcrumb />
        {view === 'list' ? (
          <FlowListPage flows={flows} onCreateNew={handleCreateNew} onEdit={handleEdit} onDelete={handleDelete} />
        ) : (
          <FlowForm
            existingFlow={editingFlow}
            onSave={handleSave}
            onCancel={() => setView('list')}
          />
        )}
      </main>
    </div>
  );
};

// Componente para listar os fluxos
interface FlowListPageProps {
  flows: ApprovalFlow[];
  onCreateNew: () => void;
  onEdit: (flow: ApprovalFlow) => void;
  onDelete: (flowId: string) => void;
}

const FlowListPage: React.FC<FlowListPageProps> = ({ flows, onCreateNew, onEdit, onDelete }) => (
  <div>
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Fluxos de Aprovação</h1>
      <button onClick={onCreateNew} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        <Plus size={20} />
        <span>Novo Fluxo</span>
      </button>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição do Fluxo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRs Selecionados</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {flows.map(flow => (
            <tr key={flow.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{flow.description}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{flow.crs.join(', ')}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onClick={() => onEdit(flow)} className="text-blue-600 hover:text-blue-900"><Eye size={18} /></button>
                <button onClick={() => onEdit(flow)} className="text-indigo-600 hover:text-indigo-900"><Edit size={18} /></button>
                <button onClick={() => onDelete(flow.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// Componente do formulário de criação/edição
interface FlowFormProps {
  existingFlow: ApprovalFlow | null;
  onSave: (flowData: Omit<ApprovalFlow, 'id'>) => void;
  onCancel: () => void;
}

const FlowForm: React.FC<FlowFormProps> = ({ existingFlow, onSave, onCancel }) => {
  const [description, setDescription] = useState(existingFlow?.description || '');
  const [selectedDiretoria, setSelectedDiretoria] = useState(existingFlow?.diretoria || '');
  const [selectedCRs, setSelectedCRs] = useState<string[]>(existingFlow?.crs || []);
  const [flowUsers, setFlowUsers] = useState<FlowUser[]>(existingFlow?.users || []);

  const { uniqueDiretorias } = useMemo(() => {
    const uniqueDiretorias = [...new Set(mockVehicles.map(v => v.diretoria))].sort();
    return { uniqueDiretorias };
  }, []);

  const availableCRs = useMemo(() => {
    if (!selectedDiretoria) return [];
    return [...new Set(mockVehicles.filter(v => v.diretoria === selectedDiretoria).map(v => v.cr))].sort();
  }, [selectedDiretoria]);

  const handleDiretoriaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDiretoria = e.target.value;
    setSelectedDiretoria(newDiretoria);
    const allCrsForDiretoria = [...new Set(mockVehicles.filter(v => v.diretoria === newDiretoria).map(v => v.cr))].sort();
    setSelectedCRs(allCrsForDiretoria);
  };

  const handleCrToggle = (cr: string) => {
    setSelectedCRs(prev =>
      prev.includes(cr) ? prev.filter(c => c !== cr) : [...prev, cr]
    );
  };
  
  const handleAddUser = () => {
    setFlowUsers(prev => [...prev, { id: Date.now(), userId: '', role: '' }]);
  };

  const handleUserChange = (index: number, newUserId: string) => {
    setFlowUsers(prev => prev.map((user, i) => i === index ? { ...user, userId: newUserId } : user));
  };
  
  const handleRoleChange = (index: number, newRole: FlowUser['role']) => {
    setFlowUsers(prev => prev.map((user, i) => i === index ? { ...user, role: newRole } : user));
  };

  const handleSaveClick = () => {
    if(!description || !selectedDiretoria || flowUsers.length === 0) {
      alert('Preencha a descrição, diretoria e adicione pelo menos um usuário.');
      return;
    }
    const finalSelectedCRs = selectedCRs.length === 0 ? availableCRs : selectedCRs;
    onSave({ description, diretoria: selectedDiretoria, crs: finalSelectedCRs, users: flowUsers });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {existingFlow ? 'Editar Fluxo de Aprovação' : 'Novo Fluxo de Aprovação'}
      </h1>

      <div className="mb-6">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descrição do FLUXO"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="border border-gray-300 rounded-md p-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Diretoria*</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Lista de CR (selecione para remover)</label>
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
            <select
              value={flowUser.role}
              onChange={(e) => handleRoleChange(index, e.target.value as FlowUser['role'])}
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Selecione o papel</option>
              <option value="Análise Supervisor">Análise Supervisor</option>
              <option value="Análise Gerente">Análise Gerente</option>
              <option value="Análise Diretor">Análise Diretor</option>
            </select>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveClick}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default FlowManagementPage;