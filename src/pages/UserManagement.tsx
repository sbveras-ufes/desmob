import React, { useState, useMemo, useRef, useEffect } from 'react';
import Header from '../components/Header';
import UserBreadcrumb from '../components/UserBreadcrumb';
import { mockVehicles } from '../data/mockData';
import { mockUsers } from '../data/mockUsers';
import { mockFlows as initialFlows } from '../data/mockFlows';
import { ApprovalFlow, FlowUser } from '../types/Flow';
import { Edit, Eye, Plus, Trash2, MoreVertical, XCircle, CheckCircle, X } from 'lucide-react';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';

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

  const handleSave = (flowData: Omit<ApprovalFlow, 'id' | 'status'>) => {
    if (editingFlow) {
      const updatedFlow = { ...editingFlow, ...flowData };
      setFlows(flows.map(f => f.id === editingFlow.id ? updatedFlow : f));
    } else {
      const newFlow = { id: `flow-${Date.now()}`, ...flowData, status: 'Ativo' as const };
      setFlows([...flows, newFlow]);
    }
    setView('list');
  };

  const handleDelete = (flowId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este fluxo?')) {
      setFlows(flows.filter(f => f.id !== flowId));
    }
  };

  const handleToggleStatus = (flowId: string) => {
    setFlows(flows.map(f => f.id === flowId ? { ...f, status: f.status === 'Ativo' ? 'Inativo' : 'Ativo' } : f));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <UserBreadcrumb />
        {view === 'list' ? (
          <FlowListPage flows={flows} onCreateNew={handleCreateNew} onEdit={handleEdit} onDelete={handleDelete} onToggleStatus={handleToggleStatus} />
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

// --- Sub-componente do Menu de Ações ---
const ActionsMenu: React.FC<{ flow: ApprovalFlow; onEdit: (flow: ApprovalFlow) => void; onDelete: (flowId: string) => void; onToggleStatus: (flowId: string) => void; }> = ({ flow, onEdit, onDelete, onToggleStatus }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 rounded-full hover:bg-gray-200">
        <MoreVertical size={18} />
      </button>
      {isOpen && (
        <div className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <a href="#" onClick={(e) => { e.preventDefault(); onEdit(flow); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              <Eye size={16} /> Visualizar
            </a>
            <a href="#" onClick={(e) => { e.preventDefault(); onEdit(flow); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
              <Edit size={16} /> Editar
            </a>
            {flow.status === 'Ativo' ? (
              <a href="#" onClick={(e) => { e.preventDefault(); onToggleStatus(flow.id); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">
                <XCircle size={16} /> Inativar
              </a>
            ) : (
              <a href="#" onClick={(e) => { e.preventDefault(); onToggleStatus(flow.id); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-green-600 hover:bg-gray-100" role="menuitem">
                <CheckCircle size={16} /> Ativar
              </a>
            )}
            <a href="#" onClick={(e) => { e.preventDefault(); onDelete(flow.id); setIsOpen(false); }} className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-gray-100" role="menuitem">
              <Trash2 size={16} /> Excluir
            </a>
          </div>
        </div>
      )}
    </div>
  );
};


// --- Sub-componente da Lista ---
interface FlowListPageProps {
  flows: ApprovalFlow[];
  onCreateNew: () => void;
  onEdit: (flow: ApprovalFlow) => void;
  onDelete: (flowId: string) => void;
  onToggleStatus: (flowId: string) => void;
}

const FlowListPage: React.FC<FlowListPageProps> = ({ flows, onCreateNew, onEdit, onDelete, onToggleStatus }) => {
  const pagination = usePagination(flows);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Fluxos de Aprovação</h1>
        <button onClick={onCreateNew} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus size={20} />
          <span>Novo Fluxo</span>
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição do Fluxo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CRs Selecionados</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pagination.paginatedItems.map(flow => (
                <tr key={flow.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <ActionsMenu flow={flow} onEdit={onEdit} onDelete={onDelete} onToggleStatus={onToggleStatus} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{flow.description}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{flow.crs.join(', ')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${flow.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {flow.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination 
            {...pagination}
            onItemsPerPageChange={pagination.changeItemsPerPage}
            onPageChange={pagination.goToPage}
          />
      </div>
    </div>
  );
};

// --- Sub-componente do Formulário ---
interface FlowFormProps {
  existingFlow: ApprovalFlow | null;
  onSave: (flowData: Omit<ApprovalFlow, 'id' | 'status'>) => void;
  onCancel: () => void;
}

const FlowForm: React.FC<FlowFormProps> = ({ existingFlow, onSave, onCancel }) => {
  const [description, setDescription] = useState(existingFlow?.description || '');
  const [selectedDiretoria, setSelectedDiretoria] = useState(existingFlow?.diretoria || '');
  const [selectedCRs, setSelectedCRs] = useState<string[]>(existingFlow?.crs || []);
  const [flowUsers, setFlowUsers] = useState<FlowUser[]>(existingFlow?.users || []);

  const [crInput, setCrInput] = useState('');
  const [showCrSuggestions, setShowCrSuggestions] = useState(false);
  const crInputRef = useRef<HTMLInputElement>(null);

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
  
  const handleAddCr = (cr: string) => {
    if (cr && !selectedCRs.includes(cr)) {
      setSelectedCRs([...selectedCRs, cr]);
    }
    setCrInput('');
    setShowCrSuggestions(false);
  };

  const handleRemoveCr = (crToRemove: string) => {
    setSelectedCRs(selectedCRs.filter(cr => cr !== crToRemove));
  };
  
  const crSuggestions = useMemo(() => {
    if (!crInput) return [];
    return availableCRs.filter(cr => 
      cr.toLowerCase().includes(crInput.toLowerCase()) && !selectedCRs.includes(cr)
    );
  }, [crInput, availableCRs, selectedCRs]);

  const handleCrInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && crInput) {
      e.preventDefault();
      const exactMatch = availableCRs.find(cr => cr.toLowerCase() === crInput.toLowerCase());
      if (exactMatch) {
        handleAddCr(exactMatch);
      }
    }
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
    if(!description || !selectedDiretoria || flowUsers.length === 0 || flowUsers.some(u => !u.userId || !u.role)) {
      alert('Preencha todos os campos obrigatórios: Descrição, Diretoria e adicione/configure pelo menos um usuário com papel definido.');
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Lista de CR</label>
           <div className="relative" onBlur={() => setTimeout(() => setShowCrSuggestions(false), 200)}>
            <div 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap items-center gap-2 min-h-[42px]"
              onClick={() => crInputRef.current?.focus()}
            >
              {selectedCRs.map(cr => (
                <span key={cr} className="flex items-center gap-1 bg-gray-200 text-sm rounded-md px-2 py-1">
                  {cr}
                  <button type="button" onClick={() => handleRemoveCr(cr)} className="text-gray-600 hover:text-black">
                    <X size={14} />
                  </button>
                </span>
              ))}
              <input
                ref={crInputRef}
                type="text"
                value={crInput}
                onChange={(e) => setCrInput(e.target.value)}
                onFocus={() => setShowCrSuggestions(true)}
                onKeyDown={handleCrInputKeyDown}
                className="flex-grow bg-transparent outline-none text-sm"
                placeholder={selectedCRs.length > 0 ? '' : 'Digite para adicionar CR...'}
                disabled={!selectedDiretoria}
              />
            </div>
            {showCrSuggestions && crSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                {crSuggestions.map(cr => (
                  <button
                    key={cr}
                    type="button"
                    onMouseDown={() => handleAddCr(cr)}
                    className="w-full px-3 py-2 text-left hover:bg-gray-100 text-sm"
                  >
                    {cr}
                  </button>
                ))}
              </div>
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