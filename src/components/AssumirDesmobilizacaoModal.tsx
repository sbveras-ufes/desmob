import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ApprovalVehicle } from '../types/Approval';
import { User } from '../types/User';

interface AssumirDesmobilizacaoModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicles: ApprovalVehicle[];
  users: User[];
  onConfirm: (responsavelNome: string) => void;
}

const AssumirDesmobilizacaoModal: React.FC<AssumirDesmobilizacaoModalProps> = ({
  isOpen,
  onClose,
  vehicles,
  users,
  onConfirm,
}) => {
  const [selectedUserId, setSelectedUserId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedUserId('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedUserId) {
      setError('É obrigatório selecionar um responsável.');
      return;
    }
    const selectedUser = users.find(u => u.id === selectedUserId);
    if (selectedUser) {
      onConfirm(selectedUser.nome);
      onClose();
    } else {
      setError('Usuário selecionado não encontrado.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Assumir Desmobilização</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          {/* Tabela de Veículos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Veículos Selecionados</h3>
            <div className="overflow-x-auto border rounded-lg max-h-48">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Placa</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Chassi</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Modelo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vehicles.map(v => (
                    <tr key={v.id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.placa}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.chassi}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">{v.modelo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Seleção de Responsável */}
          <div>
            <label htmlFor="responsavel" className="block text-sm font-medium text-gray-700 mb-2">
              Responsável pela Desmobilização <span className="text-red-500">*</span>
            </label>
            <select
              id="responsavel"
              value={selectedUserId}
              onChange={(e) => {
                setSelectedUserId(e.target.value);
                if (error) setError('');
              }}
              className={`w-full bg-white border rounded-md shadow-sm pl-3 pr-10 py-2 text-left focus:outline-none focus:ring-1 sm:text-sm ${
                error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
            >
              <option value="">Selecione um usuário</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.nome}</option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        </div>

        <div className="flex justify-end space-x-4 p-4 border-t border-gray-200 mt-auto">
          <button onClick={onClose} className="px-6 py-2 border rounded-md">Cancelar</button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            disabled={!selectedUserId}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssumirDesmobilizacaoModal;