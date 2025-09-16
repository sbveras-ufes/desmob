import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User, UserFormData } from '../types/User';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => void;
  editingUser?: User | null;
  existingUsers: User[];
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingUser,
  existingUsers
}) => {
  const [formData, setFormData] = useState<UserFormData>({
    nome: '',
    email: '',
    cargo: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [supervisorWarning, setSupervisorWarning] = useState('');

  useEffect(() => {
    if (editingUser) {
      setFormData({
        nome: editingUser.nome,
        email: editingUser.email,
        cargo: editingUser.cargo
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        cargo: ''
      });
    }
    setErrors({});
    setSupervisorWarning('');
  }, [editingUser, isOpen]);

  // Verificar se já existe um supervisor
  const existingSupervisor = existingUsers.find(user => 
    user.cargo === 'Supervisor' && 
    (!editingUser || user.id !== editingUser.id)
  );
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail deve ter um formato válido';
    }

    if (!formData.cargo) {
      newErrors.cargo = 'Cargo é obrigatório';
    }

    // Validação específica para Supervisor
    if (formData.cargo === 'Supervisor' && existingSupervisor) {
      newErrors.cargo = `Já existe um Supervisor: ${existingSupervisor.nome}`;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof UserFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Mostrar aviso quando selecionar Supervisor
    if (field === 'cargo' && value === 'Supervisor' && existingSupervisor) {
      setSupervisorWarning(`Atenção: Já existe um usuário com perfil Supervisor (${existingSupervisor.nome}). Apenas um Supervisor é permitido.`);
    } else {
      setSupervisorWarning('');
    }
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {editingUser ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.nome ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite o nome completo"
              />
              {errors.nome && (
                <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Digite o e-mail"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cargo <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.cargo}
                onChange={(e) => handleInputChange('cargo', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.cargo ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione o cargo</option>
                <option value="Gestor Contrato">Gestor Contrato</option>
                <option 
                  value="Supervisor"
                  disabled={existingSupervisor && (!editingUser || editingUser.cargo !== 'Supervisor')}
                >
                  Supervisor {existingSupervisor && (!editingUser || editingUser.cargo !== 'Supervisor') ? '(Já existe)' : ''}
                </option>
              </select>
              {errors.cargo && (
                <p className="mt-1 text-sm text-red-600">{errors.cargo}</p>
              )}
              {supervisorWarning && (
                <p className="mt-1 text-sm text-yellow-600">{supervisorWarning}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {editingUser ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;